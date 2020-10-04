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
    total : 0.00,
    isEnglish: true
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      const lang = wx.getStorageSync('lang');
      this.setData({
        isEnglish: lang === 'en' ? true : false
      })
      this.getCart()
    },
    hide: function () { },
    resize: function () { },
  },
  /**
   * Component methods
   */
  methods: {
    goToDetail(e){
      wx.navigateTo({
        url: '/pages/productDetail/productDetail?productId=' + e.currentTarget.id,
      })
    },
    order: function(e){
      wx.navigateTo({
        url: '/pages/checkout/checkout',
      })
    },
    onClose: function(e){
      this.triggerEvent('onCloseCart');
    },
    increaseItem: function(e){
      
      const ctx = this;
      const item = this.getItemById(e.target.id) || null;
      if (item === null) {
        return;
      }
      var url = urls.getUrl('ADD_TO_CART').replace(":id", item.product.id);
      if (item.colorId) {
        url = url + '/' + item.colorId;
      } else {
        url = url + "/-1"
      }

      if (item.sizeId) {
        url = url + '/' + item.sizeId;
      } else {
        url = url + "/-1"
      }
      
      wx.showLoading({})
      wx.request({
        url: url,
        method: "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
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
          wx.hideLoading()
        }

      })
    },
    getItemById(id){
      var obj = null;
      this.data.items.forEach(function(item){
        if (item.id === parseInt(id)){
          obj = item;
        }
      })
      return obj;
    },
    decreaseItem: function (e) {
      const ctx = this;
      const item = this.getItemById(e.target.id) || null;
      if(item === null){
        return;
      }
      var url = urls.getUrl('REDUCE_CART_COUNT').replace(":id", item.product.id);
      if(item.colorId){
        url = url + '/' + item.colorId;
      }else{
        url = url + "/-1"
      }

      if (item.sizeId) {
        url = url + '/' + item.sizeId;
      } else {
        url = url + "/-1"
      }

      wx.showLoading({})
      wx.request({
        url:  url,
        method : "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          wx.showToast({})
          wx.hideLoading()
          ctx.getCart()
        },
        fail: err => {
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
          wx.hideLoading()
        }
      })
    }
  },
  attached: function () {
    this.getCart();
  },
})
