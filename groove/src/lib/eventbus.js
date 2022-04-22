import { reactive, computed } from "vue";

export default class EventBus {
    constructor() {
        this.events = {};
        this.shared = reactive(new Map())

        this.activity={};
        //can also act like cargoship as long as dont emit cargo
    }
    emit(eventName, ...data) {
        
        return new Promise((resolve,reject)=>{
            if (this.events[eventName]) {
                this.events[eventName].forEach(function (fn) {
                    if (typeof fn === 'function')
                        fn(...data);
                    else
                        reject()
                });

                resolve()
            }
        })
    }
    on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }

    off(eventName, fn) {
        if (this.events[eventName]) {
            var idx = this.events[eventName].indexOf(fn)
            this.events[eventName].splice(idx, 1)
        }
    }
    unlisten(eventName) {
        if (this.events[eventName]) {
            this.events[eventName].splice(0, this.events[eventName].length)
        }
    }
    anyshare(key,reactive_obj){
        this.shared.set(key,reactive_obj)
    }
    anyinject(key){
        return computed(()=> this.shared.get(key))
    }
    reg(action,fn){
        this.activity[action]=fn
    }
    act(action,...data){
        return this.activity[action](...data)
    }

}
