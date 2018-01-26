//index.js
//获取应用实例
import API from '../../../../utils/api.js';
import util from '../../../../utils/util.js';
const app = getApp()
Page({
  data: {
    imgArr: [],
    formFomat: [{
        name: 'img',
        title: '图片',
        type: 'img'
      },
      {
        name: 'datetime',
        title: '时间',
        type: 'date',
        placeholder: ''
      },
      {
        name: 'info',
        title: '信息',
        type: 'textarea',
        placeholder: '必填'
      }
    ],
    imgStr: '',
    key: 0,
    formInfo: {},
    isEdit: false,
    isEditId: 0,
    subDate: '',
    subTime: '',
    plant_id: 0,
    type: 0,
    bigImg: ''
  },
  onLoad: function (e) {
    if (e.type == 'new') {
      var title = '新建'
      this.data.isEdit = false
      this.data.plant_id = e.plant_id
      if (e.operateType == 'water') {
        var oper = '浇水操作'
        this.data.type = 0
      } else if (e.operateType == 'fertilize') {
        var oper = '施肥操作'
        this.data.type = 1
      } else {
        var oper = '其他操作'
        this.data.type = 2
      }
    } else {
      var title = '编辑'
      var oper = ''
      this.data.isEdit = true
      this.data.isEditId = e.id
      this.getEditInfo(e.id)
    }
    // 获取当前的日期和时间
    this.getDatetime()
    wx.setNavigationBarTitle({title: '盆栽' + oper + title})
    this.WxValidate = app.WxValidate({
        info: {
            required: true
        }
    },
    {
        info: {
            required: '请输入数据信息'
        }
    })
  },
  /*
   * 插入图片
   */
  addImgFn: function(e) {
    var that = this
    if (that.data.imgArr.length < 3) {
        app.chooseImg(function(res) {
          that.data.imgArr.push(res)
          that.setData({
              'imgArr':that.data.imgArr
          })
        })
    }
  },
  /*
   * 初始化获取小时和分钟
   */
  getDatetime: function() {
    this.setData({
      subDate: util.formatDate(7),
      subTime: util.formatDate(8)
    })
  },
  /*
   * 获取小时和分钟(改变值)
   */
  bindTimeChange: function(e) {
    if (e.currentTarget.dataset.type=='date') {
      this.setData({
        subDate: e.detail.value
      })
    } else {
      this.setData({
        subTime: e.detail.value
      })
    }
  },
  /*
   * 保存数据
   */
  formSubmit: function(e) {
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
        const error = this.WxValidate.errorList[0]
        app.showToast(error.msg,'/image/gth.png',2000)
        return false
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    var that = this
    var form = e.detail.value
    form['datetime'] = this.data.subDate + ' ' + this.data.subTime
    if (this.data.imgArr.length !== 0) {
      for (var i in that.data.imgArr) {
        // 存在图片情况
        if (that.data.imgArr[i].indexOf(app.globalData.https) != -1) {
          var img = that.data.imgArr[i].replace(app.globalData.https, '')
          that.afterChang(img, form)
        } else {
          // 上传图片情况
          app.requestImg(API.adminOperateImg, that.data.imgArr[i], 'img', {}, (err, data) => {
            if (data) {
              that.afterChang(data, form)
            }
          })
        }
      }
    } else {
      this.textSubmit(form)
    }
  },
  /*
   * 后续操作处理
   * res图片拼接值， form表单上传值
   */
  afterChang: function(res, form) {
    this.data.key++
    if (this.data.imgStr !== '') {
        this.data.imgStr += ',' + res
    } else {
        this.data.imgStr += res
    }
    if (this.data.key == this.data.imgArr.length) {
        form['img'] = this.data.imgStr
        this.textSubmit(form)
    }
  },
  /**
   ** 上传提交form表单上传值
  **/
  textSubmit: function(form) {
    if(this.data.isEdit) {
      var url = API.adminOperate + '/' + this.data.isEditId
      form['_method'] = 'PUT'
    } else {
      var url = API.adminOperate
      form['plant_id'] = this.data.plant_id
      form['type'] = this.data.type
    }
    app.requestData(url, form, (err, data) =>{
        if (data=="true") {
            wx.hideLoading()
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration:2000,
                success: function(){
                    var timer = setTimeout(() =>{
                        wx.navigateBack({
                            delta: 1
                        })
                        clearTimeout(timer)
                    }, 2000)
                }
            })  
        } else {
            wx.showToast({
                title: '提交失败',
                image: '/image/gth.png',
                duration:2000,
                success: function() {
                    var timer = setTimeout(() =>{
                        wx.navigateBack({
                        delta: 1
                    })
                    clearTimeout(timer)
                    }, 2000)
                }
            })  
        }
    }, 'POST')
  },
  /**
   ** 获取编辑数据
  **/
  getEditInfo: function(id) {
    app.requestData(API.adminOperate + '/' + id + '/edit', {}, (err, data) =>{
      var datetimeArr = data.datetime.split(' ')
      var imgArr = data.img.split(',')
      for(var i in imgArr) {
        imgArr[i] = app.globalData.https + imgArr[i]
      }
      this.setData({
        formInfo: data,
        imgArr: imgArr,
        subDate: datetimeArr[0],
        subTime: datetimeArr[1].substring(0,5)
      })
    })
  },
  /** 
   ** 弹窗图片框
  **/
  changeBig: function(e) {
    var bigImg = e.currentTarget.dataset.img
    wx.previewImage({  
      urls: bigImg.split(',')
    })
  }
})
