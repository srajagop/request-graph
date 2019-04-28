const Utils = require('../utils/utils');

class Domain {
    constructor(domainName, groupName){               
       this.domainName = domainName;
       this.requestCount = 1;
       this.group = groupName;
        //this.color = `hsl(${Math.floor(Math.random() * (360 - 0 + 1)) + 0}, 99%, 50%)`;
       this.color = Utils.colorPalette[Math.floor(Math.random() * Utils.colorPalette.length)];
    }
    increment(){
        ++this.requestCount;
    }
    getCount(){
        return this.requestCount;
    }
    getColor(){
        return this.color;
    }
}

module.exports = Domain;