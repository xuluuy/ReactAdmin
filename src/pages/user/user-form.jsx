import React,{PureComponent} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
/*
 用户添加/更改的form组件
 */
class UserForm extends PureComponent {

    static propTypes = {
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }
    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render () {
        const {roles} = this.props
        const user = this.props.user || {}
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:15},
        }
        return (
            <Form {...formItemLayout}>
                <Item label="用户名" >
                    {
                        getFieldDecorator (
                            'username',{
                                initialValue:user.username,
                            })(
                            <Input placeholder="请输入用户名"/>
                              )
                    }
                </Item>
                {//如果修改用户 不显示密码
                    user._id ? null : (
                        <Item label="密码" >
                            {
                                getFieldDecorator (
                                    'password',{
                                        initialValue:user.password,
                                    })(
                                    <Input type='password' placeholder="请输入密码"/>
                                )
                            }
                        </Item>
                    )
                }
                <Item label="手机号" >
                    {
                        getFieldDecorator (
                            'phone',{
                                initialValue:user.phone,
                            })(
                            <Input  placeholder="请输入手机号"/>
                        )
                    }
                </Item>
                <Item label="邮箱" >
                    {
                        getFieldDecorator (
                            'email',{
                                initialValue:user.email,
                            })(
                            <Input  placeholder="请输入邮箱"/>
                        )
                    }
                </Item>
                <Item label="角色" >
                    {
                        getFieldDecorator (
                            'role_id',{
                                initialValue:user.role_id,
                            })(
                            <Select>
                                {
                                    roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)