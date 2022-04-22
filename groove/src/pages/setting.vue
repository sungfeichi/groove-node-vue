<script setup>
import { ref,inject, watch } from "vue";
import axios from 'axios'
import { axioserr } from "../lib/util";

var active=ref(false)

var folders=ref([])
var FILE=ref()
// var form=ref()
// var resfn,rejfn;

var SERVER = inject("SERVER")
axios(SERVER+"api/folders")
  .then(v=>folders.value=v.data)
  .catch(e=>axioserr(e))

function openModal() {
  active.value=true
  FILE.value.value=''
  // return new Promise((resolve,reject)=>{
  //   resfn=resolve,rejfn=reject
  // }).then(v=>{
    
  // })
}

async function submit(){
  active.value=false
  let fd=FILE.value.value
  //if file is empty sync frontend backend 
  if(fd!=""){
    var [err,res]=await axios.post(SERVER+"api/folders",{
      item:fd
    }).to()
    if(err){
      return axioserr(err)
    }
    folders.value.push(fd)
  }
}

async function del(item){
  var [err,res]=await axios.delete(SERVER+"api/folders",{data:{
    item:item
  }}).to()
  if(err){
    return axioserr(err)
  }
  folders.value.splice(folders.value.indexOf(item),1)
}

</script>



<template>
  <div class="controlspan">
    <h1>此PC上的音乐</h1>
    <span class="lcbt"
      @click="openModal"
    >选择查找音乐的位置</span>
  </div>
  <div :class="['modal','setting',{'modal_mask':active}]">
    <div class="modal_content" @click.stop="">
      <p style="font-size:24px">从本地曲库创建个人收藏</p>
      <form ref="form" @submit.prevent="submit">
        <input ref="FILE" />
      </form>
      <p style="font-size:16px">现在我们正在查看这些文件夹</p>
      <!-- <input type="file" ref="FILE" id="setting_file" @change="submit($event)" />
      <div>
        <label for="setting_file">+</label>
        can't get real full path fakepath issue
      </div> -->
      <div class="folders">

        <div v-for="folder in folders"
        class="fditem">
        {{folder}}
        <button class="fd_del" @click="del(folder)">
          <i class="fa fa-close"></i>
        </button>
        </div>
      </div>
      <button class="submit" @click="submit">完成</button>
    </div>
  </div>
</template>

<style>
/* input[type="file"]{
  display: none;
} */

.controlspan .lcbt{
  color: orange;
}
.setting .folders{
  overflow: auto;
  height:200px;
}
.setting .fditem{
  height:50px;
  position:relative;
  background-color: azure;
}
.setting .fditem button{
  background-color: red;
  position: absolute;
  right:0;
  top:0;
  width:50px;
  height:100%;
  margin:0;
  border: 0;
}
.setting .submit{
  width:100px;
  height:30px;
  background-color: orange;
  margin-top: 0;
}

</style>