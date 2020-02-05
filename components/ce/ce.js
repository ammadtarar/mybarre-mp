// components/ce/ce.js
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
    myBundles : ['' , '' , ''],
    bundlesGallery: ['', '']
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
        url: '/pages/bundleDetail/bundleDetail',
      })
    },
    onClickBundle: function(e){
      console.log("onClickBundle")
      wx.navigateTo({
        url: '/pages/bundleDetail/bundleDetail',
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
  }, 
})
