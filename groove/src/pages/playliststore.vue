<script setup>
import { computed, inject, ref, watch, watchEffect, reactive } from "vue";
var $bus = inject('$bus')
var items = inject('app_playlists')
//  author, name, description 
async function del(name) {
  var [err, res] = await $bus.activity.playlist_delete(name,
  {
    method:'deletePlaylist',
  }).to()
  if (err) return console.log(err)  
}
async function openModal() {
  var [err, res] = await $bus.activity.open_modal_playlist().to()//.then(v=>console.log('side'+v)).catch(e=>console.log(e))
  if (err) return console.log(err)
  var [err2, res2] = await $bus.activity.playlist_add(res.name, res.desc).to()
  if (err2) return console.log(err2)
  router.push({
    name: "playlist",
    params: {
      name: res2
    }
  })
}
</script>


<template>
  <div id="playliststore">
    <div>
      <h1>播放列表</h1>
      <div class="control" @click="openModal">
        <i class="fa fa-plus"></i>
        新的播放列表
      </div>
    </div>
    <div v-for="item in items" :key="item.name" class="wwrap">
      <router-link :to="'/playlist/' + item.name">
        <div class="pl">
          <div class="image_wrap">
            <i class="fa fa-file-text-o"></i>
          </div>
          <div class="info">
            <p class="name">{{ item.name }}</p>
            <p class="desc">{{ item.description }}</p>
          </div>
        </div>
      </router-link>
      <div class="del" @click="del(item.name)">
        <i class="fa fa-close"></i>
      </div>
    </div>  </div>
</template>

<style>
#playliststore {
  overflow-y: auto;
}

#playliststore .control {
  width: fit-content;
  font-size: 20px;
}

#playliststore .wrap {
  position: relative;
}

#playliststore .pl {
  position: relative;
  margin: 8px;
  border: 1px solid #ccc;
  height: 60px;
}

#playliststore .pl:hover {
  border: 1px solid #777;
}

#playliststore .image_wrap {
  float: left;
}

#playliststore .pl i {
  font-size: 55px;
}

#playliststore .info {
  position: absolute;
  margin-left: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
}

#playliststore .name {
  font-size: 32px
}

#playliststore .desc {
  font-size: 20px
}

#playliststore .del {
  position: absolute;
  right: 50px;
  font-size: 40px;
  transform: translateY(-60px);
}
</style>