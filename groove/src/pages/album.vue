<script setup>
import { inject, computed, ref, provide } from 'vue'
import Songstore from '../components/songstore.vue'

const props = defineProps({
  album: String
})

var $bus = inject("$bus");
var app_musics = inject("app_musics");
var items = computed(() => app_musics.value.filter((va) => {
  return va.album == props.album;
}));
provide('album', items)
async function openContext(event){
  var x = event.clientX, y = event.clientY
  // $bus.emit("open_context_menu_pl", x, y)
  var [err, res] = await $bus.activity.open_context_playlist(x, y).to()
  if (err) return console.log(err)
  var [err2, res2] = await $bus.activity.playlist_insert({
    method: 'insertMany',
    playlist:res
  }).to()
  $bus.emit('gallery_cancle')
  if (err2) return console.log(err2)
}
</script>

<script>
export default {
  name: "album"
}
</script>

<template>
  <div v-if="items.length">
    <div>
      <img :src="items[0].cover" />
      <div>{{ album }}</div>
      <div>{{ items[0].artist }}</div>
    </div>
    <div class="controlspan">
      <span @click="play">
        <i class="fa fa-play"></i>
        播放
      </span>
      <span @click="openContext($event)">
        <i class="fa fa-plus"></i>
        添加到
      </span>
    </div>
    <Songstore src="album"></Songstore>

    </div>
</template>

<style>
</style>