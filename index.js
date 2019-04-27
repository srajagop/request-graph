const puppeteer   = require('puppeteer');
const Link        = require('./model/link');
const Domain       = require('./model/domain');
const getDomain   = require('./utils');
const fs          = require('fs');
const util        = require('util');
const open        = require('open');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let requests = [];
  let domainMap = {};

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  await client.on('Network.requestWillBeSent', async e => {
    let domainName = getDomain(e.request.url);
    if(domainName){
      if(domainMap[domainName]){
        domainMap[domainName].increment()
      } else {
        domainMap[domainName] = new Domain(domainName);      
      } 
    requests.push(new Link(domainName, e));   
    }
    //console.log(getDomain(e.request.url), " :: ",e.request.url, " :: ");
   
  });
  console.log('Collecting data....');
  await page.goto('https://www.nike.com/', {waitUntil: 'networkidle2'});
  //await page.pdf({path: 'hn.pdf', format: 'A4'});
  console.log('Preparing output...');
  //prepare output
  var nodes = [];
  const readFile = util.promisify(fs.readFile);
  const writeFile = util.promisify(fs.writeFile)

  Object.keys(domainMap).forEach((key, index)=>{
    nodes.push({'id': key, 'value': domainMap[key].getCount(), 'label': key, 'shape': 'dot', 'color': domainMap[key].getColor(), 'size':domainMap[key].getCount()});
  });

  var data = fs.readFileSync('./template/template.html', {encoding: 'utf8'});
  var result = data.replace(/<!---@@nodes@@-->/g, JSON.stringify(nodes));

  fs.writeFileSync('./output/output.html', result, {encoding: 'utf8'});
  console.log('DONE')
  await open(__dirname+'/output/output.html', {app: 'Chrome'});
  await browser.close();
})();
