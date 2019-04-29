var colorPalette = [
"rgb(0, 205, 225)",
"rgb(0, 255, 255)",
"rgb(255, 65, 80)",
"rgb(255, 84, 103)",
"rgb(255, 104, 128)",
"rgb(255, 133, 83)",
"rgb(255, 171, 107)",
"rgb(255, 212, 132)",
"rgb(255, 255, 103)",
"rgb(255, 255, 133)",
"rgb(255, 255, 165)"
];

function getDomainName(url) {
    return new URL(url).hostname;
}

function getInitiator(requestEvent){
    if(requestEvent.initiator.url){
        return getDomainName(requestEvent.initiator.url);           
    } 
    if(requestEvent.initiator.stack){
        return getDomainName(requestEvent.initiator.stack.callFrames[0].url);             
    } 
    if(requestEvent.initiator.type == 'other') {
        if(requestEvent.request.headers.Referer) return getDomainName(requestEvent.request.headers.Referer); 
    } else {
        console.log("no referrer for url", requestEvent.request.url)
        return requestEvent.request.url;       
    }  
}
module.exports = {
    colorPalette: colorPalette,
    getDomain: getDomainName,
    getInitiator: getInitiator
};