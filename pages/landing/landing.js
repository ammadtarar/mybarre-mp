// pages/landing/landing.js
var app = getApp();

Page({
  data: {
    recieve: ['recieveOne' , 'recieveTwo', 'recieveThree'],
    includes: ['includesOne', 'includesTwo', 'includesThree', 'includesFour', 'includesFive', 'includesSix', 'includesSeven' ],
    locale: wx.getStorageSync('locale')
  },
  onLoad: function (options) {
    wx.hideHomeButton();
    wx.setNavigationBarTitle({
      title: 'MYBARRE',
    })
  },
  goToRegister: function(e){
    wx.navigateTo({
      url: '/pages/coursesList/coursesList?needRegistration=true'
    })
  },
  goToLogin: function (e) {
    console.log("getToLogin tapped")
  },
  
})