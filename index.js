const puppeteer = require('puppeteer');
const Link = require('./model/link');
const getDomain = require('./utils');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let requests = [];
  let requestMap = {};
  /*await page.setRequestInterception(true);
  page.on('request', request => {
    //allowing through all requests, should (?) be seen as a no-op.
    //However, coolblue.nl get's scrambled completely.
	console.log(request.initiator)
    request.continue();
  });*/
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');

  // added configuration
  /*await client.send('Network.setRequestInterception', {
    patterns: [{ urlPattern: '*' }],
  });

  await client.on('Network.requestIntercepted', async e => {
    console.log('EVENT INFO: ',e);
    console.log(e.interceptionId);
    console.log(e.resourceType);
    console.log(e.isNavigationRequest);

    // pass all network requests (not part of a question)
    await client.send('Network.continueInterceptedRequest', {
      interceptionId: e.interceptionId,
    });
  });*/
  await client.on('Network.requestWillBeSent', async e => {
     requests[e.request.url] = e.initiator;
     console.log(getDomain(e.request.url), " :: ",e.request.url);
     if(e.initiator.hasOwnProperty('stack')){
       //console.log( e.initiator.stack.callFrames[0])
     }
  });

  await page.goto('https://www.nike.com/us/en_us/', {waitUntil: 'networkidle2'});
  //await page.pdf({path: 'hn.pdf', format: 'A4'});
  //console.log(requests);
  await browser.close();
})();
