<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import EventBus from './lib/eventbus.js'
import { ref, reactive, provide, inject, watch, onMounted } from 'vue'
import { waitFor,axioserr } from "@/lib/util"
import sidemenu from './components/sidemenu.vue'
import playbar from './components/playbar.vue'
import modal_playlist from './components/modal_playlist.vue'
import context_playlist from './components/context_playlist.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

import SERVER from "base"
provide('SERVER',SERVER)
// console.log(server);


const router=useRouter()
const $bus = new EventBus()
provide('$bus', $bus)
// const include = ref([])




/***
 * window resize
 */
function windowResizeEvent(callback) {
  window.onresize = function () {
    var target = this;
    if (target.resizeFlag) {
      clearTimeout(target.resizeFlag);
    }

    target.resizeFlag = setTimeout(function () {
      callback();
      target.resizeFlag = null;
    }, 100);
  }
}
function resizeHelper() {
  $bus.emit('wd_resize')
}
windowResizeEvent(resizeHelper)
  /* 放下目标节点时触发事件 */
  document.addEventListener("dragover", function( event ) {
      // 阻止默认动作
      event.preventDefault();
  }, false);

/**
 * music player
*/
const mainaudio = ref()

const player_setting = reactive({
  isPauseing: true,
  //0 loop
  //1 repeat
  //2 random
  //3 traverse not find icon
  playmode: 0,
  volume: 100,
})
provide('player_setting', player_setting)

$bus.on('play_pause', () => {
  if (player_now.url) {
    player_setting.isPauseing = !player_setting.isPauseing
    if (player_setting.isPauseing)
      mainaudio.value.pause()
    else
      mainaudio.value.play()
  }
})
$bus.on('volume', (nv) => {
  player_setting.volume = nv
  mainaudio.value.volume = (nv / 100)-'0'
})



const player_now = reactive({
  title: '',
  artist: '',
  album: '',
  pubyear: 0,
  url: '',
  duration: 0,
  cover: '',
  currentTime: 0,//to change it $bus.emit('player_change_current_time')
  idx: 0,
})
function play_new_music(idx) {
  var item = current_playlist.value[idx]
  mainaudio.value.src = SERVER + item.url
  player_setting.isPauseing = false
  mainaudio.value.play()
  // player_now.title = item.title
  // player_now.artist = item.artist
  // player_now.album = item.album
  // player_now.pubyear = item.pubyear
  player_now.url = item.url
  // player_now.duration =Math.floor(item.duration)
  // player_now.cover = item.cover
  axios.get(SERVER + 'api/mymusic', {
    params: {
      url: item.url
    }
  }).then((res) => {
    // console.log(res);
    item = res.data
    player_now.title = item.title
    player_now.artist = item.artist
    player_now.album = item.album
    player_now.pubyear = item.pubyear
    // player_now.url = item.url
    player_now.duration =Math.floor(item.duration)
    player_now.cover = item.cover
  },axioserr)

}
provide('player_now', player_now)

const current_playlist = ref([])
provide('current_playlist', current_playlist)


onMounted(() => {
  mainaudio.preload = 'metadata';
  mainaudio.value.addEventListener("loadedmetadata", () => {

    player_now.duration = Math.floor(mainaudio.value.duration)
    // console.log('loadmeta'+Date.now());
  });
  mainaudio.value.addEventListener("canplay", () => {
    // console.log('canplay'+Date.now());
  })
  mainaudio.value.addEventListener("canplaythrough", () => {
    // console.log('canplaythrough'+Date.now());
  })
  mainaudio.value.onplay = function () {
    player_setting.isPauseing = false
  }
  mainaudio.value.onpause = function () {
    player_setting.isPauseing = true
  }
  /**
   * 这个事件的触发频率由系统决定，但是会保证每秒触发4-66次（前提是每次事件处理不会超过250ms）。
   * 鼓励用户代理根据系统的负载和处理事件的平均成本来改变事件的频率，保证UI更新不会影响视频的解码。
   */
  mainaudio.value.ontimeupdate = function () {
    // console.log('update'+Date.now());
    var target = this;
    // console.log(target); <audio>
    if (target.flag) {
      return
    }
    target.flag = true
    setTimeout(function () {
      player_now.currentTime = Math.floor(mainaudio.value.currentTime)
      // console.log('changecurrenttime');
      target.flag = false;
    }, 500);
  }
  mainaudio.value.addEventListener("ended", () => {
    if (player_setting.playmode === 1) {
      player_now.currentTime = 0;
      mainaudio.value.currentTime = 0;
      mainaudio.value.play()
    }
    else
      $bus.emit('play_next')
  })
})


