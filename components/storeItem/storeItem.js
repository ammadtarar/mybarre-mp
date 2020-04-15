// components/storeItem/storeItem.js
const urls = require('../../utils/urls.js');
Component({
  /**
   * Component properties
   */
  properties: {
    json: Object
  },

  /**
   * Component initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
  },

  /**
   * Component methods
   */
  methods: {
    addToCart: function(e){
      const ctx = this;
      wx.showLoading({})
      wx.request({
        url: urls.getUrl('ADD_TO_CART').replace(":id" , this.properties.json.id),
        method : "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {

          if (res.statusCode === 411) {
            wx.showToast({
              icon: 'none',
              title: ctx.data.locale.outOfStock
            })
          } else {
            wx.showToast({ icon: 'success', })
          }
          // console.log(res)
          // wx.showToast({})
          wx.hideLoading()
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }

      })
    }
  }
})
