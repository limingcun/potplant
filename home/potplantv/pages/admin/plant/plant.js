//index.js
//获取应用实例
import API from '../../../utils/api.js';
const app = getApp()
Page({
  data: {
    userInfo: {},
    startDate: '',
    endDate: '',
    maxEnd: '',
    minStart: '',
    imgPic: [],
    plants: [],
    page: 1, //页数
    totalPage: 0, //总数量
    loadComplete: false,
    startDateIp: '/image/time.png',
    endDateIp: '/image/time.png',
    startClass: 'time',
    endClass: 'time'
  },
  //事件处理函数
  bindViewTap: function() {
  },
  onLoad: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({title: '盆栽后台管理'})
    this.timeInit()
    this.initData()
  },
  /**
   ** 初始化数据
   **/
  initData: function() {
    this.setData({
      totalPage: 0,
      imgPic: [],
      plants: [],
      page: 1,
      loadComplete: false
    })
    this.getPlantData()
  },
  /**
   ** 时间初始
   **/
  timeInit: function() {
    this.setData({
      endDate: '',
      endDateIp: '/image/time.png',
      endClass: 'time',
      startDate: '',
      startDateIp: '/image/time.png',
      startClass: 'time'
    })
  },
  /*
   * 时间查询
   */
  bindDateChange: function (e) {
    var date = e.currentTarget.dataset.date
    if (date == 'startDate') {
      this.setData({
        startDate: e.detail.value,
        minStart: e.detail.value,
        startDateIp: '/image/cls.png',
        startClass: 'cls'
      })
    } else {
      this.setData({
        endDate: e.detail.value,
        maxEnd: e.detail.value,
        endDateIp: '/image/cls.png',
        endClass: 'cls'
      })
    }
    this.initData()
  },
  /*
   * 获取盆栽列表数据
   */
  getPlantData: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    // 获取盆栽数据
    var data = {
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      page: this.data.page
    }
    app.requestData(API.adminPlant, data, (err, res) =>{
      if (res.data != undefined) {
        var img = []
        var plantArr = []
        for (var i in res.data) {
          img[i] = app.globalData.https + res.data[i].img.split(',')[0]
        }
        plantArr = res.data
        setTimeout(function(){
          that.setData({
            totalPage: res.last_page,
            imgPic: that.data.imgPic.concat(img),
            plants: that.data.plants.concat(plantArr)
          })
          if (res.data.length<10) {
            that.setData({
              loadComplete: true
            })
          }
          wx.hideLoading()
        },1000)
      } 
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page < this.data.totalPage) {
      this.data.page = this.data.page + 1
      this.getPlantData()
    } else {
      this.setData({
        loadComplete: true
      })
    }
  },
  /**
   ** 清除时间数据
   **/
  clearTime: function (e) {
    if (this.data.startDateIp == '/image/cls.png' && e.currentTarget.dataset.time == 'startDate') {
      this.setData({
        startDate: '',
        startDateIp: '/image/time.png',
        startClass: 'time'
      })
    } else if (this.data.endDateIp == '/image/cls.png' && e.currentTarget.dataset.time == 'endDate') {
      this.setData({
        endDate: '',
        endDateIp: '/image/time.png',
        endClass: 'time'
      })
    }
    this.initData()
  },
  /**
   * 删除列表数据
  **/
  delPlantList: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: e.currentTarget.dataset.name,
      content: '你是否要删除该数据',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '',
            mask: true
          })
          app.requestData(API.adminPlant + '/' + id, {}, (err, res) =>{
            if (res != 'false') {
              that.data.plants.splice(e.currentTarget.dataset.index, 1)
              that.data.imgPic.splice(e.currentTarget.dataset.index, 1)
              that.setData({
                plants: that.data.plants,
                imgPic: that.data.imgPic
              })
              wx.hideLoading()
              app.showToast('删除数据成功','/image/pass.png',2000)
            } else {
              app.showToast('删除数据失败','/image/gth.png',2000)
            }
          },'DELETE')
        }
      }
    })
  },
  /*
   * 打开新建或编辑页面
   */
  openFormPage: function(e) {
    var type = e.currentTarget.dataset.type
    if (type == 'new') {
      var url = '../plantForm/plantForm?type=new'
    } else {
      var url = '../plantForm/plantForm?type=edit&id=' + e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: url
    })
  },
  /*
   * 查看前端
   */
  showIndex: function(e) {
    var id = e.currentTarget.dataset.id
    var url = '/pages/home/index/index?id=' + id
    wx.navigateTo({
      url: url
    })
  },
  /*
   * 显示操作页面
   */
  showList: function(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    var type = e.currentTarget.dataset.type
    var url = '../operate/indexList/indexList?id=' + id + '&name=' + name + '&type=' + type
    wx.navigateTo({
      url: url
    })
  }
})
