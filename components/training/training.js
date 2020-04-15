// components/training/training.js
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
    videos: ['', '', '', '', ''],
    images: ['', '', '', '', ''],
    docs: ['', '', '', '', '']
  },
  /**
   * Component methods
   */
  methods: {
    onMore: function(e){
      var type = e.currentTarget.id;
      var data = null
      if(type === 'vid'){
        data =  JSON.stringify(this.data.videos);
      } else if (type === 'img') {
        data = JSON.stringify(this.data.images);
      } else {
        data =  JSON.stringify(this.data.docs);
      }
      wx.navigateTo({
        url: '/pages/moreMedia/moreMedia?type=' + type + "&data=" + data,
      })
    },
    getBundles: function(){
      wx.request({
        url: urls.getUrl('BUNDLE_BY_ID').replace(':id', 1),
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success: res => {
          console.log(res)
          const data = res.data.data;
          var images = [];
          var vids = [];
          var docs = [];
          data.files.forEach(function (file) {
            if (file.mime.includes('image') ) {
              images.push(file)
            } else if (file.mime.includes('vid') ) {
              vids.push(file)
            } else {
              docs.push(file)
            }
          });
          this.setData({
            videos: vids,
            images: images,
            docs: docs
          })
        },
        fail: err => {
          console.log(err)
        }

      })
    }
  },
  attached: function () {
    this.getBundles()
  }
})
