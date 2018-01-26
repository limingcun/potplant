//获取首页
import API from '../../../utils/api.js';
import util from '../../../utils/util.js';
const app = getApp()
Page({
  data: {
  	lists: [],
  	totalPage: 0,
  	loadComplete: false,
  	page: 1, //页数
  	isPop: false,
    list: {real_name: '姓名:', sex: '性别:', phone: '电话:', email: '邮箱:', address: '地址:'},
    listArr: [],
    searchArr: ['全部', '未通过', '已通过'],
    searchIndex: 0,
    state: ''
  },
  onLoad: function () {
  	wx.setNavigationBarTitle({title: '申请列表'})
  	this.getApplyList()
  },
  onShow: function() {
  },
  /*
   * 获取列表数据
   */
   getApplyList: function() {
   	var that = this
   	var data = {
      page: this.data.page,
      state: this.data.state
    }
   	app.requestData(API.adminApply, data, (err, res) =>{
      that.setData({
      	totalPage: res.last_page,
      	lists: that.data.lists.concat(res.data)
      })
      if (res.data.length<10) {
        that.setData({
          loadComplete: true
        })
      }
    })
   },
   /**
    * 页面上拉触底事件的处理函数
    */
	onReachBottom: function () {
	    if (this.data.page < this.data.totalPage) {
	      this.data.page = this.data.page + 1
	      this.getApplyList()
	    } else {
	      this.setData({
	        loadComplete: true
	      })
	    }
	},
	/**
     * 切换按钮改变状态
     */
	switchChange: function (e) {
		var that = this
		wx.showModal({
		  title: '更改申请',
		  content: '是否要通过申请，申请通过后无法再更改状态',
		  success: function(res) {
		    if (res.confirm) {
		    	var data = {
		    		id: e.currentTarget.dataset.id
		    	}
		      	app.requestData(API.adminApplyState, data, (err, res) =>{
		      	  	if (res == 'true') {
		      	  		app.showToast('修改成功', '/image/pass.png', 2000)
		      	  	  	that.data.lists[e.currentTarget.dataset.index].apply_state = 1
				  	} else {
				  		app.showToast('修改失败', '/image/gth.png', 2000)
				  		that.data.lists[e.currentTarget.dataset.index].apply_state = 0
				  	}
			      	that.setData({
			      		lists: that.data.lists
			      	})
			  	})
		    } else if (res.cancel) {
		      	that.data.lists[e.currentTarget.dataset.index].apply_state = 0
		      	that.setData({
			      	lists: that.data.lists
			    })
		    }
		  }
		})
	},
	/*
	 * 删除申请列表
	 */
	applyListDel: function(e) {
		var that = this
		wx.showModal({
		  title: '删除列表',
		  content: '是否要删除该申请',
		  success: function(res) {
		    if (res.confirm) {
		    	var id = e.currentTarget.dataset.id
		      	app.requestData(API.adminApply + '/' + id, {}, (err, res) =>{
		      	  	if (res != 'false') {
		              	that.data.lists.splice(e.currentTarget.dataset.index, 1)
		              	that.setData({
		                	lists: that.data.lists
		              	})
		              	app.showToast('删除数据成功','/image/pass.png',2000)
		            } else {
		              	app.showToast('删除数据失败','/image/gth.png',2000)
		            }
			  	}, 'DELETE')
		    }
		  }
		})
	},
	/*
	 * 查看数据
	 */
	showApplyList: function(e) {
		var arr = []
	    var sex = ['保密','男','女']
	    var index = e.currentTarget.dataset.index
	    for(var i in this.data.list) {
	      var obj = {}
	      obj['key'] = this.data.list[i]
	      if(i=='sex') {
	        obj['val'] = sex[this.data.lists[index][i]]
	      } else {
	        obj['val'] = this.data.lists[index][i]
	      }
	      arr.push(obj)
	    }
	    this.setData({
	      isPop: true,
	      listArr: arr
	    })
	},
	/*
	 * 关闭弹窗
	 */
	closePop: function() {
		this.setData({
	      isPop: false
	    })
	},
	/* 
	 * 下拉框数据查找
	 */
	search: function(e) {
		var state = e.detail.value
		var arr = {0: '', 1: 0, 2: 1}
		this.data.state = arr[state]
		this.setData({
			searchIndex: state,
			lists: [],
			page: 1,
			loadComplete: false
		})
		this.getApplyList()
	}
})
