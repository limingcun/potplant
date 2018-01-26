//index.js
//获取应用实例
import API from '../../../../utils/api.js';
const app = getApp()
Page({
  data: {
    operateType: '',
    plant_id: 0,
    plant_name: '',
    manges: [],
    type: 0,
    openid: wx.getStorageSync('openid')
  },
  onLoad: function (e) {
    this.data.plant_id = e.id
    this.data.plant_name = e.plant_name
    wx.setNavigationBarTitle({title: '盆栽管理人员列表'})
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
      manges: [],
      page: 1,
      loadComplete: false
    })
    this.getInfoData()
  },
  /*
   * 获取管理人员列表数据
   */
  getInfoData: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    // 获取盆栽数据
    var data = {
      page: this.data.page,
      plant_id: this.data.plant_id,
      type: this.data.type
    }
    app.requestData(API.adminMange, data, (err, res) =>{
      if (res.data != undefined) {
        var mangeArr = []
        for(var i in res.data) {
          if (res.data[i].img != '' && res.data[i].img != null) {
            if(res.data[i].img.indexOf('https') == -1) {
              res.data[i].img = app.globalData.https + res.data[i].img
            }
          } else {
            res.data[i].img = '/image/default_head.png'
          }
        }
        mangeArr = res.data
        setTimeout(function(){
          that.setData({
            totalPage: res.last_page,
            manges: that.data.manges.concat(mangeArr)
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
      this.getMangeData()
    } else {
      this.setData({
        loadComplete: true
      })
    }
  },
  /**
   * 删除列表数据
  **/
  delMangeList: function(e) {
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
          app.requestData(API.adminMange + '/' + id, {}, (err, res) =>{
            if (res != 'false') {
              that.data.manges.splice(e.currentTarget.dataset.index, 1)
              that.setData({
                manges: that.data.manges,
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
   * 编辑管理员信息（只能编辑自己）
   */
  openFormPage: function(e) {
    var url = '../mangeForm/mangeForm?id=' + e.currentTarget.dataset.id
    wx.navigateTo({
      url: url
    })
  },
  /*
   * 邀请合作人
   */
  onShareAppMessage: function () {
    var user_name = wx.getStorageSync('userInfo').nickName
    return {
      title: '邀请成为管理合作伙伴',
      desc: user_name + '邀请您成为' + this.data.plant_name + '盆栽管理员!',
      imageUrl: '/image/bg_img.png',
      path: 'pages/admin/operate/invit/invit?id=' + this.data.plant_id
    }
  }
})
