//index.js
//获取应用实例
import API from '../../../../utils/api.js';
const app = getApp()
Page({
  data: {
    startDate: '',
    endDate: '',
    maxEnd: '',
    minStart: '',
    startDateIp: '../../../../image/time.png',
    endDateIp: '../../../../image/time.png',
    startClass: 'time',
    endClass: 'time',
    operateType: '',
    plant_id: 0,
    operates: [],
    operateImgs: [],
    type: 0,
    bigImg: ''
  },
  onLoad: function (e) {
    if (e.type == 'water') {
      var title = '浇水信息'
      this.data.operateType = 'water'
      this.data.type = 0
    } else if(e.type == 'fertilize'){
      var title = '施肥信息'
      this.data.operateType = 'fertilize'
      this.data.type = 1
    } else {
      var title = '其他信息'
      this.data.operateType = 'other'
      this.data.type = 2
    }
    this.data.plant_id = e.id
    wx.setNavigationBarTitle({title: title})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData()
  },
  /**
   ** 初始化数据
   **/
  initData: function() {
    this.setData({
      totalPage: 0,
      operateImgs: [],
      operates: [],
      page: 1,
      loadComplete: false
    })
    this.getInfoData()
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
  getInfoData: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    // 获取盆栽数据
    var data = {
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      page: this.data.page,
      plant_id: this.data.plant_id,
      type: this.data.type
    }
    app.requestData(API.adminOperate, data, (err, res) =>{
      if (res.data != undefined) {
        var imgArr = []
        var operateArr = []
        operateArr = res.data
        for(var i in res.data) {
          if (res.data[i].img != '' && res.data[i].img != null) {
            imgArr[i] = res.data[i].img.split(',')
          }
        }
        setTimeout(function(){
          that.setData({
            totalPage: res.last_page,
            operates: that.data.operates.concat(operateArr),
            operateImgs: that.data.operateImgs.concat(imgArr)
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
      this.getInfoData()
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
  delOperateList: function(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '删除数据',
      content: '你是否要删除该数据',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '',
            mask: true
          })
          app.requestData(API.adminOperate + '/' + id, {}, (err, res) =>{
            if (res != 'false') {
              that.data.operates.splice(e.currentTarget.dataset.index, 1)
              that.data.operateImgs.splice(e.currentTarget.dataset.index, 1)
              that.setData({
                operates: that.data.operates,
                operateImgs: that.data.operateImgs
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
      var url = '../operateForm/operateForm?type=new&plant_id=' + this.data.plant_id + '&operateType=' + this.data.operateType
    } else {
      var url = '../operateForm/operateForm?type=edit&id=' + e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: url
    })
  },
  /** 
   ** 弹窗图片框
  **/
  changeBig: function(e) {
    var bigImg = app.globalData.https + e.currentTarget.dataset.img
    wx.previewImage({  
      urls: bigImg.split(',')
    })
  }
})
