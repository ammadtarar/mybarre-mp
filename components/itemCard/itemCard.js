// components/itemCard/itemCard.js
Component({
  /**
   * Component properties
   */
  properties: {
    type : {
      type : String,
      value : 'doc'
    },
    mimeType : {
      type : String,
      value : '--'
    },
    thumb : {
      type : String,
      value : null
    },
    title : {
      type : String,
      value : '--'
    },
    width : {
      type : Number,
      value : 125
    },
    url : {
      type : String,
      value : null
    },
    allowClick : {
      type : Boolean,
      value : true
    }
  },
  data: {
    height : '125px'
  },
  methods: {
    onClick:function(e){
      const ctx = this;
      if (!this.properties.allowClick){
        console.log("cannot click")
        this.triggerEvent('onClickLockedItem');
        return;
      }
      if(this.properties.type === "vid"){
        wx.navigateTo({
          url: '/pages/videoplayer/videoplayer?url=' + this.properties.url,
        })
      }else if(this.properties.type === "img"){
        const ctx = this;
        wx.previewImage({
          urls: [ctx.properties.url],
        })
      }else{
        const ctx = this;
        wx.showLoading();
        wx.downloadFile({
          url: encodeURI(ctx.properties.url),
          success: function (res) {
            const filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
                wx.hideLoading()
              },
              fail: function (openError) {
                wx.hideLoading()
                wx.showModal({
                  title: 'Document Opening Error',
                  content: "URL = " + ctx.properties.url + " . Eror = " + openError.errMsg,
                })
              }
            })
          },
          fail: function(downloadErr){
            wx.hideLoading()
            wx.showModal({
              title: 'Document Download Error ',
              content: "URL = " + ctx.properties.url + " . " +downloadErr.errMsg,
            })
          }
        })
      }
    }
  },
  attached: function () { 
    var width = this.properties.width;
    var height = 1.44 * width;
    this.setData({height : height})
  }, 
  ready: function () {},

})
