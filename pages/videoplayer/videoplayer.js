//获取应用实例
var app = getApp();


Page({
  data: {
    playIndex: null,//用于记录当前播放的视频的索引值
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
  },
  onLoad: function (options){
    const url = options.url;
    this.setData({videoUrl : url});
    this.videoContext = wx.createVideoContext('myvideo', this);
    this.videoContext.requestFullScreen({ direction: 90 });
  },
})