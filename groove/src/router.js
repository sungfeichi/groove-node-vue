import { createRouter, createWebHashHistory } from "vue-router";

const gallery = () => import('./pages/gallery.vue')
const album = () => import('./pages/album.vue')

const playliststore = () => import('./pages/playliststore.vue')
const playlist= () => import('./pages/playlist.vue')
import playpage from "./pages/playpage.vue"
import setting from "./pages/setting.vue"
const NotFound = { template: '<div>NotFound</div>' }
// import test from './pages/test.vue'
// import temp from './pages/temp.vue'
// import hello from './pages/hello.vue'
const routes = [
  {
    path:'/gallery',
    redirect:"/"
  },
  {
    path: '/',
    name: "gallery",
    component: gallery,
  },
  {
    path: '/playpage',
    name: "playpage",
    component: playpage,
  },
  {
    path: '/album/:album',
    name: "album",
    component: album,
    props:true,
  },
  {
    path: '/playlist/',
    name: "playliststore",
    component: playliststore,
  },
  {
    path: '/playlist/:name',
    name: "playlist",
    component: playlist,
    props:true,
  },


  {
    path:'/setting',
    name:setting,
    component:setting,
  },
  // {
  //   path:'/hello',
  //   name:hello,
  //   component:hello,
  // },
  // {
  //   path:'/test',
  //   name:test,
  //   component:test,
  // },
  // {
  //   path:'/temp',
  //   name:temp,
  //   component:temp,
  // },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
  // { path: '/user-:afterUser(.*)', component: UserGeneric },

]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export default router
