class Domain {
    constructor(domainName){               
       this.domainName = domainName;
       this.requestCount = 1;
       this.color = `hsl(${Math.floor(Math.random() * (360 - 0 + 1)) + 0}, 99%, 50%)`;
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