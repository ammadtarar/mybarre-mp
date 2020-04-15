// components/shop/shop.js
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

  },

  /**
   * Component methods
   */
  methods: {
    getItems: function () {
      const ctx = this;
      wx.showLoading({})
      wx.request({
        url: urls.getUrl('STORE_LIST'),
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          console.log(res)
          const data = res.data.data;
          ctx.setData({ items: data.rows });
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
    this.getItems();
  },
})
