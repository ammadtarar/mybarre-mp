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
