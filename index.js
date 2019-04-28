const puppeteer   = require('puppeteer');
const Link        = require('./model/link');
const Domain      = require('./model/domain');
const Utils       = require('./utils/utils');
const fs          = require('fs');
const util        = require('util');
const open        = require('open');
(async () => {
  
  const browser   = await puppeteer.launch();
  const page      = await browser.newPage();
  let requests    = [];
  let domainMap   = {};
  let siteLink    = "https://www.nike.com/";
  let siteDomain  = Utils.getDomain(siteLink);
  const client    = await page.target().createCDPSession();

  await client.send('Network.enable');

  await client.on('Network.requestWillBeSent', async e => {
    let domainName = Utils.getDomain(e.request.url);
    var referer;
    if(domainName){
      //if domain is already found just increase the frequency of it
      if(domainMap[domainName]){
        domainMap[domainName].increment()
      } else {

        if(domainName == siteDomain) {
          referer = siteDomain;
        } else {
          
          if(e.initiator.url){
            referer = Utils.getDomain(e.initiator.url);           
          } else if(e.initiator.stack){
            referer = Utils.getDomain(e.initiator.stack.callFrames[0].url);             
          } else if(e.initiator.type == 'other') {
            referer = Utils.getDomain(e.request.headers.Referer); 
          } else {
            console.log("no referrer for url", e.request.url)
          }        

          console.log('domainName', domainName, referer)
        }
        domainMap[domainName] = new Domain(domainName, referer);      
      } 
      requests.push(new Link(domainName, e));   
    }
    //console.log(getDomain(e.request.url), " :: ",e.request.url, " :: ");
   
  });
  console.log('Collecting data....');
  await page.goto(siteLink, {waitUntil: 'networkidle2'});
    
  console.log('Preparing output...');
  //prepare output
  var nodes = [];
  var edges = [];
  /*const readFile = util.promisify(fs.readFile);
  const writeFile = util.promisify(fs.writeFile)*/
  Object.keys(domainMap).forEach((key, index)=>{
    
    nodes.push({'id': key, 'value': domainMap[key].getCount(), 'label': key, 'shape': 'dot', /*'color': domainMap[key].getColor(),*/ 'size':domainMap[key].getCount(), 'group': domainMap[key].group});
    edges.push({'from': domainMap[key].group, 'to': domainMap[key].domainName, 'value': domainMap[key].requestCount})
  });

  var data = fs.readFileSync('./template/template.html', {encoding: 'utf8'});
  var result = data.replace(/<!---@@nodes@@-->/g, JSON.stringify(nodes)).replace(/<!---@@edges@@-->/g, JSON.stringify(edges) );

  fs.writeFileSync('./output/output.html', result, {encoding: 'utf8'});
  console.log('DONE')
  //await open(__dirname+'/output/output.html', {app: 'Chrome'});
  await browser.close();
})();
