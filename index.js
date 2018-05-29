const puppeteer = require('puppeteer');
const Link = require('./model/link');
const getDomain = require('./utils');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let requests = [];
  let requestMap = {};

  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  await client.on('Network.requestWillBeSent', async e => {
    requests[e.request.url] = e.initiator;
    let domainName = getDomain(e.request.url);
    if(domainName){
      requestMap[domainName] = new Link(domainName, e);
    }
    
    // console.log(getDomain(e.request.url), " :: ",e.request.url);
    if(e.initiator.hasOwnProperty('stack')){
       //console.log( e.initiator.stack.callFrames[0])
    }
  });

  await page.goto('https://news.ycombinator.com/', {waitUntil: 'networkidle2'});
  //await page.pdf({path: 'hn.pdf', format: 'A4'});
  //console.log(requests);
  await browser.close();
})();
