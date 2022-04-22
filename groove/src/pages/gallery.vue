<script setup>
import { ref, provide,inject, computed } from 'vue';
import axios from 'axios';
const $bus=inject("$bus")

var currentTab = ref('歌曲')
var tabs = ['歌曲', '专辑']
// var tabs = ['歌曲', '歌手', '专辑']
var currentTabComponent = computed(() => {
  if (currentTab.value === "歌曲") {
    return songstore
  }
  // if (currentTab.value === "歌手") {
  //   return artiststore
  // }
  if (currentTab.value === "专辑") {
    return albumstore
  }
})

var bool_refreshing=inject('bool_refreshing')
var refresh=inject('refresh')
async function openContext(event){
  var x = event.clientX, y = event.clientY
  // $bus.emit("open_context_menu_pl", x, y)
  var [err, res] = await $bus.activity.open_context_playlist(x, y).to()
  if (err) return console.log(err)
  var [err2, res2] = await $bus.activity.playlist_insert({
    method: 'insertMany',
    playlist:res
  }).to()
  if (err2) return console.log(err2)
  $bus.emit('gallery_cancle')
}

</script>

<script>

import songstore from '../components/songstore.vue'
// import artiststore from '../components/artiststore.vue';
import albumstore from '../components/albumstore.vue';
export default{
  name:"gallery",

}
</script>
<template>
  <div id="gallery">
    <h1>我的音乐</h1>
    <span @click="$bus.emit('gallery_cancle')" >
      <i class="fa fa-close"></i>
      取消
    </span>    
    <span @click="refresh" >
      <i :class="[bool_refreshing?'fa-spin':'','fa','fa-refresh']"></i>
      刷新
    </span>
    <span @click="$bus.emit('play_selected')" >
      <i class="fa fa-play"></i>
      播放
    </span>
    <span @click="openContext($event)">
      <i class="fa fa-plus"></i>
      添加到
      </span>
    <!-- <span @click="$bus.emit('gallery_delete')">
      <i class="fa fa-trash"></i>
      删除
      </span> -->
    <hr>
    <label
      v-for="tab in tabs"
      :key="tab"
      :class="['tab', { active: currentTab === tab }]"
      @click="currentTab = tab"
    >{{ tab }}</label>
    <!-- <hr/> -->

    
    <keep-alive>
      <component :is="currentTabComponent" src="app_musics"></component>
    </keep-alive>
  </div>
</template>
<style>
#gallery h1 {
  /* font-size: 40px; */
  font-weight: 100;
  margin-bottom: 20px;
}
#gallery>span{
  font-size:24px;
}
#gallery .tab {
  font-size: 24px;
  margin-right: 20px;
  color: #7a7a7a;
}
#gallery .tab:hover {
  color: black;
}
#gallery .tab.active {
  color: black;
  border-bottom: solid 3px orange;
}
#gallery .selected{
  background-color: orange;
}

</style>