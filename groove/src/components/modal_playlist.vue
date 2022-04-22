<script setup>
import { ref,inject, watch } from "vue";

const $bus=inject("$bus")

var active=ref(false)
var add_or_modify=ref('add')
var author='me'
var INPUT_NAME=ref(null)
var INPUT_DESC=ref(null)

var res={
  name:'',
  desc:''
}
var resfn,rejfn;


$bus.reg('open_modal_playlist', function (method='add',name, desc) {
  add_or_modify.value=method
  res.name=res.desc=''
  active.value=true
  INPUT_NAME.value.value=name||''
  INPUT_DESC.value.value=desc||''

  setTimeout(() => {
    INPUT_NAME.value.focus()
  }, 0);
  return new Promise((resolve,reject)=>{
    // var poll=watch(active,_=>{
    //   // console.log('watch');
    //   if(res.name)resolve(res)
    //   else reject('modal close')
    //   poll()
    // })
    resfn=resolve,rejfn=reject
  })

})



function validate(name,desc){
  if(!name)return false
  else{
    return true
  }
}
function hide(){
  res.name=res.desc=''
  active.value=false
  rejfn('modal close')
}
function submit(){

  if(validate(INPUT_NAME.value.value,INPUT_DESC.value.value)){
    res.name=INPUT_NAME.value.value
    res.desc=INPUT_DESC.value.value
    active.value=false
    resfn(res)
  }
  else {
    return INPUT_NAME.value.focus()
  }

}

</script>


<template>
  <div :class="['modal',{'modal_mask':active}]" @click="hide">
    <div class="modal_content" @click.stop="">
      <input ref="INPUT_NAME" placeholder="名称"/>
      <input ref="INPUT_DESC" placeholder="描述"/>
      <button v-if="add_or_modify==='add'" type="submit" @click="submit" >创建歌单</button>
      <button v-if="add_or_modify==='modify'" type="submit" @click="submit">提交</button>
      <button class="modal_close" @click="hide">取消</button>
    </div>
  </div>
</template>

<style>

.modal {
  /* display: none; */
  /* conflict with transition */
  /* unless settimeout add class */
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* transition: opacity 0.5s ease-in-out; */
}
/* dont mess up order */
.modal_mask {
  z-index: 9;
  opacity: 1;
  background: rgba(0, 0, 0, 0.5);
}


@media (max-width: 600px) {
  .modal_content {
    width: 100%;
    left:0;
    top:auto;
    bottom: 100px;
  }
}


.modal_content {
  position: absolute;
  top: 30%;
  left:calc(50% - 150px);
  width: 300px;
  height: 400px;
  background-color: white;
  visibility: hidden;
  opacity: 0;

  transition: opacity 0.5s ease-in-out;
}
.modal_mask .modal_content {
  /* z-index: 1; */
  opacity: 1;
  visibility: visible;

}
.modal_content input,.modal_content button{
  display: block;
  margin:40px auto 0 auto;
}

.modal_content input {

  width: 260px;
  height: 60px;

  font-size: 32px;
  background-color: #f1f1f1;
}
.modal_content button[type="submit"] {

  width: 200px;
  height: 40px;
  border: 0;

  font-size: 24px;
  color: white;
  background-color: orange;
}
.modal_content button[type="submit"]:hover {
  color: black;

}
.modal_content .modal_close {

  width: 200px;
  height: 40px;
  border: 0;
  font-size: 24px;
  text-align: center;
  border:0;

}

.modal_content .modal_close:hover{
  background-color: red;
}

</style>