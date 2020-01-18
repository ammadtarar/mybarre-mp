// pages/landing/landing.js
var app = getApp();

Page({
  data: {
    recieve: ['recieveOne' , 'recieveTwo', 'recieveThree'],
    includes: ['includesOne', 'includesTwo', 'includesThree', 'includesFour', 'includesFive', 'includesSix', 'includesSeven' ],
    lang: app.globalData.lang
  },
  onLoad: function (options) {
    
  },
  goToRegister: function(e){
    console.log("goToRegister tapped")
  },
  goToLogin: function (e) {
    console.log("getToLogin tapped")
  },
})