$bus.on('play_next', () => {
  if (player_setting.playmode ===0 || player_setting.playmode ===1 && current_playlist.value.length>1) {
    var idx = (player_now.idx + 1) % current_playlist.value.length
    player_now.idx = idx
    play_new_music(idx)
    // mainaudio.value.src = current_playlist.value[idx].url
    // mainaudio.value.play()
  }
  else if (player_setting.playmode === 2) {
    var high = current_playlist.value.length
    //[0~high)
    var idx = Math.floor(Math.random() * high)
    player_now.idx = idx
    play_new_music(idx) 
  }
  else{
    player_now.currentTime = 0;
    mainaudio.value.currentTime = 0;
    mainaudio.value.play()
  }
});
$bus.on('play_pre', () => {
  var len=current_playlist.value.length
  if (len>1) {
    var idx = (player_now.idx + len- 1) % len
    player_now.idx = idx
    play_new_music(idx)
  }
})
$bus.on('play_clear', () => {
  current_playlist.value=[]
  player_now.title = ''
  player_now.artist = ''
  player_now.album = ''
  player_now.pubyear = ''
  player_now.url = ''
  player_now.duration = ''
  player_now.cover = ''
  player_now.currentTime = 0;
  player_now.idx = 0
  player_setting.isPauseing=true
  mainaudio.value.currentTime = 0
  mainaudio.value.pause()
  mainaudio.value.src=''
  var len=current_playlist.value.length
  if (len>1) {
    var idx = (player_now.idx + len- 1) % len
    player_now.idx = idx
    play_new_music(idx)
  }
})
$bus.on('play_selected', () => {
  if ($bus.events['musics'].length) {
    current_playlist.value = $bus.events['musics']
    $bus.events['musics'] = []
    play_new_music(0)
  }
})

$bus.on('player_change_current_time', (value) => {
  player_now.currentTime = value
  mainaudio.value.currentTime = value
  // console.log(mainaudio.value.currentTime);
  // console.log(player_now.currentTime);

})


/**
 * musics
 */
var app_musics=ref([])
$bus.events['musics']=[]
axios.get(SERVER+'api/mymusic/').then(res=>{
  app_musics.value=res.data
},axioserr)
provide("app_musics",app_musics)
var bool_refreshing=ref(false);
provide('bool_refreshing',bool_refreshing)
provide('refresh',refresh)
function refresh(){
  bool_refreshing.value=true
  axios.get(SERVER+'api/mymusic/').then(res=>{
    bool_refreshing.value=false
    app_musics.value=res.data
  },axioserr)
}
$bus.on('gallery_cancle',()=>{
  $bus.events['musics']=[]
})

/**
 * playlists
 */
var app_playlists=ref([])
axios.get(SERVER+'api/playlist/').then(res=>{
  app_playlists.value=res.data
},axioserr)
provide('app_playlists',app_playlists)
function playlistdelete(name){
  for(var idx=0;idx<app_playlists.value.length;idx++){
    if(app_playlists.value[idx].name===name){
      app_playlists.value.splice(idx,1)
      break
    }
  }
}
$bus.reg('playlist_add',async (name,desc)=>{
  const [err,res] = await axios({
    method: 'post',
    url: SERVER + 'api/playlist',
    data: {
      method: 'add',
      author: 'me',
      name: name,
      description: desc
    }
  }).to()
  if(err){
    axioserr(err)    
    return Promise.reject(err)
  }
  if(res.data!=1){
    return Promise.reject('server fatal error')
  }
  else{
    app_playlists.value.push({
      author: 'me',
      name: name,
      description: desc
    })
    return Promise.resolve(name)
  }
})
$bus.reg('playlist_copy',async (obj)=>{
  const [err,res] = await axios({
    method:'post',
    url:SERVER+'api/playlist',
    data:obj
  }).to()
  if(err){
    axioserr(err)
    return Promise.reject(err)
  }
  return Promise.resolve(res)

})
//batch from $bus['musics']
//playlist, title, artist, album, pubyear, url, duration, weight
$bus.reg('playlist_insert',async ({method='insertMany',playlist,send_items})=>{
  if(!send_items){
    send_items=$bus.events['musics'].map(item=>{
      return {
        title:item.title,
        artist:item.artist,
        album:item.album,
        pubyear:item.pubyear,
        url:item.url,
        duration:item.duration
      }
    })
  }
  const [err,res] = await axios({
    method:'post',
    url:SERVER+'api/playlist',
    params:{
      name:playlist
    },
    data:{
      method:method,
      // items:$bus.events['musics']
      items:send_items
    }
  }).to()
  if(err){
    axioserr(err)
    return Promise.reject(err)
  }
  return Promise.resolve(res)//true

})


