class Link {
    constructor(label, requestEvent){
        this.id = label;
        this.label = label;
        this.requestEvent = requestEvent;
        this.color = '';
        this.url = requestEvent.request.url;
        this.initiator = requestEvent.initator;
        this.initiatorStackObject;

        if(requestEvent.initiator.hasOwnProperty('stack')){
            this.initiatorStackObject =  requestEvent.initiator.stack.callFrames[0];
        }
    }

    setGrpColor() {
        this.color = `hsl(${Math.floor(Math.random() * (360 - 0 + 1)) + 0}, 99%, 50%)`;
    }

    incrementSize() {
        this.value++;
    }
}

module.exports = Link;

function* idMaker() {
    var index = 0;
    while(true)
      yield index++;
}
  
const gen = idMaker();