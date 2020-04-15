// components/cart/cart.js
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
    items: [],
    total : 0.00
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.getCart()
    },
    hide: function () { },
    resize: function () { },
  },
  /**
   * Component methods
   */
  methods: {
    order: function(e){
      console.log("order")
      wx.navigateTo({
        url: '/pages/checkout/checkout',
      })
    },
    onClose: function(e){
      this.triggerEvent('onCloseCart');
    },
    increaseItem: function(e){
      const ctx = this;
      wx.showLoading({})
      wx.request({
        url: urls.getUrl('ADD_TO_CART').replace(":id", e.target.id),
        method: "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          console.log(res)
          console.log(res.statusCode)
          wx.hideLoading()
          if (res.statusCode === 411){
            wx.showToast({
              icon: 'none',
              title: ctx.data.locale.outOfStock
            })
          }else{
            wx.showToast({ icon: 'success',})
          }
          ctx.getCart()
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }

      })
    },
    decreaseItem: function (e) {
      const ctx = this;
      wx.showLoading({})
      wx.request({
        url: urls.getUrl('REDUCE_CART_COUNT').replace(":id", e.target.id),
        method : "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          console.log(res.data.data)
          wx.showToast({})
          wx.hideLoading()
          ctx.getCart()
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }
      })

    },
    getCart: function(e){
      const ctx = this;
      wx.request({
        url: urls.getUrl('CART'),
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          console.log(res.data.data)
          var items = res.data.data;
          var total = 0.00;
          items.forEach(function(item){
            total = total + (item.count * item.product.price)
          })
          total = parseFloat(total).toFixed(2)
          ctx.setData({ items: items, total: total})
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
    this.getCart();
  },
})
