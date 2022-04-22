<script setup>
import { ref, inject,watch } from "vue";
const $bus = inject("$bus")
// const pls = inject("myplaylists")
const items = inject('app_playlists')
var active = ref(false)
var left = ref(0), top = ref(0)
var res = ''
var resfn,rejfn

$bus.reg('open_context_playlist', function (x, y) {
  active.value = true
  res=''
  left.value = x
  top.value = y
  //await
  return new Promise((resolve,reject)=>{
    resfn=resolve,rejfn=reject
  })
})
// $bus.on('open_context_menu_pl', (x, y) => {
//   // console.log("x=",x,"y=", y);
//   active.value = true
//   left.value = x
//   top.value = y
// })
// function to_current() {
//   // active.value = false
//   res = 'current'
//   // console.log('cur');
// }
// function to_like(){
// }
// function to_new(){
//   // $bus.emit('open_modal_playlist')
//   // active.value = false
//   res='new'
// }
function to_playlist(item) {
  // active.value=false
  res = item.name
  resfn(res)
}
function close(){
  res=''
  active.value=false
  rejfn('context close')
}


</script>


<template>
  <div :class="{ 'context_menu_mask': active }" @click="close"></div>
  <div
    class="context_content"
    @click="active=false"
    :class="{ 'context_show': active }"
    :style="{ left: left + 'px', top: top + 'px' }"
  >
    <!-- <div @click="to_current">正在播放</div> -->
    <!-- <div @click="to_new">新的歌单</div> -->
    <div v-for="item in items" :key="item.name" @click="to_playlist(item)">{{ item.name }}</div>
    <!-- <div @click="like">我喜欢的</div> -->
    <hr />
  </div>
</template>

<style>
/* can mess up order */
.context_menu_mask {
  z-index: 1;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* width: 100%;
  height: 100%; */
}

.context_content.context_show {
  z-index: 1;
  visibility: visible;
  opacity: 1;
  width: 200px;
}

.context_content {
  position: fixed;
  z-index: -1;
  visibility: hidden;
  opacity: 0;
  width: 0;
  /* height: 400px; */
  background: #f1f1f1;
  transition: opacity 0.5s ease-in-out;
}
.context_content div:hover {
  background-color: #d9d9d9;
}
.context_content div:active {
  background-color: crimson;
}
</style>