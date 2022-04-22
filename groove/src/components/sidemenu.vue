<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
const $bus = inject('$bus')
var menuout = ref(false)
var temporary_close = false
const router=useRouter()
$bus.on('wd_resize', () => {
  if (menuout.value && window.innerWidth < 1000) {
    temporary_close = true
    menuout.value = false
  }
  else if (temporary_close && window.innerWidth >= 1000) {
    temporary_close = false
    menuout.value = true
  }
})


var pls =inject('app_playlists')
async function openModal(){
  var [err,res]= await $bus.activity.open_modal_playlist().to()//.then(v=>console.log('side'+v)).catch(e=>console.log(e))
  if(err)console.log(err)
  else{
    // console.log(res);
    var [err2,res2] = await $bus.activity.playlist_add(res.name,res.desc).to()
    if(err2)console.log(err2)
    else{
      // console.log(res2)
      router.push({
        name:"playlist",
        params:{
          name:res2
        }
      })
    }
  }
}


</script>


<template>
  <div id="menucontainer">
    <input type="checkbox" id="opennav" v-model="menuout" />
    <label class="mask" for="opennav"></label>
    <div id="topmenu">
      <a class="openbt">
        <label for="opennav">
          <i class="fa fa-navicon"></i>
        </label>
      </a>
      <form>
        <textarea></textarea>
        <a>
          <label class="fa fa-search"></label>
        </a>
      </form>
    </div>
    <div id="menuitems">
      <a target="_self" href="#/gallery">
        <i class="fa fa-archive"></i>
        <span>我的音乐</span>
      </a>
      <!-- <a>
        <i class="fa fa-clock-o"></i>
        <span>最近播放的内容</span>
      </a> -->
      <!-- <a @click="openPlayPage"> -->
      <a target="_self" href="#/playpage">
        <i class="fa fa-music"></i>
        <span>正在播放</span>
      </a>
      <a target="_self" href="#/playlist">
        <i class="fa fa-indent"></i>
        <span>播放列表</span>
      </a>
      <a @click="openModal">
        <i class="fa fa-plus"></i>
        <span>新建播放列表</span>
      </a>
      <a class="cog" target="_self" href="#/setting">
        <i class="fa fa-cog"></i>
        <span>设置</span>
      </a>
      <ul class="playlists">
        <li v-for="pl in pls"
          :key="pl.name"
          
          >
          <router-link :to="'/playlist/'+pl.name">
            <i class="fa fa-file-text-o"></i>
            <span>{{pl.name}}</span>
          </router-link>
        </li>

      </ul>
    </div>
  </div>
</template>





<style>
#menucontainer a {
  display: block;
  height: 60px;
  cursor: default;
}
#menucontainer a:hover,
#menuitems li:hover {
  background-color: lightgray;
}
#menucontainer a:active,
#menuitems li:active {
  background-color: orange;
}

#menucontainer i {
  position: relative;
  top: 15px;
  left: 15px;
  font-size: 30px;
  width: 30px;
}
#topmenu,
#menuitems {
  background-color: #f1f1f1;
}
#opennav {
  display: none;
}
#topmenu{
  display: flex;
}
#topmenu .openbt {
  position: relative;
  top: 0px;
  left: 0px;
  width: 60px;
  height: 60px;
}

#topmenu form {
  position: relative;
  height: 60px;
  width: calc(100% - 60px);
}
@media only screen and (min-width: 600px) {
#topmenu form{
  display: none;
}
}
#topmenu textarea {
  margin: 5px 5px 5px 0px;
  width: 95%;
  height: 50px;
  /* border-radius: 30px; */
  white-space: nowrap;
  font-size: 30px;
}
#topmenu a {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 45px;
  top: 10px;
}

#topmenu form label:hover {
  color: orange;
}
#topmenu form label:active {
  color: white;
}
#topmenu form label {
  position: relative;
  top: 8px;
  left: 8px;
  font-size: 24px;
  width: 24px;
}

#menuitems {
  display: none;
  position: relative;
  white-space: nowrap;
  height: calc(100% - 120px);
  width: 60px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
}

#menuitems span {
  cursor: default;
  display: none;
}
#menuitems hr {
  display: none;
}
#menuitems ul {
  display: none;
}
#menuitems li {
  height: 60px;
}

#menuitems .cog {
  position: fixed;
  width: 60px;
  bottom: 100px;
  background-color: #f1f1f1;
}
#opennav:checked ~ #menuitems {
  width: 300px;
  transition: all 0.3s ease;
}
  #opennav:checked ~  #topmenu{
    width:300px;
    transition: all 0.3s ease;
  }
#opennav:checked ~ #menuitems span {
  display: inline;
  position: relative;
  top: 10px;
  left: 25px;
}

#opennav:checked ~ #menuitems .cog {
  width: 300px;
}

#opennav:checked ~ #menuitems ul {
  display: block;
}

@media only screen and (min-width: 1000px) {
  #menucontainer .mask {
    display: none;
  }
}

@media only screen and (max-width: 1000px) {
  #opennav:checked ~ .mask {
    display: block;
    height: calc(100% - 160px);
    width: calc(100% - 300px);
    position: fixed;
    left: 300px;
    top: 60px;
  }
}

@media only screen and (max-width: 600px) {
/*bug in 600px */

    #opennav:checked ~ #menuitems {
    display: block;
    position: fixed;
    height: 540px;
  }

}

@media only screen and (min-width: 600px) {

  #opennav:checked ~ .mask {
    height: calc(100% - 100px);
    top: 0px;
  }
  #topmenu{
    display: block;

  }

  #menuitems{
    display: block;
  }
}
</style>