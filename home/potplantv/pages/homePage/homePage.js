//获取首页
import API from '../../utils/api.js';
const app = getApp()
Page({
  data: {
    userInfo: {},
    swiper: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      circular: true,
      color: '#fff'
    },
    imgUrls: ['/image/recom1.png', '/image/recom2.png', '/image/recom3.png'],
    navBox: [{
    	img: '/image/nav1.png',
    	text: '微信登录',
    	catchtap: 'wxLogin',
    	class: 'class-nav1'
    },
    {
    	img: '/image/nav2.png',
    	text: '申请使用',
    	catchtap: 'applyFor',
    	class: 'class-nav2'
    },
    {
    	img: '/image/nav3.png',
    	text: '盆栽列表',
    	catchtap: 'showList',
    	class: 'class-nav3'
    },
    {
    	img: '/image/nav4.png',
    	text: '后台管理',
    	catchtap: 'enterAdmin',
    	class: 'class-nav4'
    }],
    addNav: {
    	img: '/image/nav5.png',
    	text: '申请列表',
    	catchtap: 'applyList',
    	class: 'class-nav5'
	  },
    perBox: {
    	4: {
    		ulper: '85%',
    		liper: '24.6%'
    	},
    	5: {
    		ulper: '100%',
    		liper: '19.3%'
    	}
    },
    isLogin: '未登录'
  },
  onLoad: function () {
  	// 判断是否登录
  	var that = this
    wx.showLoading({
        title: '加载中',
        mask: true
    })
  	if(!wx.getStorageSync('openid')) {
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
	                        var userInfo = {}
	                        wx.setStorageSync('openid', openid)
	                        wx.getUserInfo({
                                success: function(res) {
                                	userInfo.avatarUrl = res.userInfo.avatarUrl
                                    userInfo.nickName = res.userInfo.nickName
                                    userInfo.sex = res.userInfo.gender
                                    wx.setStorageSync('userInfo', userInfo)
                                }
                            })
	                   		that.checkLogin(openid)
	                    }
	                })
	            }
	        }
	    })
	} else {
		this.checkLogin(wx.getStorageSync('openid'))
	}
  },
  onShow: function() {
  	wx.setNavigationBarColor({frontColor: '#000000',backgroundColor: 'D1F2E1'})
  },
  /**
   * 判断是否登录
  **/
  checkLogin: function(openid) {
  	var that = this
  	wx.request({
        url: API.webClg,
        method: 'GET',
        data: {
        	openid: openid,
        	st: wx.getStorageSync('st')
        },
        success: function(res) {
            if (res.statusCode == 401 || res.statusCode == 403 || res.statusCode == 402) {
            	var isLogin = '未登录'
            	that.data.navBox[0].text = '微信登录'
            	that.data.navBox[0].catchtap = 'wxLogin'
            	that.navData(res.data)
            } else if(res.statusCode == 400) {
            	that.data.navBox[1].text = '申请使用'
            	that.data.navBox[1].catchtap = 'applyFor'
            	var isLogin = '未登录'
            } else {
            	var isLogin = 'hi,' + res.data.real_name
            	that.data.navBox[0].catchtap = ''
            	that.data.navBox[0].text = '已登录',
            	that.navData(res.data.apply_state)
            	if (res.data.type == 1) {
				    that.data.navBox.push(that.data.addNav)
            	}
            }
            that.setData({
            	isLogin: isLogin,
            	navBox: that.data.navBox
            })
            wx.hideLoading()
        }
    })
  },
  /**
   * 导航栏数据填充
  **/
  navData: function(state) {
  	if(state) {
		this.data.navBox[1].text = '已通过'
	} else {
		this.data.navBox[1].text = '已申请'
	}
	this.data.navBox[1].catchtap = ''
  },
  /**
   ** 微信登录
  **/
  wxLogin: function() {
  	var that = this
  	wx.showLoading({
        title: '微信登录中',
        mask: true
    })
  	wx.request({
        url: API.wxLogin,
        method: 'GET',
        data: {
        	openid: wx.getStorageSync('openid')
        },
        success: function(res) {
            if(res.data == 'false') {
            	app.showToast('请先申请使用', '/image/gth.png', 2000)
            } else if(res.data == 'error') {
            	app.showToast('请等候申请通过', '/image/gth.png', 2000)
            } else {
		        wx.setStorageSync('st', res.data.st)
            	that.data.navBox[0].text = '已登录'
            	that.data.navBox[0].catchtap = ''
            	if (res.data.type == 1) {
            		that.data.navBox.push(that.data.addNav)
            	}
            	var isLogin = 'hi,' + res.data.real_name
            	that.setData({
	            	isLogin: isLogin,
	            	navBox: that.data.navBox
	            })
	            app.showToast('登录成功', '/image/pass.png', 2000)
            }
        }
    })
  },
  /**
   ** 申请使用
  **/
  applyFor: function() {
  	var url = '../apply/applyFor/applyFor'
  	wx.navigateTo({
      url: url
    })
  },
  /**
   ** 盆栽列表
  **/
  showList: function() {
  	var url = '../home/list/list'
  	wx.navigateTo({
      url: url
    })
  },
  /**
   ** 后台管理
  **/
  enterAdmin: function() {
  	if (this.data.isLogin == '未登录') {
  		app.showToast('请先登录', '/image/gth.png', 2000)
  		return false
  	}
  	var url = '../admin/plant/plant'
  	wx.navigateTo({
      url: url
    })
  },
  /**
   ** 申请列表
  **/
  applyList: function() {
    var url = '../apply/applyList/applyList'
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})
