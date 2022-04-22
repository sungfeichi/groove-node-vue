export default class CargoShip{
    constructor(){
        this.ship = {};
    }
    load(container,...cargo){
        this.ship.container=this.ship.container||[]
        this.ship.container.push(...cargo)
    }
    unload(container){
        this.ship.container.splice(0,this.ship.container.length)
    }
    dump(container,item){
        var idx= this.ship.container.indexOf(item)
        this.ship.container.splice(idx,1)
    }

}
