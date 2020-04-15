// components/ce/ce.js
const urls = require('../../utils/urls.js');
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    tabIndex : 0,
    myBundles : [],
    bundlesGallery: []
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.getUserBundles()
      this.getCeStore()
    },
    hide: function () { },
    resize: function () { },
  },
  /**
   * Component methods
   */
  methods: {
    onTabSelected: function(e){
      this.setData({
        tabIndex: e.detail.tabIndex
      })
    },
    onClickMyBundle: function(e){
      console.log("onClickMyBundle");
      wx.navigateTo({
        url: '/pages/bundleDetail/bundleDetail?type=mybundle&id=' + e.target.id,
      })
    },
    onClickBundle: function(e){
      console.log("onClickBundle")
      wx.navigateTo({
        url: '/pages/bundleDetail/bundleDetail?type=store&id=' + e.target.id,
      })
    },
    getCeStore: function(){
      const ctx = this;
      wx.request({
        url: urls.getUrl('CE_STORE'),
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          ctx.setData({
            bundlesGallery: res.data.data
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }
      })
    },
    getUserBundles: function () {
      const ctx = this;
      wx.request({
        url: urls.getUrl('USER_BUNDLES'),
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          ctx.setData({
            myBundles: res.data.data
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }
      })
    }
  },
  attached: function () { 
    this.setData({
      tabs : [
        this.data.locale.myBundles,
        this.data.locale.bundlesGallery
      ]
    })
    this.getUserBundles()
    this.getCeStore()
  }, 
})
