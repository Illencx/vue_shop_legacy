<template>
  <div>
    <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card >
<el-row :gutter="20">
  <el-col :span="7">
    <el-input placeholder="在此搜索"  v-model="queryinfo.query" clearable=true @clear="getQueryList()">
    <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
  </el-col>
</el-row>

<!-- 用户列表区域 -->
<el-table :data="userlist" border stripe>
  <el-table-column type="index"></el-table-column>
  <el-table-column label="姓名" prop="username"></el-table-column>
  <el-table-column label="邮箱" prop="email"></el-table-column>
  <el-table-column label="电话" prop="mobile"></el-table-column>
  <el-table-column label="角色" prop="role_name"></el-table-column>
  <el-table-column label="状态">
    <template slot-scope="scope">
    <el-switch
  v-model="scope.row.mg_state"
  active-color="#13ce66"
  inactive-color="#ff4949"
  @change="statechange(scope.row)">
    </el-switch>
    </template>
  </el-table-column>
  <el-table-column label="操作"  width="200px">
    <template slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
      <el-tooltip  placement="top" content="分配角色" enterable="false" >
      <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
     </el-tooltip>
    </template>
  </el-table-column>
</el-table>

<el-pagination
      v-if="false"
      @size-change="handleSizeChange()"
      @current-change="handleCurrentChange()"
      :current-page="this.queryinfo.pagenum"
      :page-sizes="[1, 5, 10, 20]"
      :page-size="this.queryinfo.pageize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.queryinfo.total">
    </el-pagination>

</el-card>
<!-- 添加用户 -->
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="rst()">

<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机 " prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="修改信息"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed()">

<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" >
    <el-input v-model="this.editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机 " prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo()">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="分配角色"
  :visible.sync="SRDV"
  width="50%"
  append-to-body
  @close = "SRDC()">
  <div>
    <p>当前用户:{{this.usrInfo.username}}</p>
    <p>当前角色:{{this.usrInfo.role_name}}</p>
    <p>分配选项:
      <el-select v-model="selectedRoleId" placeholder="请选择">
      <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="SRDV = false">取 消</el-button>
    <el-button type="primary" @click="roleConfirm()">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
data() {
  var checkEmail = (rule, value, cb) => {
    const reg = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm
    if (reg.test(value)) {
      return cb()
    }
    cb(new Error('不合法'))
  }
   var checkMobile = (rule, value, cb) => {
     const reg = /^1[3|5|8|7]\d{9}$/
      if (reg.test(value)) {
      return cb()
    }
    cb(new Error('不合法'))
   }
  return {
    queryinfo: {
      query: '',
      pagenum: 1,
      pagesize: 100
    },
    userlist: [],
    total: 0,
    addDialogVisible: false,
    addForm: {
      username: '',
      password: '',
      email: '',
      mobile: ''
    },
    editFormRules: {
       email: [
         { required: true, message: '邮箱是必填项', trigger: 'blur' },
         { validator: checkEmail, trigger: 'blur' }

      ],

       mobile: [
         { required: true, message: '必填项', trigger: 'blur' },
         { validator: checkMobile, trigger: 'blur' }

      ]
    },
    addFormRules: {
      username: [
        { required: true, message: '用户名是必须的：）', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
      ],
        // 验证密码
       password: [
         { required: true, message: '没有钥匙是打不开门的', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
      ],

       email: [
         { required: true, message: '邮箱是必填项', trigger: 'blur' },
         { validator: checkEmail, trigger: 'blur' }

      ],

       mobile: [
         { required: true, message: '必填项', trigger: 'blur' },
         { validator: checkMobile, trigger: 'blur' }

      ]
    },
    editDialogVisible: false,
    editForm: {},
    SRDV: false,
    usrInfo: {},
    rolesList: [],
    selectedRoleId: ' '

  }
},
created() {
  this.getUserList()
},
methods: {
 async getUserList() {
var query = this.queryinfo.query
var pagenum = this.queryinfo.pagenum
var pagesize = this.queryinfo.pagesize
const { data: res } = await this.$http.get('users', { params: { query, pagenum, pagesize } })
console.log(res)
if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  this.userlist = res.data.users
  this.total = res.data.total
  },
handleSizeChange(newSize) {
this.queryinfo.pagesize = newSize
this.getUserList()
  },
handleCurrentChange(newPage) {
this.queryinfo.pagenum = newPage
this.getUserList()
  },
 async statechange(userInfo) {
 const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
 if (res.meta.status !== 200) {
  userInfo.mg_state = !userInfo.mg_state
return this.$message.error(res.meta.msg)
 }
 this.$message.success(res.meta.msg)
  },
  rst() {
    this.$refs.addFormRef.resetFields()
  },
  addUser() {
    this.$refs.addFormRef.validate(async valid => {
      if (!valid) return 1
     const { data: res } = await this.$http.post('users', this.addForm)
     if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
     this.$message.success(res.meta.msg)
     this.addDialogVisible = false
     this.getUserList()
    })
  },
  async showEditDialog(id) {
 const { data: res } = await this.$http.get(`users/${id}`)
 if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
this.editForm = res.data
 this.editDialogVisible = true
  },
  editDialogClosed() {
    this.$refs.editFormRef.resetFields()
  },
  editUserInfo() {
    this.$refs.editFormRef.validate(async valid => {
      if (!valid) return false
      const { data: res } = await this.$http.put(`users/${this.editForm.id}`, { email: this.editForm.email, mobile: this.editForm.mobile })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDialogVisible = false
      this.getUserList()
      return this.$message.success(res.meta.msg)
    })
  },
  async removeUserById(id) {
   var resp = await this.$confirm('将要删除该用户，是否继续？', '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(err => err)

    var res = ''

    if (resp !== 'confirm') {
      return 0
    }
    res = await this.$http.delete('users/' + id)
    this.getUserList()
    console.log(res)
  },
 async setRole(row) {
    this.usrInfo = row
  const { data: res } = await this.$http.get('roles')
  if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  this.rolesList = res.data
    this.SRDV = true
  },
 async roleConfirm() {
    if (!this.selectedRoleId) {
      return this.$message.error('未指定分配角色')
    }
  const { data: res } = await this.$http.put(`users/${this.usrInfo.id}/role`, {
      rid: this.selectedRoleId
    })
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    this.$message.success(res.meta.msg)
    this.getUserList()
    this.SRDV = false
  },
  SRDC() {
    this.selectedRoleId = ' '
    this.usrInfo = {}
  }
}

}
</script>

<style scoped>

</style>
