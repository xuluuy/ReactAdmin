import React,{Component} from 'react'
import {Card,Button,Table,Modal,message} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdataRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'

/*
角色路由
 */
export default class Role extends Component {

   state = {
      roles:[],//所有角色的列表
      role:{},//选中的role
      isShowAdd:false,//是否显示添加界面
      isShowAuth:false,//是否显示设置权限界面
   }

   constructor(props) {
      super(props)
      this.auth = React.createRef()
   }


   initColumns = () => {
      this.columns = [
         {
            title:'角色名称',
            dataIndex:'name'
         },
         {
            title:'创建时间',
            dataIndex:'create_time',
            render:(create_time) => formateDate(create_time)
         },
         {
            title:'授权时间',
            dataIndex:'auth_time',
            render:formateDate
         },
         {
            title:'授权人',
            dataIndex:'auth_name'
         },
      ]
   }
   getRoles = async() => {
     const result = await reqRoles()
      if(result.status===0) {
         const roles = result.data
         this.setState({roles})
      }
   }

   onRow = (role) => {
      return {
         onClick: event => {//点击行
            console.log('row onClick',role)
            this.setState({role})
         },
      }
   }
   //添加角色
   addRole = () => {
      //进行表达验证，只有通过才继续
      this.form.validateFields(async(err,values) => {
         if(!err){
            //隐藏确认框
            this.setState({isShowAdd:false})
            //收集数据
            const {roleName} = values
            this.form.resetFields()//重置
            //请求添加
           const result = await reqAddRole(roleName)
            if(result.status===0){
               //根据结果提示/更新显示
               message.success('添加角色成功')
               //this.getRoles()//重新显示列表
               //新产生的角色
               const role = result.data
               //更新roles状态
               //const roles = this.state.roles
               //尽量不要直接更新状态数据
              /* const roles = [...this.state.roles]
               roles.push(role)
               this.setState({roles})*/
              //更新roles状态：基于原本的状态数据更新
              this.setState(state => ({
                 roles:[...state.roles,role]
              }))
            }else {
               message.error('添加角色失败')
            }

         }
      })

   }
  //更新角色
   updateRole = async () => {
      //隐藏确认框
      this.setState({isShowAuth:false})
     const role = this.state.role
      //得到最新的menus
      const menus  =this.auth.current.getMenus()
      role.menus = menus
      role.auth_time = Date.now()
      role.auth_name = memoryUtils.user.username
      //更新
      const result = await reqUpdataRole(role)
      if(result.status===0){
          //如果当前更新的是自己角色的权限，强制退出
          if(role._id === memoryUtils.user.role_id){
              memoryUtils.user = {}
              storageUtils.removeUser()
             this.props.history.replace('/login')
              message.success('当前用户角色权限已修改，请重新登录')
          }else {
              message.success('设置角色成功')
              //更新列表
              this.setState({
                  roles:[...this.state.roles]
              })
          }

      }else {
         message.error('设置角色失败')
      }

   }
   componentWillMount () {
      this.initColumns()
   }
   componentDidMount () {
      this.getRoles()
   }
   render () {
      const {roles,role,isShowAdd,isShowAuth} = this.state
      const title = (
          <span>
             <Button type='primary' onClick={() => this.setState({isShowAdd:true})}>创建角色</Button> &nbsp;
             <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth:true})}>设置角色权限</Button>{/*可否操作看role是否有_id*/}
          </span>
      )
      return (
        <Card title={title}>
           <Table
               dataSource={roles}
               columns={this.columns}
               bordered
               rowKey='_id'
               pagination = {{defaultPageSize:PAGE_SIZE}}
               rowSelection={{
                   type:'radio',
                   selectedRowKeys:[role._id],
                   onSelect: (role) => {
                       //选择某个radio时回调
                       this.setState({
                           role
                       })
                   }
               }}
               onRow={this.onRow}
           />
           <Modal
               title="添加角色"
               visible={isShowAdd}
               onOk={this.addRole}
               onCancel={() => {
                  this.setState({isShowAdd:false})
                  this.form.resetFields()//重置
               }}
           >
              <AddForm
                       setForm={(form) => {this.form = form}}
              />
              </Modal>
           <Modal
               title="设置角色权限"
               visible={isShowAuth}
               onOk={this.updateRole}
               onCancel={() => {
                  this.setState({isShowAuth:false})

               }}
           >
              <AuthForm
                  role={role}
                  ref={this.auth}
              />
           </Modal>
        </Card>
      )
   }
}