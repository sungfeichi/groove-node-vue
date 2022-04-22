import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const Path=require('path')
function resolve(dir){
  return Path.join(__dirname,dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: { port: 8080 },
  resolve: {
    alias: {
      "@": resolve('src'),
      "base": resolve("baseConfig"),
      "vue":"vue/dist/vue.esm-bundler.js",
    },
    extensions: ['.js', '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己 增减
  }
})
