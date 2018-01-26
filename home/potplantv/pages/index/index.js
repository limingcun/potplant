//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
  },
  onLoad: function () {
    var that = this
    if(!wx.getStorageSync('userInfo')) {
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                            wx.showLoading({
                                title: '微信授权中',
                                mask: true
                            })
                            that.loginAuthorize()
                        },
                        fail() {
                            wx.navigateTo({
                                url: '../../../pages/loginOrregister/authorize/authorize',
                            })
                        }
                    })
                } else {
                    wx.showLoading({
                        title: '微信授权中',
                        mask: true
                    })
                    that.loginAuthorize()
                }
            }
        })
    } else {
        this.adminUrl()
    }
  },
  loginAuthorize: function () {
        var that = this
        wx.login({
            success: function(res){
                if (res.code) {
                    var objz = {}
                    var l = 'https://pot.find360.cn/get/openid?js_code=' + res.code
                    wx.request({
                        url: l,
                        method: 'GET',
                        success: function(res) {
                            var openid = res.data.openid.openid
                            var token = res.data.token
                            wx.setStorageSync('openid', openid)
                            wx.setStorageSync('token', token)
                            wx.getUserInfo({
                                success: function(res) {
                                    objz.avatarUrl = res.userInfo.avatarUrl
                                    objz.nickName = res.userInfo.nickName
                                    objz.sex = res.userInfo.gender
                                    that.loginUrl(openid, objz, token)
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    loginUrl: function(openid, userInfo, token) {
        var that = this
        wx.request({
            url: 'https://pot.find360.cn/admin/wxlogin',
            data:{
                openid: openid,
                real_name: userInfo.nickName,
                sex: userInfo.sex,
                img: userInfo.avatarUrl,
                _token: token
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: "POST",
            success: function(res) {
                if (res.data !== 500) {
                    userInfo.user_id = res.data.id
                    wx.setStorageSync('userInfo', userInfo)
                    wx.setStorageSync('st', res.data.st)
                    setTimeout(function() {
                        wx.hideLoading()
                        that.adminUrl()
                    },1000)
                }
            }
        })
    },
    adminUrl: function () {
        wx.reLaunch({
            url: '../admin/plant/plant'
        })
    }
})
