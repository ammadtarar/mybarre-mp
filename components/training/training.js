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
          var images = [];
          var vids = [];
          var docs = [];
          const course_welcome_doc_url = wx.getStorageSync('course_welcome_doc_url') || null;
          if (course_welcome_doc_url !== null){
            docs.push({
              id : -1,
              name: ctx.data.locale.courseDetails,
              mime : 'application/pdf',
              thumb_url: '',
              url : course_welcome_doc_url
            });
          }
          if(data && data.files){
            data.files.forEach(function (file) {
              if (file.mime.includes('image') ) {
                images.push(file)
              } else if (file.mime.includes('vid') ) {
                vids.push(file)
              } else {
                docs.push(file)
              }
            });
          }
          


          images.sort(function(a, b) {
            return a.index - b.index;
          });
          vids.sort(function(a, b) {
            return a.index - b.index;
          });
          docs.sort(function(a, b) {
            return a.index - b.index;
          });

          ctx.setData({
            videos: vids,
            images: images,
            docs: docs
          })
        },
        fail: err => {

        }

      })
    }
  },
  attached: function () {
    this.setData({
      membership_status: wx.getStorageSync('membership_status')
    })
    this.getBundles()
    console.log("training membership_status = ", this.data.membership_status)
  }
})
