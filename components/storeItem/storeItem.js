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
    showPopup: false
  },

  /**
   * Component methods
   */
  methods: {
    addToCart: function(e){
      wx.navigateTo({
        url: '/pages/productDetail/productDetail?productId=' + this.properties.json.id,
      })
      return
      const ctx = this;
      wx.showLoading({})
      wx.request({
        url: urls.getUrl('ADD_TO_CART').replace(":id" , this.properties.json.id) + "/-1/-1",
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
          wx.hideLoading()
        },
        fail: err => {
          wx.hideLoading()
        }

      })
    }
  }
})
