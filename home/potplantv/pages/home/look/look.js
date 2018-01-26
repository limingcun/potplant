//index.js
//获取应用实例
import API from '../../../utils/api.js';
const util = require('../../../utils/util.js')
const app = getApp()
Page({
  data: {
  },
  onLoad: function (e) {
    wx.setNavigationBarTitle({title: '盆栽管理'})
    var plant_id = e.id
    var that = this
    wx.login({
      success: function(res){
        if (res.code) {
            var url = 'https://pot.find360.cn/get/openid?js_code=' + res.code
            wx.request({
                url: url,
                method: 'GET',
                success: function(res) {
                    var openid = res.data.openid.openid
                    that.lookCheck(plant_id, openid)
                }
            })
        }
      }
    })
  },
  /*
   * 查看判断
   */
  lookCheck: function(plant_id, openid) {
    var that = this
    app.requestData(API.homeLookCheck, {id: plant_id, openid: openid}, (err, data) =>{
      if (data !== 'true') {
        var url = '../index/index?id=' + plant_id
        wx.navigateTo({
          url: url
        })
      } else {
        that.setData({
          homeUrl: '/image/home-show.png',
          adminUrl: '/image/admin-operate.png'
        })
      }
    },'GET','home')
  },
  /*
   * 页面跳转
   */
  showUrl: function(e) {
    var type = e.currentTarget.dataset.type
    var plant_id = e.currentTarget.dataset.id
    if (type=='admin') {
      var url = '../../admin/operate/indexList/indexList?id=' + plant_id + '&name=' + plant_name
    } else {
      var url = '../index/index?id=' + plant_id
    }
  }
})
