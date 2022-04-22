<script setup>
import { inject, computed, ref, watch, reactive, provide } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios'
import { axioserr } from '../lib/util';
import { def } from '@vue/shared';


const router = useRouter()

var $bus = inject('$bus')
const player_now = inject('player_now')

var SERVER = inject("SERVER")
var lrc = ref()

function parseLyric(text) {
    var offset=getOffset(text)
    var lines = text.split('\n')
    var result = []
        //[xx:xx.xx]
    var pattern = /\[\d{2}:\d{2}.\d{2}\]/g
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    //最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function(v) {
        var time = v.match(pattern),value = v.replace(pattern, '');
        //一行里面可能有多个时间
        time.forEach(function(v1, i1, a1) {
            //去掉时间里的中括号
            var t = v1.slice(1, -1).split(':');
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]) + parseInt(offset) / 1000, value]);
        });
    });
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
}
    function getOffset(text) {
        //Returns offset in miliseconds.
        var offset = 0;
        try {
            // Pattern matches [offset:1000]
            var offsetPattern = /\[offset:\-?\+?\d+\]/g,
                // Get only the first match.
                offset_line = text.match(offsetPattern)[0],
                // Get the second part of the offset.
                offset_str = offset_line.split(':')[1];
            // Convert it to Int.
            offset = parseInt(offset_str);
        } catch (err) {
            //alert("offset error: "+err.message);
            offset = 0;
        }
        return offset;
    }

var watch_line
var currentLine=ref(0)
var lrctop=ref(0)
var itemRefs=[]
var defaultlrc=[
  [0,'没有找到歌词'],
]
async function reinit(){
  itemRefs = []
  if(watch_line)
    watch_line()
  if(!player_now.url){
    lrc.value=''
    currentLine.value=0
    lrctop.value=0
    return
  }
  let lrcurl=player_now.url.slice(0,-3)+'lrc'
  var [err,res] = await axios(SERVER +lrcurl).to()
  if(err){
    axioserr(err)
    lrc.value=defaultlrc
    currentLine.value=0
    lrctop.value=0
    return;
  }
  // console.log(res.data)
  lrc.value=parseLyric(res.data)
  watch_line=watch(()=>player_now.currentTime,(ct)=>{
    for(let i=0,l=lrc.value.length;i<l;i++){
      if(ct>lrc.value[i][0]-0.50){//preload lyric line}
        currentLine.value=i
        lrctop.value=itemRefs[currentLine.value].offsetTop
        
      }
    }
  })


}
var setitemref = el => {
  if (el) {
    itemRefs.push(el)
  }
}
reinit()
watch(()=>player_now.url, ()=>{
  // console.log('watch')
  reinit()

})



</script>

<script>
export default{
  name:'playpage'
}
</script>






<template>
    <!-- <div>
:style="{top:200-currentLine*27 +'px'}"
        <div class="title">{{ player_now.title }}</div>
        <div class="artist">{{ player_now.artist }}</div>
    </div> -->
<div id="lyricWrapper">
  <div id="lyricContainer" :style="{top:130-lrctop + 'px'}">
    <p v-for="(line,index) in lrc" 
    :key="index"
    :ref="setitemref"
    :class="index==currentLine?'current_line':''">
      {{line[1]}}
    </p>
  </div>
</div>
</template>

<style>
#lyricWrapper {
    overflow: hidden;
    position: relative;
    margin-top: 100px;
    color: #fff;
    height:calc(100% - 100px)
}

/* http://stackoverflow.com/questions/13426875/text-border-using-css-border-around-text */
#lyricContainer {
    height: 100%;
    position: relative;
    /* left:200px; */
    text-align: center;
    text-shadow: 1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000; 
    transition: 0.2s ease-in-out;
}
#lyricContainer p{
  font-size: 24px;
}


.current_line {
    color: orange;
}

</style>