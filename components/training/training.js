// components/training/training.js
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
    videos: ['', '', '', '', ''],
    images: ['', '', '', '', ''],
    docs: ['', '', '', '', '']
  },

  /**
   * Component methods
   */
  methods: {
    onMore: function(e){
      var type = e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/moreMedia/moreMedia?type=' + type,
      })
    }
  }
})
