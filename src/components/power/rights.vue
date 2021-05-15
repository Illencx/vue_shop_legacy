<template>
<div>
<!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>

<!-- 表格 -->
<el-table :data="rightsList" border stripe>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="权限名称" prop="authName"></el-table-column>
    <el-table-column label="路径" prop="path"></el-table-column>
    <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'">
                一级
            </el-tag>
            <el-tag  v-else-if=" scope.row.level === '1'">
                二级
            </el-tag>
            <el-tag type="warning" v-else-if=" scope.row.level === '2'">
                三级
            </el-tag>
        </template>
    </el-table-column>
</el-table>

</el-card>

</div>
</template>

<script>
export default {
    // 数据
data() {
return {
    // 权限列表
    rightsList: []

}
},
// 生命周期函数
created() {
    // 获取所有权限
this.getRightsList()
},
// 方法集
methods: {
    // 获取权限方法
   async getRightsList() {
   const { data: res } = await this.$http.get('rights/list')
   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
   this.rightsList = res.data
   console.log(res)
    }

}

}
</script>

<style scoped>

</style>
