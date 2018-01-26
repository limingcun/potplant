//index.js
//获取应用实例
import API from '../../../../utils/api.js';
const app = getApp()
Page({
  data: {
    plant_id: 0
  },
  onLoad: function (e) {
    var that = this
    this.data.plant_id = e.id
    if (!wx.getStorageSync('openid')) {
        this.loginAuthorize()
    } else {
        this.loginUrl(wx.getStorageSync('openid'))
    }
  },
  /*
   * 登录获取openid
   */
  loginAuthorize: function () {
        var that = this
        wx.login({
            success: function(res){
                if (res.code) {
                    var l = 'https://pot.find360.cn/get/openid?js_code=' + res.code
                    wx.request({
                        url: l,
                        method: 'GET',
                        success: function(res) {
                            var openid = res.data.openid.openid
                            wx.setStorageSync('openid', openid)
                            that.loginUrl(openid)
                        }
                    })
                }
            }
        })
    },
    /*
     * 判断是否是已申请通过管理员
     */
    loginUrl: function(openid) {
        var that = this
        wx.request({
            url: 'https://pot.find360.cn/web/isadmin',
            data:{
                openid: openid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: "GET",
            success: function(res) {
                if (res.data=='disapply') {
                    app.showToast('请通过申请使用', '/image/gth.png', 2000)
                    setTimeout(function() {
                        that.homeUrl()
                    }, 2000)
                } else if(res.data=='false') {
                    app.showToast('请等候申请通过', '/image/gth.png', 2000)
                    setTimeout(function() {
                        that.homeUrl()
                    }, 2000)
                } else {
                    that.invit(res.data)
                }
            }
        })
    },
    /*
     * 邀请操作
     */
    invit: function(user_id) {
      var that = this
      var data = {
        plant_id: this.data.plant_id,
        user_id: user_id
      }
      app.requestData(API.webInvit, data, (err, res) =>{
        if (res != 'false') {
            app.showToast('成功加入邀请', '/image/pass.png', 2000)
        } else {
            app.showToast('加入邀请失败', '/image/gth.png', 2000)
        }
        setTimeout(function() {
            that.homeUrl()
        }, 2000)
      },'GET','web')
    },
    /*
     * 跳转页面
     */
    homeUrl: function () {
        wx.reLaunch({
            url: '../../../homePage/homePage'
        })
    }
})