$bus.reg('playlist_modify',async (old_name,name,desc)=>{
  const [err,res] = await axios({
    method:'put',
    url:SERVER+'api/playlist',
    params:{
      name:old_name
    },
    data:{
      author:'me',
      newname:name,
      description:desc
    }
  }).to()
  if(err){
    axioserr(err)
    return Promise.reject(err)
  }
  if(res.data!=1){
    return Promise.reject('server fatal error')
  }
  else{
    var idx=app_playlists.value.findIndex(v=>v.name==old_name)
    if(idx==-1)
      return Promise.reject('consistency error')
    app_playlists.value.splice(idx,1)
    app_playlists.value.push({
      author: 'me',
      name: name,
      description: desc
    })
    return Promise.resolve(name)
  }  

})


$bus.reg('playlist_delete',async (name,{method,items})=>{
  const [err,res] = await axios({
    method:'delete',
    url:SERVER+"api/playlist",//+"?name="+name,
    params:{
      name:name
    },
    data:{
      method,items
    }
  }).to()
  if(err){
    axioserr(err)
    return Promise.reject(err)
  }
  if(method==='deletePlaylist' && res.data==1){
    playlistdelete(name)
  }
  Promise.resolve(res)
})


</script>
<script>

export default {
  data(){
    return {
      include:[]
    }
  },
  watch: {
    $route(to, from) {
      // console.log(to);
      // console.log(from);
      if ((to.name == 'D1' || to.name == 'D2') && from.name && !from.name.startsWith('D')) {
        // console.log(1,this.include);
        this.include.pop()
      }
      else if ((this.include.length>=2)&&(this.include[this.include.length - 2] === to.name ||
        this.include[this.include.length - 2] === '#' + to.name)) {
          // console.log(2,this.include)
        this.include.pop()
      }
      else {
        if (to.name == 'D1' || to.name == 'D2') return//exclude tabs
        if (!to.meta.reload) this.include.push(to.name);
        else this.include.push('#' + to.name)
      }
    },
  },
};
</script>



<template>
  <audio ref="mainaudio"></audio>
  <div id="home">
    <sidemenu></sidemenu>
    <div id="content" @click="collapse">
      <router-view v-slot="{ Component }">
        <keep-alive :include="include">
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
  <playbar></playbar>
  <modal_playlist></modal_playlist>
  <context_playlist></context_playlist>
</template>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
}

body {
  font-family: sans-serif, Arial, "Microsoft Yahei";
  font-weight: 100;
  height: 100%;
  background: #fff;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  user-select: none;
}
#home {
  width: 100%;
}
#content {
  width: 100%;
  padding-left: 20px;
  margin-right: 0;
  overflow: auto;
}

@media only screen and (min-width: 600px) {
  /* For mobil: */
  #home {
    display: flex;
    flex-direction: row;
    height: calc(100% - 100px);
  }
}
a{
    color: black;
    text-decoration: none;
}
.tooltip {
  position: relative;
}
.tooltip .tooltiptext {
  position: absolute;
  z-index: 1;
  left: 50%;
  bottom: 100%;
  width: 120px;
  visibility: hidden;
  text-align: center;
  font-size: 16px;
  white-space: normal;
  border-radius: 6px;
  background-color: whitesmoke;
  padding: 5px 0;
  margin-left: -60px;
  /* 淡入 - 1秒内从 0% 到 100% 显示: */
  opacity: 0;
  transition: opacity 1s;
  /* transform: translateX(-60px); */
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.controlspan span{
  font-size: 24px;
}
</style>

