import React,{Component} from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree


/*
 更新角色的form组件
 */
export default class AuthForm extends Component {

    static propTypes = {
       role:PropTypes.object

    }

    constructor (props) {
        super(props)
        //根据传入角色的menus确定状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus
        }
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre,item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }
    //选中某个node时
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        this.setState({checkedKeys})
    };
    //为父组件提供获取最新menus的方法
    getMenus = () => this.state.checkedKeys
componentWillMount () {
    this.treeNodes = this.getTreeNodes(menuList)
}
//根据新传入的role来更新checkedKeys的状态
    //当组件接收到新的属性时自动调用
    componentWillReceiveProps (nextProps) {
       const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }
    render () {
        //指定item布局的配置对象
        const formItemLayout = {
            labelCol:{span:4},//左侧label的宽度
            wrapperCol:{span:16},//指定右侧包裹的宽度
        }
        const {role} = this.props
        const {checkedKeys} = this.state
        return (
            <div>
                <Item label="角色名称" {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
