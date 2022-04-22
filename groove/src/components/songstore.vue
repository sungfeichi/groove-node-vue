<script setup>
import axios from "axios";
import { computed, inject,onActivated, onDeactivated, reactive, ref } from "vue"
import { axioserr } from "../lib/util";
const $bus = inject('$bus')
const props=defineProps({
  src:String
})
// var items;
// if(!props.src){
//   items=inject('app_musics')
// }
// else{
// // var items = inject(src)
//   items=$bus.anyinject(props.src)
// }
var items=inject(props.src)

var SERVER=inject("SERVER")

//避免子组件修改父级传递过去的数据。
var map_select=reactive(new Map())

function play(item){
  $bus.events['musics'].unshift(item)
  $bus.emit('play_selected')
}
function select(item) {
  if (map_select.get(item)) {
    $bus.off('musics',item)
  }
  else {
    $bus.on('musics',item)
  }
  map_select.set(item,!map_select.get(item))

}
// function like(item){
//   item.selected=true
// }
var component_bool_active=false
onActivated(()=>{
  component_bool_active=true
})
onDeactivated(()=>{
  component_bool_active=false
  items.value.map((item)=>{
    map_select.set(item,false)
  })
})
$bus.on('play_selected',()=>{
  if(component_bool_active){
    items.value.map((item)=>{
      map_select.set(item,false)
  })
  }
})

$bus.on('gallery_cancle',()=>{
  if(component_bool_active){
    items.value.map((item)=>{
      map_select.set(item,false)
  })
  }
})
$bus.on('gallery_delete',()=>{
  // alert('may casuse bugs, dont use it!')
})

const GAP=8
var drag_item,drag_index,start_weight,start_index
var bool_custom_sort='database_playlist'===props.src
var playlist_info = inject('playlist_info')
var ghost

function dragstart(item,index,event){

  event.target.classList.toggle('dragging')

  // console.log(ghost);
  drag_index=index
  start_weight=item.weight
  start_index=index
  drag_item=item
  // $bus.events['drag_item']=item
  // new Promise((resolve,reject)=>{
  //   $bus.events['drag_resolve']=resolve
  //   $bus.events['drag_reject']=reject
  // }).then(v=>{
  //   //v is droped playlist dst
  //   //if dst is simpler
  //   var send_items=map_select.get(item)?$bus.events['musics']:item
  //   // $bus.reg('playlist_insert',async ({method,playlist,send_items})=>{
  //   $bus.act('playlist_insert',{
  //     method:'insertMany',
  //     playlist:v,
  //     send_items:send_items
  //   }).catch(e=>console.error(e))
  // }).catch(e=>{
  // })
}



function dragenter(item,index,event){
  event.preventDefault()
  if(drag_index!=index){
      // console.log('enter');
    // let item=items.value[index]
    // let weight
    // if(index!=items.value.length-1)
    //   weight=Math.floor((item.weight+items.value[index+1].weight)/2)
    // else
    //   weight=item.weight+GAP

    // drag_item.weight=weight
    items.value.splice(drag_index,1)
    items.value.splice(index,0,drag_item)
    drag_index=index
  }

}


async function dragend(item,index,event){
  event.target.classList.toggle('dragging')
  // $bus.events['drag_reject']()
  // $bus.events['drag_item']=null
  // $bus.events['drag_resolve']=null
  // $bus.events['drag_reject']=null
  // drag_index=null
  // drag_item=null

  // if(!bool_custom_sort)return
  if(drag_index!=start_index){
    var end_weight=1
    if(drag_index>0){
      if(start_index>drag_index)
        end_weight=items.value[drag_index-1].weight+1
      else
        end_weight=items.value[drag_index-1].weight
    }
    // updateOrder(playlist,url,start,end)
    const [err,res] = await axios({
      method:'post',
      url:SERVER+'api/playlist',
      params:{
        name:playlist_info.name
      },
      data:{
        method:'updateOrder',
        url:drag_item.url,
        start:start_weight,
        end:end_weight
      }
    }).to()
    if(err){
      //restore items
      items.splice(drag_index,1)
      items.splice(start_index,0,drag_item)
      return axioserr(err)
    }
    // console.log(start_index,drag_index)
    // console.log(start_weight,end_weight)
    if(start_index<drag_index){
      items.value.slice(start_index,drag_index+1).map((item)=>{
        item.weight-=1
      })
      drag_item.weight=end_weight

    }
    else{
      items.value.slice(drag_index+1,start_index+1).map((item)=>{
        item.weight+=1
      })
      drag_item.weight=end_weight      

    }

  }

}

</script>


<template>
    <table class="songstore">
      <tr>
        <!-- <th style="width:30px"></th> -->
        <th style="width:20px"></th>
        <th>标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th style="width:75px">年份</th>
        <th style="width:75px">时长</th>
        <!-- <th>debug</th> -->
      </tr>
      <transition-group name="flip-list">
      <tr
        :class="{'selected':map_select.get(item)}"
        class="row"
        v-for="(item,index) in items"
        :key="item.title"
        :draggable="bool_custom_sort"
        @click="play(item)"
        @dragstart="dragstart(item,index,$event)"
        @dragenter="dragenter(item,index,$event)"
        @dragend="dragend(item,index,$event)"
        @drop="drop(item,index)"
      >
        <!-- <td @click.stop="like(item)">
        <i :class="item.liked?'fa fa-heart':'fa fa-heart-o'" 
        :style="{color:item.liked?'red':''}"
        ></i>
        </td> -->
        <td :class="map_select.get(item)?'fa fa-check-square-o':'fa fa-square-o'"
        @click.stop="select(item)"></td>
        <td >{{ item.title }}</td>
        <td >{{ item.artist }}</td>
        <td >{{ item.album }}</td>
        <td >{{ item.pubyear }}</td>
        <td >{{ Math.floor(item.duration) }}</td>
        <!-- <td>{{item.weight}}</td> -->
      </tr>
      </transition-group>
    </table>
</template>



<style>

table.songstore  {
  border-spacing: 0;
  width:100%;
  table-layout: fixed;
}
table.songstore tr:nth-child(even) {
  background-color: #f1f1f1;
}

.songstore tr {
  font-size: 24px;
  height: 40px;
}
.songstore tr.row:hover {
  background-color: #d9d9d9;
}
.songstore tr.row.selected:hover {
  background-color: darkorange;
}
.songstore tr.row.selected {
  background-color: orange;
}
.songstore td {
  padding-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* height:50px; */
}
.songstore th {
  /* border: solid 2px black; */
  /* width: 100px; */
  text-align: left;
  padding-left: 5px;
  /* resize: horizontal; */
  /* overflow: auto; */
}

.songstore tr.dragging{
  opacity: 0.1;
  background-color: aquamarine !important;
}

.flip-list-move {
  transition: transform 0.3s ease;
}
</style>