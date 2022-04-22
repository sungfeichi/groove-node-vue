<script setup>
import { ref, inject, computed, watch } from 'vue';

const $bus = inject('$bus')


var player_setting = inject('player_setting')
var i_play_mode = computed(() => {
  if (player_setting.playmode === 0) {
    return "fa fa-refresh"
  }
  else if (player_setting.playmode === 1) {
    return "fa fa-repeat"
  }
  else if (player_setting.playmode === 2)
    return "fa fa-random"
})

var i_play_pause = computed(() => {
  if (player_setting.isPauseing)
    return "fa fa-play"
  else
    return "fa fa-pause"
})
var i_volume = computed(() => {
  if (player_setting.volume == 0)
    return "fa fa-volume-off"
  if (player_setting.volume <= 50)
    return "fa fa-volume-down"
  if (player_setting.volume <= 100)
    return "fa fa-volume-up"
})
function rollMode() {
  player_setting.playmode = (player_setting.playmode + 1) % (3)
}

const player_now = inject('player_now')
var ct = ref(0)
var is_sliding = false
function sliding(event) {
  is_sliding = true
  ct.value = event.target.value
}
watch(() => player_now.currentTime, (nv, ov) => {
  if (!is_sliding) {
    ct.value = nv
  }
})
function changeCurrent(event) {
  is_sliding = false
  // console.log('emit change');
  // player_now.currentTime = event.target.value-'0';
  $bus.emit('player_change_current_time', event.target.value)
}
function pad(num, n) { 
  return (Array(n).join(0) + num).slice(-n)
}
const convertHMS = seconds => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor(seconds % 3600 / 60)
  const s = Math.floor(seconds % 60)
  return h ? `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}` : `${pad(m, 2)}:${pad(s, 2)}`
}

</script>
<script>
export default {
  created() {

  }
}

</script>
<template>
  <div id="playbar">
    <div class="info">
      <div class="img-wrap">
        <img :src="player_now.cover" />
      </div>
      <div class="info-t-a">
        <p class="title">{{ player_now.title }}</p>
        <p class="artist">{{ player_now.artist }}</p>
      </div>
    </div>
    <div class="control" @click="f">
      <button @click="$bus.emit('play_pre')">
        <i class="fa fa-step-backward"></i>
      </button>
      <button @click="$bus.emit('play_pause')">
        <i :class="i_play_pause"></i>
      </button>
      <button @click="$bus.emit('play_next')">
        <i class="fa fa-step-forward"></i>
      </button>
    </div>
    <div class="misc">
      <button @click="rollMode">
        <i :class="i_play_mode"></i>
      </button>
      <button class="tooltip" @click="$bus.emit('play_clear')">
        <i class="fa fa-remove"></i>
        <span class="tooltiptext">清空正在播放</span>
      </button>
      <!-- <button class="tooltip">
        <i class="fa fa-ellipsis-h"></i>
        <p class="tooltipcontent">
            提示文本
        </p>
      </button>-->
    </div>
    <div class="timer_wrap">
      <span>{{ convertHMS(player_now.currentTime) }}</span>
      <input
        type="range"
        :max="player_now.duration"
        :value="ct"
        @input="sliding($event)"
        @change="changeCurrent($event)"
      />
      <span>{{ convertHMS(player_now.duration) }}</span>
    </div>
    <div class="volume_wrap">
      <i :class="i_volume"></i>
      <input type="range" 
        class="volume"
        @change="$bus.emit('volume',$event.target.value)"/>
    </div>
  </div>
</template>



<style>
#playbar {
  white-space: nowrap;
  display: flex;
  position: fixed;
  bottom: 0;
  z-index: 0;
  height: 100px;
  width: 100%;
  background-color: rgb(182, 104, 104);
}
#playbar .info {
  height: 100%;
  width: 300px;
  display: flex;
  float: left;
}

#playbar .title {
  width: 200px;
  margin-top: 20px;
  /* top:30px; */
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 24px;
  font-weight: bold;
}
#playbar .artist {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
}
#playbar img {
  height: 100%;
  /* width: fit-content; */
}

#playbar .control {
  /* margin: auto; */
  min-width: 400px;
  position: absolute;
  left: 20%;
  right: 20%;

  display: flex;
  justify-content: center;
}
#playbar button {
  width: 50px;
  height: 50px;
  margin: 0px 5px;
  background-color: rgb(182, 104, 104);
  border-radius: 50%;
  border: 1px solid #d5d5d5;
}
#playbar i {
  font-size: 30px;
}
#playbar .timer_wrap {
  display: flex;
  justify-content: center;
  position: absolute;
  left: 30%;
  right: 30%;
  top: 70px;
}

#playbar input {
  margin: 0px 5px;
  width: 70%;
}

#playbar .misc {
  /* margin: auto; */
  /* min-width: 400px; */
  position: absolute;
  /* left:20%; */
  right: 0%;
}

#playbar .volume_wrap {
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 12%;
}
@media screen and (max-width: 800px){
  #playbar .volume_wrap {
    display: none;
  }
}
#playbar .volume_wrap i {
  width: 25px;
}

@media screen and (max-width: 600px) {
  #playbar .misc {
    display: none;
  }
  #playbar .img-wrap {
    display: none;
  }

  #playbar .title,
  .artist {
    width: 400px;
  }
  #playbar .control {
    justify-content: right;
    right: 0px;
  }
  #playbar .timer_wrap {
    left: 0%;
    width: 100%;
    /* justify-content: left; */
  }
  #playbar .timer_wrap input {
    width: 80%;
  }
  #playbar .volume_wrap {
    display: none;
  }
}
</style>