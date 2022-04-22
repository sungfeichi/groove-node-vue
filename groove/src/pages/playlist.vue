<script setup>
import { inject, computed, ref, watch, reactive, provide } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { axioserr } from "../lib/util";
import Songstore from "../components/songstore.vue";
const props = defineProps({
  name: String,
});
var SERVER = inject("SERVER");
const router = useRouter();
var items = ref([]);
var info = reactive({
  author: "",
  name: "",
  description: "",
});
provide("playlist_info", info);
var $bus = inject("$bus");
function refresh() {
  // console.log(props.name);

  // {"info":{"author":"me","name":"bbb","description":"bbbaaa"},"col":[]}
  axios({
    method: "get",
    url: SERVER + "api/playlist",
    params: {
      name: props.name,
    },
  }).then((res) => {
    info.name = res.data.info.name;
    info.description = res.data.info.description;
    // console.log(info);
    items.value = res.data.col;

    items.value.sort((a, b) => a.weight - b.weight);
    // console.log(info);
    // console.log(items.value);
  }, axioserr);
}
watch(
  () => props.name,
  (nv) => {
    console.log("playlist change" + nv);
    // console.log(info);
    refresh();
  }
);

refresh(); //not refresh when router push
// $bus.anyshare('database_playlist',items)
provide("database_playlist", items);
// watch()
// console.log('bbb' + props.album);
function play() {
  if (!$bus.events["musics"].length) {
    $bus.events["musics"] = items.value;
  }
  $bus.emit("play_selected");
}
//!important copy by playlist
async function openContext(event) {
  var x = event.clientX,
    y = event.clientY;
  // $bus.emit("open_context_menu_pl", x, y)
  var [err, res] = await $bus.activity.open_context_playlist(x, y).to();
  if (err) return console.log(err);
  if (res === info.name) return;
  if ($bus.events["musics"].length === 0) {
    var [err2, res2] = await $bus.activity
      .playlist_copy({
        method: "copyto",
        src: info.name,
        dst: res,
      })
      .to();
  } else {
    [err2, res2] = await $bus.activity
      .playlist_insert({
        method: "insertMany",
        playlist: info.name,
      })
      .to();
    if (err2) return console.log(err2);
    $bus.emit("gallery_cancle");
  }
}

async function openModal() {
  var [err, res] = await $bus.activity.open_modal_playlist("modify", info.name, info.description)
    .to();
  //.then(v=>console.log('side'+v)).catch(e=>console.log(e))
  if (err) console.log(err);
  else {
    // console.log(res);
    var [err2, res2] = await $bus.activity.playlist_modify(info.name, res.name, res.desc)
      .to();
    if (err2) console.log(err2);
    else {
      // console.log(res2)
      router.push({
        name: "playlist",
        params: {
          name: res2,
        },
      });
    }
  }
}
async function del() {
  //attention: network fail will cause data inconsistence
  $bus.events["musics"].map((item) => {
    let idx = items.indexOf(item)
    if(idx === -1)
      throw new Error('fatal error data wrong')
    items.splice(idx,1)
  })  
  const send_items = $bus.events["musics"].map((item) => {
    return {
      url: item.url,
      weight: item.weight,
    };
  });
  var [err, res] = await $bus.activity.playlist_delete(info.name, {
      method: "deleteItems",
      items: send_items,
    })
    .to();
  if (err) return console.log(err);
  // console.log(res)
  //transaction return undefined
  //refresh()


}
</script>

<script>
export default {
  name: "playlist",
};
</script>

<template>
  <div class="playlist">
    <div>
      <!-- <img :src="items[0].cover" /> -->
    </div>
    <div class="name">{{ info.name }}</div>
    <div class="desc">{{ info.description }}</div>

    <div>
      <span @click="$bus.emit('gallery_cancle')">
        <i class="fa fa-close"></i>
        取消
      </span>
      <span @click="play">
        <i class="fa fa-play"></i>
        播放
      </span>
      <span @click="openContext($event)" class="tooltip">
        <i class="fa fa-plus"></i>
        添加到
        <span class="tooltiptext">复制本歌单到</span>
      </span>
      <span @click="openModal">
        <i class="fa fa-pencil-square-o"></i>
        重命名
      </span>
      <span @click="del">
        <i class="fa fa-close"></i>
        删除
      </span>
    </div>
    <Songstore src="database_playlist"></Songstore>
  </div>
</template>

<style>
.playlist .name {
  font-size: 32px;
}

.playlist {
  font-size: 24px;
}

.playlist span {
  font-size: 24px;
}
</style>
