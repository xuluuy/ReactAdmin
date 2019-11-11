/**
 * Created by Administrator on 2019/10/21 0021.
 */
/*包含 n 个日期时间处理的工具函数模块 */
/*格式化日期 */
export function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    return date.getFullYear() + '-' + (date.getMonth() + 1)
        + '-' + date.getDate() + ' ' + date.getHours()
        + ':' + date.getMinutes() + ':' + date.getSeconds()
}