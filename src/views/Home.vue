<template>
 <div class="home-container">
  <!-- 顶部状态栏 -->
  <Header></Header>
  <van-loading size="45" vertical v-if="homepageLoading">加载中...</van-loading>
  <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
    <van-swipe-item v-for="item in topNews" :key="item.id" :style="{backgroundImage: 'url(' + item.image + ')',
      backgroundRepeat:'no-repeat',backgroundSize:'100% 100%'}">
      <router-link :to="'/home/newsinfo/' + item.id " tag="div" class="link">
      <div class="cover"
      :style="{backgroundImage: `linear-gradient(0,rgba(${item.rgb[0]},${item.rgb[1]},${item.rgb[2]},1),rgba(${item.rgb[0]},${item.rgb[1]},${item.rgb[2]},0.9),rgba(${item.rgb[0]},${item.rgb[1]},${item.rgb[2]},0))`}">
        <div class="author">
          {{item.hint}}
        </div>
        <div class="title">
          {{item.title}}
        </div>
      </div>
      </router-link>
    </van-swipe-item>
  </van-swipe>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getListByPage"
      :immediate-check="false"
      :offset="50"
    >
    <router-link tag="li" v-for="item in otherNews" :key="item.id" class="news-list" :to="'/home/newsinfo/' + item.id ">
      <div class="list-word">
        <div class="list-title" id="list-word">{{item.title}}</div>
        <div class="list-author">{{item.hint}}</div>
      </div>
      <div class="list-img">
        <img :src="item.images[0]">
      </div>
    </router-link>
    </van-list>
  </van-pull-refresh>

 </div>
</template>

<script>
import Header from '../components/Header.vue'
export default {
  name:'home',
  components: {
    Header
  },
  data(){
    return {
      topNews: [],
      otherNews:[],
      date: '',
      page: 0,
      index: '',
      loading: false,
      finished: false,
      refreshing: false,
      homepageLoading: true
    }
  },
  created(){
    this.getLastNews()
  },
  methods: {
    async getLastNews(){
      try{
        const res = await this.$http.get('/v1/last-stories')
        this.topNews = res.data.STORIES.top_stories
        for(let item of this.topNews){
          item.rgb = this.hugToRgb(item.image_hue)
        }
        this.otherNews = this.otherNews.concat(res.data.STORIES.stories)
        this.date = res.data.STORIES.date
        this.homepageLoading = false
      }catch(err){
        console.log(err)
      }
    },
    async getListByPage(){
      if(this.refreshing){
        this.otherNews = []
        this.refreshing = false
      }
      try{
        this.index = this.reduceDate(this.date,this.page)
        const res = await this.$http.get('/v1/before-stories/' + this.index)
        this.otherNews = this.otherNews.concat(res.data.STORIES.stories)
        this.loading = false
        this.page++
      }catch(err){
        console.log(err)
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.getListByPage()
    },
    hugToRgb(str){
      var one = str.substring(2,4)
        var two = str.substring(4,6)
        var three = str.substring(6,8)
        return[parseInt('0x' + one),parseInt('0x' + two),parseInt('0x' + three)]
    },
    reduceDate(datestr,page){
      datestr = datestr.substring(0,4) + '-' + datestr.substring(4,6) + '-' + datestr.substring(6,8)
      var d = new Date(datestr)
      d.setDate(d.getDate()-page)
      var month = (d.getMonth() + 1).toString().padStart(2,'0')
      var year = (d.getFullYear()).toString()
      var day = (d.getDate()).toString().padStart(2,'0')
      return year + month + day        //注意 getMonth 这些返回的都是整数而不是字符串
    }
  }
}
</script>
<style lang="scss">
.home-container{
  padding-top: 3.5rem;
  .my-swipe{
    height: 24rem;
    .van-swipe-item {
      .link{
        width: 100%;
        height: 100%;
        color:#fff;
        display: flex;
        flex-direction: column-reverse;
        .cover{
          height: 50%;
          width: 100%;
          display: flex;
          flex-direction: column-reverse;
        }
        .author{
          margin:0.7692rem;
          font-size:1rem;
          opacity: 0.8;
        }
        .title{
          line-height: 1.4rem;
          margin:0.7692rem;
          font-weight: 600;
          font-size: 1.2rem;
        }
      }
    }
    .van-swipe__indicators{
      left: 90%;
    }
  }
  .news-list {
    height: 6rem;
    display: flex;
    justify-content: space-between;
    .list-img {
      padding:0.3846rem;
    }
    .list-word {
      margin: 0.5rem;
      .list-title {
        margin:5px;
        font-size:1rem;
        font-weight: bold;
      }
      .list-author {
        margin:0.3846rem;
        font-size:0.7692rem;
        color:gray;
      }
    }
    img {
      height:5.2rem;
      width:5.2rem;
    }
  }
}
</style>
