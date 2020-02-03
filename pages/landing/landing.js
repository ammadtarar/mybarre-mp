// pages/landing/landing.js
var app = getApp();

Page({
  data: {
    recieve: ['recieveOne' , 'recieveTwo', 'recieveThree'],
    includes: ['includesOne', 'includesTwo', 'includesThree', 'includesFour', 'includesFive', 'includesSix', 'includesSeven' ],
    locale: wx.getStorageSync('locale'),
    showPricePopup : false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
    })
  },
  goToRegister: function(e){
    this.setData({ showPricePopup : true});
  },
  goToLogin: function (e) {
    console.log("getToLogin tapped")
  },
  onClickPopupNegativeButton: function(){
    this.setData({ showPricePopup: false })
  },
  onClickPopupPositiveButton: function(){
    this.setData({showPricePopup : false})
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
})