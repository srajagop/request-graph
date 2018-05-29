class Link {
    constructor(label, request){
        this.id = label;
        this.value = 0;
        this.label = label;
        this.request = request;
        this.color = '';
    }

    setGrpColor() {
        this.color = `hsl(${Math.floor(Math.random() * (360 - 0 + 1)) + 0}, 99%, 50%)`;
    }
}

module.exports = Link;

function* idMaker() {
    var index = 0;
    while(true)
      yield index++;
}
  
const gen = idMaker();