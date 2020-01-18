// pages/landing/landing.js
var app = getApp();

Page({
  data: {
    recieve: ['recieveOne' , 'recieveTwo', 'recieveThree'],
    includes: ['includesOne', 'includesTwo', 'includesThree', 'includesFour', 'includesFive', 'includesSix', 'includesSeven' ],
    locale: wx.getStorageSync('locale')
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '',
    })
  },
  goToRegister: function(e){
    console.log("goToRegister tapped")
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  goToLogin: function (e) {
    console.log("getToLogin tapped")
  },
  getName: function(){
    return "Ammad";
  },
})