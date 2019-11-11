import React,{Component} from 'react'
import { Card,Table,Button,Icon,message,Modal } from 'antd';

import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddCategorys,reqUpdateCategorys} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
/*
商品分类路由
 */
export default class Category extends Component {

   state = {
      loading:false, //是否正在获取数据中
      categorys:[],//一级分类列表
      subCategorys:[],//二级子分类列表
      parentId:'0',//当前需要显示的分类列表的父分类id parentId
      parentName:'',//当前需要显示的分类列表的父分类名称
      showStatus:0,//标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
   }
   //初始化Table所有的列数组
   initColums = () => {
      this.columns = [
         {
            title: '分类名称',
            dataIndex: 'name',//显示数据对应的属性名

         },
         {
            title: '操作',
            width:300,//指定宽度
            render: (category) => ( //返回需要显示的界面标签  当需要在点击事件里传参数时，可以包一个函数
                <span>
                  <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                   {/*如何向事件回调函数传递参数？ 先定义一个匿名函数 在函数中调用处理的函数并传入数据*/}
                   {this.state.parentId==='0' ? <LinkButton onClick={() => {this.showSubCategorys(category)}}>查看子分类</LinkButton> : null}

               </span>

            )
         },
      ];
   }
   //异步获取一级/二级分类列表显示 使用到接口请求函数 所以引入接口
   //parentId：如果没有指定根据状态中的parentId请求，如果指定
    //根据指定的请求
    getCategorys = async (parentId) => {
      //在发请求前显示loading
      this.setState({loading:true})
      parentId = parentId || this.state.parentId
      //发异步ajax请求获取数据
      const result = await reqCategorys(parentId)
      //在请求完成后，隐藏loading
      this.setState({loading:false})
      if(result.status===0){
         //取出分类数组(可能是一级也可能是二级)
         const categorys = result.data
         if(parentId==='0'){
            //更新一级分类数组状态
            this.setState({
               categorys
            })
         }else {
            //更新二级分类状态
            this.setState({
               subCategorys:categorys
            })
         }
      }else {
         message.error('获取分类列表失败')
      }
   }

   //显示指定一级分类对象的二级子列表
  showSubCategorys = (category) => {
     //更新状态  setState是异步更新状态
     this.setState({
        parentId:category._id,
        parentName:category.name
     },() => {//在状态更新且重新render()后执行
        //获取二级分类列表显示
        this.getCategorys()

     })

  }
  //显示一级分类列表
  showCategorys = () => {
    this.setState({
       //更新为显示一级列表的状态
       parentId:'0',
       parentName:'',
       subCategorys:[]
    })
  }
  //响应 点击取消：隐藏确认框
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()
        //隐藏确认框
        this.setState({
            showStatus:0
        })
    }
    //显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus:1
        })
    }
    //添加分类
    addCategory = () => {
        //验证表单
        this.form.validateFields(async(err,values) => {
            if(!err){
                //隐藏确认框
                this.setState({
                    showStatus:0
                })
                //收集数据，并提交添加分类的请求
                const {parentId,categoryName} = values
                //清除输入数据 在获取数据后面
                this.form.resetFields()
                const result = await reqAddCategorys(categoryName,parentId)
                if(result.status===0){
                    //添加的分类就是当前分类列表下的分类
                    if(parentId===this.state.parentId) {
                        //重新获取当前分类列表显示
                        this.getCategorys()
                    }else if(parentId==='0'){
                        //在二级分类列表下添加一级分类项，重新获取一级分类列表，但不需要显示一级列表
                        this.getCategorys('0')
                    }

                }
            }

        })



    }

    //显示更新的确认框
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        //更新状态
        this.setState({
            showStatus:2
        })
    }
    //更新分类
    updateCategory = () => {
        //表单验证，只有通过了才处理
        this.form.validateFields(async(err,values) => {
            if(!err){
                //1.隐藏确定框
                this.setState({
                    showStatus:0
                })
                //准备数据
                const categoryId = this.category._id
                const {categoryName} = values
                //清除输入数据 在获取数据后面
                this.form.resetFields()
                //2.发送请求更新分类
                const result = await reqUpdateCategorys({categoryId,categoryName})
                if(result.status===0){
                    //3.重新显示列表
                    this.getCategorys()
                }
            }
        })



    }

   //为第一次render()准备数据  componentWillMount () 中基本不写过多代码 把代码封装到方法中 调用方法即可
componentWillMount () {
  this.initColums()
}
//执行异步任务发请求 异步ajax
   componentDidMount () {
      //获取一级分类列表显示
      this.getCategorys()
   }
   render () {
      //读取状态数据
      const {categorys,subCategorys,parentId,parentName,loading,showStatus} = this.state
      //读取指定的分类
       const category = this.category || {} // 如果还没有指定一个空对象
      //card的左侧
      const title = parentId==='0' ? '一级分类列表' : (
          <span>
             <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
             <Icon type="arrow-right" style={{marginRight:5}}/>
             <span>{parentName}</span>
          </span>
      )
      //card的右侧
      const extra = (
          <Button type='primary' onClick={this.showAdd}>
             <Icon type = 'plus'/>
             添加
          </Button>
      )






      return (
          <Card title={title} extra={extra} >
             <Table
                 dataSource={parentId==='0'?categorys:subCategorys}
                 columns={this.columns}
                 bordered
                 rowKey='_id'
                 pagination = {{defaultPageSize:5,showQuickJumper:true}}
                 loading={loading}
             />
              <Modal
                  title="添加分类"
                  visible={showStatus===1}
                  onOk={this.addCategory}
                  onCancel={this.handleCancel}

              >
                  <AddForm categorys={categorys}
                           parentId={parentId}
                           setForm={(form) => {this.form = form}}
                  />

              </Modal>
              <Modal
                  title="更新分类"
                  visible={showStatus===2}
                  onOk={this.updateCategory}
                  onCancel={this.handleCancel}

              >
                  <UpdateForm categoryName={category.name}
                              setForm={(form) => {this.form = form}}
                  />

              </Modal>
          </Card>
      )
   }
}