// pages/uploadTrainingVideos/uploadTrainingVideos.js
const urls = require('../../utils/urls.js');
Page({
  data: {
    locale: wx.getStorageSync('locale'),
    files : [],
    showPopup: false,
    popupTitle: '',
    popupMsg: '',
    showPopupNegBtn: false,
    popupNegText: '',
    popupType: '',
    totalFiles : 0,
    current : 0
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.locale.uploadFilesTitle,
    })
  },
  preview: function(e){
    console.log(e)
    const index = e.currentTarget.id
    if(index < 0){
      return;
    }
    const path = this.data.files[index].file.tempFilePath;
    wx.navigateTo({
      url: '/pages/videoplayer/videoplayer?url=' + path,
    })
    console.log(path)
  },
  removeFile: function(e){
    const index = e.currentTarget.id
    console.log(index)
    if (index < 0) {
      return;
    }
    var existing = this.data.files;
    existing.splice(index , 1);
    this.setData({files : existing})
  },
  selectFile: function(){
    const ctx = this;
    wx.chooseVideo({
      success(res) {
        console.log(res)
        var existing = ctx.data.files;
        existing.push({
          name: '',
          file: res
        })
        ctx.setData({files : existing})
        console.log(ctx.data.files)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onValueUpdated: function(e){
    var ex = this.data.files;
    ex[e.currentTarget.id].name = e.detail.value;
    this.setData({ files: ex })
  },
  uploadFile: function(file){

    return new Promise(function(resolve , reject){
      var url = urls.getUrl('UPLOAD') + "?type=training_videos&membership_id=" + wx.getStorageSync('membership_id') + "&item_name=" + file.name;
      wx.uploadFile({
        header: {
          Authorization: wx.getStorageSync('token')
        },

        url: url,
        filePath: file.file.tempFilePath,
        name: 'file',
        success(res) {
          console.log(res)
          resolve(res)
        },
        fail(err) {
          console.log(err)
          resolve(err)
        }
      })
    })

    
  },
  uploadFiles: function(){
    const ctx = this;
    const files = this.data.files;
    if(files.length <= 0){
      this.setData({
        popupType: 'noFiles',
        popupTitle: this.data.locale.warning,
        popupMsg: this.data.locale.selectFile,
        showPopup: true
      })
      return
    }
    
    this.setData({
      totalFiles : files.length
    })
    wx.showLoading()
    files.forEach(function(fileObj){
       ctx.uploadFile(fileObj)
       .then(function(response){
         ctx.setData({
           current: ctx.data.current + 1
         })
         ctx.showSuccess()
       })
    });
  },
  showSuccess: function(){
    if (this.data.current < this.data.totalFiles){
      return
    }
    wx.hideLoading()
    this.setData({
      popupType: 'success',
      popupTitle: this.data.locale.success,
      popupMsg: this.data.locale.uploadSuccess,
      showPopup: true
    })
  },
  onClickPopupPositiveButton: function () {
    if(this.data.popupType !== 'noFiles'){
      wx.navigateBack({})
    }
    this.setData({
      showPopup: false,
      popupTitle: '',
      popupMsg: '',
      showPopupNegBtn: false,
      popupNegText: '',
      popupType: ''
    })
    
  },
  onClickPopupNegativeButton: function () {

  },
  
})