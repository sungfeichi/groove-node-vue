<script setup>
import { computed, inject, ref ,onDeactivated, onActivated, reactive,isReactive} from "vue"
const $bus = inject('$bus')
var app_musics = inject("app_musics")

var albums=computed(()=>{
  let temp=new Map()
  app_musics.value.map((item)=>{
    temp.set(item.album,temp.get(item.album)||reactive({
      album:item.album,
      artist:item.artist,
      cover:item.cover,
      selected:false,
    }))
  })
  // return temp.values()
  return [...temp.values()]
})
// var albums=[...temp.values()]

function select(obj_album) {

  obj_album.selected=!obj_album.selected
  app_musics.value.map((music)=>{
    if(music.album===obj_album.album){
      if(obj_album.selected){
        $bus.on('musics',music)
      }
      else{
        $bus.off('musics',music)
      }
    }
  })
}

var component_bool_active=false
onActivated(()=>{
  component_bool_active=true
})
onDeactivated(()=>{
  component_bool_active=false

  for(let item of albums.value){
    item.selected=false
  }
})

$bus.on('play_selected',()=>{
  if(component_bool_active){
    for(let item of albums.value){
      item.selected=false
    }
  }
})

$bus.on('gallery_cancle',()=>{
  if(component_bool_active){
    for(let item of albums.value){
      item.selected=false
    }
  }
})
$bus.on('gallery_delete',()=>{
  // alert('may casuse bugs, dont use itaaa!')
})





</script>

<template>
  <div id="albumstore">
    <div v-for="item in albums"
      :key="item.album"
      class="album"
    >
      <router-link :to="'/album/'+item.album">

        <div v-if="item.cover" >
          <img :src="item.cover">
        </div>
        <div v-if="!item.cover" 
          class="imageslot">
          <i class="fa fa-image"></i>
        </div>
      </router-link>
      <div 
        class="desc"
        :class="{'selected':item.selected}"
        @click="select(item)">
          <div>{{item.album}}</div>
          <div>{{item.artist}}</div>
          <!-- <div>{{item.selected}}</div> -->
      </div>
        
    </div>

  </div>
</template>
<!-- :class="{'orangeit':item.selected}" -->
<style>
#albumstore .album{
    margin: 5px;
    border: 1px solid #ccc;
    float: left;
    width: 182px;
    height: 242px;
}
#albumstore .album:hover {
    border: 1px solid #777;
}
#albumstore a {
    /* width: 100%; */
    /* height: 180px; */
    text-align: center;
    color: black;
}
#albumstore img{
  width:180px;

  /* height:180px; */
}
#albumstore .album i{

  /* width:100px; */
  /* height:100px; */
  font-size: 100px;
}
#albumstore .desc {
    /* padding: 15px; */
    height:56px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
#albumstore .selected{
  color: white;
  background-color: orange;
}
#albumstore:after{
  clear: both;
}

#albumstore .imageslot{
  text-align: center;
  height:184px;
}
#albumstore .imageslot i{
  position:relative;
  top:42px;
}
</style>