import React,{Component} from 'react'
import { Form, Icon, Input, Button,message} from 'antd';
import {Redirect} from 'react-router-dom'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

const Item = Form.Item //不能写在import前

/*
登录的路由组件
 */
class Login extends Component {

    handleSubmit =(event) =>{
        //阻止默认提交
        event.preventDefault()
        //对所有的表单字段进行验证 自动获取输入的数据values
        this.props.form.validateFields(async (err, values) => {
            //校验成功
            if (!err) {
                //console.log('提交登录的ajax请求 ', values);
                //请求登录
                const {username,password} = values
                const result = await reqLogin(username,password)
                //const result = response.data //{status:0,data:user} {status:1,msg:'xxx'}
                if(result.status===0){//登录成功
                    //提示登录成功
                    message.success('登录成功')
                    //保存user
                    const user = result.data
                    memoryUtils.user = user  //保存到内存中
                    storageUtils.saveUser(user) //保存到local中
                    //跳转到后台管理界面 通过路由(不需要再回退回来)
                    this.props.history.replace('/')
                }else {//登录失败
                    message.error(result.msg)
                }

            }else{
                console.log('校验失败')
            }
        });
      //得到form对象
        //const form = this.props.form
        //手动获取表单项的输入数据 (username,password)
        //const values = form.getFieldsValue()

    }
    /*
    对密码进行自定义验证
    */
    validatePwd =(rule,value,callback) =>{
        if(!value){
            callback('密码必须输入')
        }else if(value.length<4){
            callback('密码长度必须大于4位')
        }else if(value.length>12){
            callback('密码长度必须小于12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('用户名必须是英文、数字或下划线组成')
        }else {
            callback()//验证通过
        }

    }

    render () {
        //得到具有强大功能的form对象
        const form = this.props.form
        const { getFieldDecorator } = form;
       //判断用户是否登录 如果用户已经登录 自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to="/"/>
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Item>
                                {
                                    /*
                                     用户名 / 密码的的合法性要求
                                     1). 必须输入
                                     2). 必须大于等于 4 位
                                     3). 必须小于等于 12 位
                                     4). 必须是英文、数字或下划线组成
                                     */
                                }
                                {getFieldDecorator('username',{ //配置对象： 属性名是特定的一些名称
                                    //声明式验证：直接使用别定义好的验证规则进行验证
                                    rules: [
                                        { required: true,whitespace: true, message: '请输入用户名!' },
                                        {min:4,message:'用户名最少输入4位'},
                                        {max:12,message:'用户名最多输入12位'},
                                        {pattern:/^[a-zA-Z0-9_]+$/,message: '用户名必须是英文、数字或下划线组成'}


                                    ],

                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />
                                )}

                            </Item>
                            <Form.Item>

                                {getFieldDecorator('password',{
                                    rules:[
                                        {validator:this.validatePwd}
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />
                                )}

                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                   登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}
/*
高阶函数
  1)一类特别的函数
     a. 接收函数类型的参数
     b. 返回值是函数
  2) 常见的高阶函数
     a.定时器 setTimeout()/setInterval()
     b.Promise: Promise(() => {}) then(value =>{},reason =>{})
     c.数组遍历相关的方法：foreach() filter() map() reduce() find() findIndex()
     d.fn.bind()  函数对象的bind方法
     e.Form.create()() / getFieldDecorator()()
  3)高阶函数更加动态，更加具有扩展性
高阶组件
  1) 本质就是一个函数
  2) 接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性
  3) 作用：扩展组件的功能
  4)高阶组件也是高阶函数：接收一个组件函数，返回是一个新的组件函数
 */
/*
包装Form组件 生成一个新的组件 Form(Login)
新组件会向Form组件传递一个强大的对象属性：form
 */
const WrapLogin =Form.create()(Login)
export default WrapLogin

/*
 1.前台表单验证
 2.收集表单输入数据
 */

/*
async 和await
1.作用？
   简化promise对象的使用，不用再使用.then()来指定成功/失败的回调函数
   以同步编码（没有回调函数）方式实现异步流程
2.哪里写await？
   在返回promise的表达式左侧写await：不想要promise而是promise异步执行的成功的value数据
3.哪里写async？
   await所在函数（最近的）定义的左侧写async
 */