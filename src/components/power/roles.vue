<template>
  <div>

    <!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图 -->
<el-card>
    <el-row>
        <el-col>
            <el-button type="primary" @click="addDialogVisible = !addDialogVisible ">添加角色</el-button>
        </el-col>
    </el-row>

<el-table :data="roleList" border stripe>
    <el-table-column width="60px" type="expand">
      <template slot-scope="scope">

        <el-row v-for=" (item1,i1) in scope.row.children " :key="item1.id " :class="['bdbottom' , i1 === 0 ? 'bdtop' :' ' ,'vcenter']">
          <!-- 一级权限 -->
          <el-col span="5">
            <el-tag  effect="dark" closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>
          <!-- 二三级权限 -->
          <el-col span="19">
            <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="['bdbottom' , i2 === 0 ? 'bdtop' :' ','vcenter']">
              <el-col span="6">
                <el-tag type="success"  effect="dark" closable @close="removeRightById(scope.row,item2.id)" >{{item2.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col span="13">
                <el-row v-for="(item3) in item2.children" :key="item3.id" >
                  <el-col>
                    <el-tag  effect="dark" type="warning" closable @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)">删除</el-button>
      <el-button type="warning" icon="el-icon-setting" size="mini" @click = "settingDialog(scope.row)">分配权限</el-button>
        </template>
    </el-table-column>

</el-table>

</el-card>

<el-dialog
  title="添加角色"
  :visible.sync="addDialogVisible"
  width="30%"
  append-to-body = true
  >

<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="角色名" >
    <el-input  v-model="addForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" >
    <el-input v-model="addForm.roleDesc"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogClosed()">取 消</el-button>
    <el-button type="primary" @click="confirmCreate()">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
title="编辑角色"
:visible.sync="editRoleVisible"
 width="50%"
@close="editRoleClosed()"
append-to-body="true"
>
<el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
<el-form-item label="角色名">
  <el-input v-model="editForm.roleName"> </el-input>
</el-form-item>
<el-form-item label="角色描述">
  <el-input v-model="editForm.roleDesc"></el-input>
</el-form-item>
</el-form>
<span slot="footer" class="dialog-footer">
  <el-button @click="editRoleVisible = false">取消</el-button>
  <el-button type="primary" @click="editConfirm()">确定</el-button>
</span>
</el-dialog>

<el-dialog
  title="权限分配"
  :visible.sync="setRightDialogVisible"
  width="20%" @close="defK = []">
 <el-tree :data="rightsList" :props="treeProps"
 show-checkbox node-key="id"
 default-expand-all :default-checked-keys="defK"
 ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="Auth()">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
    data() {
        return {
            // 角色列表数据
            roleList: [],
            addDialogVisible: false,
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            rightsList: [],
            treeProps: {
              label: 'authName',
              children: 'children'
            },
            defK: [],
            roleId: ' ',

    addFormRules: {
      roleName: [
        { required: true, message: '角色名是必须的：）', trigger: 'blur' }
      ],
       roleDesc: [
         { required: true, message: '角色描述必填项', trigger: 'blur' }
      ]
    },
    editRoleVisible: false,
    setRightDialogVisible: false,
    editForm: {}

        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
    async   getRoleList() {
       const { data: res } = await this.$http.get('roles')
       if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
       this.roleList = res.data
       console.log(this.roleList)
        },
        addDialogClosed() {

    },
    clearDeck() {

    },
   async confirmCreate() {
     const { data: res } = await this.$http.post('roles', this.addForm)
     if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
     this.$message.success(res.meta.msg)
     this.getRoleList()
     this.addDialogVisible = false
    },
    getLeafK(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
      this.getLeafK(item, arr))
    },

    async removeById(id) {
       var resp = await this.$confirm('将要删除该角色，是否继续？', '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)

    var res = ''

    if (resp !== 'confirm') {
      return 0
    }
    res = await this.$http.delete('roles/' + id)
    this.getRoleList()
    console.log(res)
  },
  editRoleClosed() {

  },
  editConfirm() {
    this.$refs.editFormRef.validate(async valid => {
      if (!valid) return false
      const { data: res } = await this.$http.put(`roles/${this.editForm.roleId}`, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRoleVisible = false
      this.getRoleList()
      return this.$message.success(res.meta.msg)
    }
    )
  },

async showEditDialog(id) {
const { data: res } = await this.$http.get(`roles/${id}`)
 if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
this.editForm = res.data
 this.editRoleVisible = true
  },
 async removeRightById(data, id) {
  const confirmRes = await this.$confirm('将删除权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmRes !== 'confirm') {
          return this.$message.info('已取消')
        }
       const { data: res } = await this.$http.delete(`roles/${data.id}/rights/${id}`)
       if (res.meta.status !== 200) {
         this.$message.error(res.meta.msg)
       }

       data.children = res.data

        return this.$message.info('已删除')
  },

 async settingDialog(role) {
  const { data: res } = await this.$http.get('rights/tree')
  if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  this.rightsList = res.data
  this.roleId = role.id
  console.log(this.rightsList)
  this.getLeafK(role, this.defK)
    this.setRightDialogVisible = true
  },
 async Auth() {
    this.setRightDialogVisible = false
    const ks = [
      ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
    ]
    const ids = ks.join(',')
 const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: ids })
 if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
 this.$message.success(res.meta.msg)
  this.getRoleList()
  }

    }
    }

</script>

<style scoped>
.el-tag{
  margin: 5px;
}
.bdtop{

border-top: 1px solid #eee;

}
.bdbottom{
border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center
}
</style>
