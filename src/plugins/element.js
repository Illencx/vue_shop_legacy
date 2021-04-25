import Vue from 'vue'
import { MessageBox, Dialog, Pagination, Tooltip, Switch, Table, TableColumn, Row, Col, Button, Card, Form, FormItem, Input, Message, Container, Aside, Main, Footer, Header, Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem } from 'element-ui'

Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
