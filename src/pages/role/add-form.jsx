import React,{Component} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item

/*
 添加角色的form组件
 */
class AddForm extends Component {

    static propTypes = {
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数

    }
    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render () {
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol:{span:4},//左侧label的宽度
            wrapperCol:{span:16},//指定右侧包裹的宽度
        }
        const {getFieldDecorator} = this.props.form
        return (
            <Form>

                <Item label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator (
                            'roleName',{
                                initialValue:'',
                                rules: [
                                    {required:true,message:'角色名称必须输入'}
                                ]
                            }
                        )(
                            <Input placeholder="请输入角色名称"/>
                        )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)