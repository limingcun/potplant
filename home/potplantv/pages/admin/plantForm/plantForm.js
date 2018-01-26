//index.js
//获取应用实例
import API from '../../../utils/api.js';
const app = getApp()
Page({
  data: {
    userInfo: {},
    imgArr: [],
    inputArr: [],
    formFomat: [{
        name: 'img',
        title: '图片',
        type: 'img'
      },
      {
        name: 'name',
        title: '名称',
        type: 'text',
        placeholder: '必填'
      },
      {
        name: 'intro',
        title: '介绍',
        type: 'textarea',
        placeholder: '必填'
      },
      {
        name: '',
        title: '',
        type: 'custom' //自定义
      }
    ],
    imgStr: '',
    key: 0,
    formInfo: {},
    isEdit: false,
    isEditId: 0,
    bigImg: ''
  },
  onLoad: function (e) {
    if (e.type == 'new') {
      var title = '新建'
      this.data.isEdit = false
    } else {
      var title = '编辑'
      this.data.isEdit = true
      this.data.isEditId = e.id
      this.getEditInfo(e.id)
    }
    wx.setNavigationBarTitle({title: '盆栽' + title})
    this.WxValidate = app.WxValidate({
        name: {
            required: true,
            maxlength: 15
        },
        intro: {
            required: true
        }
    },
    {
        name: {
            required: '请输入盆栽名称',
            maxlength: '名称长度过长'
        },
        intro: {
            required: '请输入盆栽信息'
        }
    })
  },
  /*
   * 插入图片
   */
  addImgFn: function(e) {
    var that = this
    if (this.data.imgArr.length < 3) {
        app.chooseImg(function(res) {
          that.data.imgArr.push(res)
          that.setData({
              'imgArr':that.data.imgArr
          })
        })
    }
  },
  /*
   * 去除图片
   */
  delImgFn: function(e) {
    this.data.imgArr.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgArr: this.data.imgArr,
    })
  },
  /*
   * 自定义属性增加与删除
   */
  operateInput: function(e) {
    var type = e.currentTarget.dataset.type
    if (type == 'add') {
      this.data.inputArr.push(1)
    } else {
      this.data.inputArr.splice(e.currentTarget.dataset.index, 1)
    }
    this.setData({
      inputArr: this.data.inputArr
    })
  },
  /*
   * 保存数据
   */
  formSubmit: function(e) {
    if (this.data.imgArr.length == 0) {
      app.showToast('请上传盆栽图片', '../../../image/gth.png', 2000)
      return false
    }
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
        const error = this.WxValidate.errorList[0]
        app.showToast(error.msg,'../../../image/gth.png',2000)
        return false
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    var that = this
    var form = e.detail.value
    if (this.data.imgArr.length !== 0) {
      for (var i in that.data.imgArr) {
        // 存在图片情况
        if (that.data.imgArr[i].indexOf(app.globalData.https) != -1) {
          var img = that.data.imgArr[i].replace(app.globalData.https, '')
          that.afterChang(img, form)
        } else {
          // 上传图片情况
          app.requestImg(API.adminPlantImg, that.data.imgArr[i], 'img', {}, (err, data) => {
            if (data) {
              that.afterChang(data, form)
            }
          })
        }
      }
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
      var url = API.adminPlant + '/' + this.data.isEditId
      form['_method'] = 'PUT'
    } else {
      var url = API.adminPlant
    }
    app.requestData(url, form, (err, data) =>{
        if (data=='true') {
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
                image: '../../../image/gth.png',
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
    app.requestData(API.adminPlant + '/' + id + '/edit', {}, (err, data) =>{
      var imgArr = data.plant.img.split(',')
      for(var i in imgArr) {
        imgArr[i] = app.globalData.https + imgArr[i]
      }
      this.setData({
        formInfo: data.plant,
        imgArr: imgArr,
        inputArr: data.plant_tab
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
