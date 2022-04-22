Promise.prototype.to=function(){
   return this.then(data=>{
       return [null,data]
   })
   .catch(err=>[err])
}