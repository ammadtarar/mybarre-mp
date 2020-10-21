// pages/moreMedia/moreMedia.js
const urls = require('../../utils/urls.js');

Page({

  /**
   * Page initial data
   */
  data: {
    items: [],
    cols: 2,
    cardWidth : '',
    type : 'vid',
    locale: wx.getStorageSync('locale'),
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    const type = options.type;
    this.setData({ type: type})
    var title = "";
    if(type === "vid"){
      title = this.data.locale.videos;
    } else if (type === "img") {
      title = this.data.locale.images;
    } else if (type === "doc") {
      title = this.data.locale.documents;
    }

    wx.setNavigationBarTitle({
      title: title
    });



    const membership_status = options.membership_status;
    console.log("membership_status = " , membership_status);
    
    

    
    var screenWidth = getApp().screenWidth;
    this.setData({
      cardWidth: (screenWidth / 2) - 20,
      type : type,
      membership_status : membership_status
    });

    this.getBundles();
    
    // const data = options.data;
    // console.log(data);
    
    // var parsed;
    // try {
    //   parsed = JSON.parse(data);
    //   this.setData({ items: parsed })
    // } catch (error) {
    //   console.log(error);
      
    // }
    
  },
  getBundles: function(){
    const ctx = this;
    var url = urls.getUrl('BUNDLE_BY_ID').replace(':id', 1);
    var status = [];
    status.push(this.data.membership_status);
    url = url + "?stage=" + JSON.stringify(status);
    wx.request({
      url: url,
      header: {
        Authorization: wx.getStorageSync('token')
      },
      success: res => {
        const data = res.data.data;
        var items = [];
        if(data && data.files){
          data.files.forEach(function (file) {
            if(ctx.data.type == 'vid' && file.mime.includes('vid')){
              items.push(file);
            }else if(ctx.data.type == 'img' && file.mime.includes('image')){
              items.push(file);
            }else if(ctx.data.type == 'doc' && !file.mime.includes('vid') && !file.mime.includes('image')){
              items.push(file)
            }
          });
        }
        items.sort(function(a, b) {
          return a.index - b.index;
        });

        console.log(items);
        
        ctx.setData({
          items: items
        });
      },
      fail: err => {
        console.log("error");
        console.log(err);
        
      }

    })
  }
})