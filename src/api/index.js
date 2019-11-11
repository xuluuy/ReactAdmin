/**
 * Created by Administrator on 2019/10/17 0017.
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
/*
要求：能根据接口文档定义接口请求函数
包含应用中所有接口请求函数的模块
每个接口函数的返回值都是promise

基本要求：能根据接口文档定义接口请求函数
 */
/*
export function reqlogin() {
   return ajax('/login',{username,password},'POST')
} */
const BASE = ''
//登录 接口请求函数
export const reqLogin =(username,password) => ajax(BASE+'/login',{username,password},'POST')

//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list',{parentId})
//添加分类
export const reqAddCategorys = (categoryName,parentId) => ajax(BASE + '/manage/category/add',{categoryName,parentId},'POST')
//更新分类
export const reqUpdateCategorys = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update',{categoryId,categoryName},'POST')
//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})
//搜索商品分页列表 根据名字/描述 searchType:搜索的类型，productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE+'/manage/product/search',{pageNum,pageSize,[searchType]:searchName})
//获取一个分类
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})
//删除图片
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')
//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/'+( product._id ? 'update':'add'),product,'POST')
//修改商品
//export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update',product,'POST')
//获取所有角色列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
//添加角色
export const reqAddRole = (roleName) =>ajax(BASE + '/manage/role/add',{roleName},'POST')
//更新角色
export const reqUpdataRole = (role) => ajax(BASE + '/manage/role/update',role,'POST')
//获取用户列表
export const reqAllUsers = () => ajax(BASE + '/manage/user/list')
//删除一个用户
export const reqDeleteUser = (userId) => ajax(BASE+ '/manage/user/delete',{userId},'POST')
//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id ? 'update' : 'add' ),user,'POST')
//jsonp的天气接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve,reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        //发送jsonp请求
        jsonp(url,{},(err,data) => {

            //成功
            if(!err && data.status=='success'){
                //取出需要的数据
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else {
                //失败
               message.error('获取天气信息失败')
            }
    })
    })
}
/*

 */
