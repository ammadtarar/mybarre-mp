// pages/productDetail/productDetail.js
const urls = require('../../utils/urls.js');
Page({

  /**
   * Page initial data
   */
  data: {
    productId : -1,
    product: null,
    locale: wx.getStorageSync('locale'),
    colorId : -1,
    sizeId : -1,
    isEnglish : true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const lang = wx.getStorageSync('lang');
    this.setData({
      productId: options.productId,
      isEnglish: lang === 'en' ? true : false
    })
    this.getProductDetails();
  },
  onClickColor(e){
    const colorId = e.currentTarget.id;
    this.setData({
      colorId : colorId
    })
  },
  onClickSize(e){
    const sizeId = e.currentTarget.id;
    this.setData({
      sizeId: sizeId
    })
  },
  addToCart(){
    const ctx = this;
    wx.showLoading({})

    var url = urls.getUrl('ADD_TO_CART').replace(":id", this.data.productId);

    if(this.data.product.colors){
      if(this.data.colorId === -1){
        wx.showToast({
          title: this.data.locale.selectColor,
          icon: 'none'
        })
        return
      }
      url = url + "/" + this.data.colorId
    }else{
      url = url + "/-1" 
    }


    if (this.data.product.sizes) {
      if (this.data.sizeId === -1) {
        wx.showToast({
          title: this.data.locale.selectSize,
          icon: 'none'
        })
        return
      }
      url = url + "/" + this.data.sizeId
    } else {
      url = url + "/-1"
    }


    wx.request({
      url: url,
      method: "POST",
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
  },
  getProductDetails(){
    wx.showLoading()
    const ctx = this;
    wx.request({
      url: urls.getUrl('PRODUCT_BY_ID').replace(":id" , this.data.productId),
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success(res){
        ctx.setData({
          product : res.data.data
        });
        console.log(ctx.data.product)
        wx.hideLoading()
      },
      fail(err){
        console.log(err)
        wx.hideLoading()
      }
    })
  }
})