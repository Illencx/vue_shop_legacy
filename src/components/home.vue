<template>

<el-container class="maincontainer">
    <!-- elhead头部 -->
  <el-header>
      <div>
          <span id="title">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
  </el-header>
  <!-- 页面主题 -->
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="iscol ? '64px' : '210px' " overflow="hidden">

<!-- 侧边栏菜单区域 -->
    <el-menu
      background-color="#000814"
      text-color="#ffc300"
      active-text-color="#ffd04b"
      unique-open="true"
      :collapse="iscol"
      overflow="hidden"
      router
      :default-active="actived"
     >
        <div class="toggle-button" @click="togglecol()" >|||</div>
      <el-submenu  :index="item.id + ' ' " v-for="item in menulist" :key="item.id" >
        <template slot="title">
          <i :class="icons[item.id]"></i>
          <span >{{item.authName}}</span>
        </template>

    <el-menu-item :index=" '/' +sitem.path"  v-for="sitem in item.children" :key="sitem.id" @click="saveNavState('/' +sitem.path)">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{sitem.authName}}</span>
        </template>
    </el-menu-item>

      </el-submenu>

    </el-menu>

    </el-aside>
    <el-container>
        <!-- 主题 -->
      <el-main>
          <router-view></router-view>
      </el-main>
      <el-footer>作者：Leo/illencx 该项目仅供展示，无任何实际用途  illencx@outlook.com</el-footer>
    </el-container>
  </el-container>
</el-container>

</template>

<script>
export default {

    methods: {
        logout () {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取菜单
        async getMenuList() {
          const { data: res } = await this.$http.get('menus')
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.menulist = res.data
          console.log(res)
        },
        togglecol() {
            this.iscol = !this.iscol
        },
        saveNavState(path) {
            window.sessionStorage.setItem('actived', path)
            this.active = path
        }
    },
    created () {
        this.getMenuList()
        this.actived = window.sessionStorage.getItem('actived')
    },
data () {
    return {
 // 左侧菜单数据
        menulist: [],
        icons: {
            125: 'el-icon-user-solid',
            103: 'el-icon-s-check',
            101: 'el-icon-s-goods',
            102: 'el-icon-s-order',
            145: 'el-icon-s-data'
        },
        iscol: false,
        actived: ' '
    }
    }
}
</script>

<style scoped>
.el-header {
    padding:10px;
    display: flex;
    justify-content: space-between;
  background-color:#ffc300;
}
.el-aside{
background-color: #000814;
}
.el-main{
    background-color:#edf2f4;
}
.el-footer{
    display:flex;
    justify-content:center;
   background-color:#003566;
   color:#ffc300;
   padding-top:20px;
}
.maincontainer{
    height: 100%;
}
.el-button{
    background-color:#001d3d;
    height: 100%;
}
#title{
   color:#003566;
   font-size:2em;
}
.toggle-button{

    background-color:#000814;
    color:#ffc300;
    text-align: center;
    letter-spacing:.2em;
    cursor: pointer
}
</style>
