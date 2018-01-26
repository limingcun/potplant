//index.js
//获取应用实例
import API from '../../../utils/api.js';
const util = require('../../../utils/util.js')
const app = getApp()
Page({
  data: {
  	lists: [],
  	listImgs: [],
  	page: 1, //页数
  	totalPage: 0, //总数量
  	loadComplete: false,
  	text: ''
  },
  onLoad: function (e) {
    wx.setNavigationBarTitle({title: '盆栽列表'})
    this.getList()
  },
  /*
   *
   */
   getList: function() {
   	var that = this
   	var data = {
      text: this.data.text,
      page: this.data.page
    }
    app.requestData(API.homeList, data, (err, res) =>{
      var img = []
      for (var i in res.data) {
	      img[i] = app.globalData.https + res.data[i].img.split(',')[0]
	    }
      that.setData({
      	totalPage: res.last_page,
      	lists: that.data.lists.concat(res.data),
      	listImgs: that.data.listImgs.concat(img)
      })
      if (res.data.length<10) {
        that.setData({
          loadComplete: true
        })
      }
    },'GET','home')
   },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page < this.data.totalPage) {
      this.data.page = this.data.page + 1
      this.getList()
    } else {
      this.setData({
        loadComplete: true
      })
    }
  },
  /**
   * 查看详细盆栽信息
   */
  showIndex: function(e) {
  	var id = e.currentTarget.dataset.id
  	var url = '../index/index?id=' + id
  	wx.navigateTo({
      url: url
    })
  },
  /* 
   * 搜索值发生变化触发
   */
  inputChange: function(e) {
  	this.data.text = e.detail.value
  },
  /*
   * 名称查询
   */
  search: function() {
  	this.setData({
  		lists: [],
  		listImgs: [],
  		totalPage: 0,
        page: 1,
        loadComplete: false
  	})
  	this.getList()
  }
})
