/**
 * 获取时间
 **/
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const dayArr = {0: '星期日', 1: '星期一', 2: '星期二', 3: '星期三', 4: '星期四', 5: '星期五', 6: '星期六'}
/**
 * 获取多样日期
 * n传入值(0获取两位数年份,1获取完整的年份,2获取当前月份,3获取当前日,4获取当前星期X,5获取当前小时,
 * 6获取当前分钟,7获取日期(年-月-日),获取时间（小时：分钟）)
 **/
const formatDate = n => {
  var date = new Date()
  switch (n) {
    case 0:
      return date.getYear()
    case 1:
      return date.getFullYear()
    case 2: 
      return date.getMonth() + 1
    case 3:
      return date.getDate()
    case 4:
      return dayArr[date.getDay()]
    case 5:
      return date.getHours()
    case 6:
      return date.getMinutes()
    case 7:
      return date.getFullYear() + '-' + formatNumber((date.getMonth() + 1)) + '-' + formatNumber(date.getDate())
    case 8:
      return formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes())
  }
}
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate
}
