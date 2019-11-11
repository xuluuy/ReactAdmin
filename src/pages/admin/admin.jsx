import React,{Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Pie from '../chars/pie'
import Bar from '../chars/bar'
import Line from '../chars/line'

const { Footer, Sider, Content } = Layout;
/*
后台管理的路由组件
 */
export default class Admin extends Component {

    render () {
        const user =memoryUtils.user
        //如果内存中没有user
        if(!user || !user._id){
            //自动跳转到登录页面（在render中）
            return <Redirect to="/login" />
        }
        return (

                <Layout style={{minHeight:'100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{margin:20,backgroundColor: '#fff'}}>
                            <Switch>
                                <Route path="/home" component={Home}/>
                                <Route path="/category" component={Category}/>
                                <Route path="/product" component={Product}/>
                                <Route path="/role" component={Role}/>
                                <Route path="/user" component={User}/>
                                <Route path="/chars/pie" component={Pie}/>
                                <Route path="/chars/bar" component={Bar}/>
                                <Route path="/chars/line" component={Line}/>
                                <Redirect to="/home"/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                    </Layout>
                </Layout>

        )
    }
}