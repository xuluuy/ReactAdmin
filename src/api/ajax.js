/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
 1.优化：统一处理请求异常?
   在外层包一个自己创建的promise对象
   在请求出错时不去reject，而是显示错误提示
   优化：异步得到的不是response 而是response.data
    在请求成功resolve时：resolve(response.data)
 */
import axios from 'axios'
import {message} from 'antd'

export default function ajax(url,data={},type='GET') {

    return new Promise((resolve,reject) => {
        let promise
        //1.执行异步ajax请求
        if(type=='GET'){//发送get请求
            promise = axios.get(url,{  //配置对象
                params:data //当前请求参数的配置
            })
        }else{//发送post请求
            promise = axios.post(url,data)

        }
        promise.then(response => {
            //2.成功了调用resolve
            resolve(response.data)
        }).catch(error => {
            //3.失败了 不调用reject，而是提示异常信息
            message.error('请求出错了'+error.message)
        })
    })
}

// //请求登录接口
// ajax('/login',{username:'tom',password:'12345'},'POST').then()
