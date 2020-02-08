import VueRouter from 'vue-router'
import home from '../views/Home.vue'
import content from '../views/Content.vue'
import comment from '../views/Comment.vue'

// 3. 创建路由对象
var router = new VueRouter({
  routes: [
    {path:'/',redirect:'/home'},
    {path: '/home', component: home, meta:{ keepAlive: true} },
    {path: '/home/newsinfo/:id',component: content ,meta:{ keepAlive: true}},
    {path: '/home/newsinfo/comments/:id',component:comment }
  ]
})

// 把路由对象暴露出去
export default router
