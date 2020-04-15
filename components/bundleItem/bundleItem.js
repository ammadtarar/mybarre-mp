// components/bundleItem/bundleItem.js
Component({
  /**
   * Component properties
   */
  properties: {
    isPurchased : Boolean,
    json : Object
  },

  /**
   * Component initial data
   */
  data: {
    vidCount : 0,
    imgCount : 0,
    docsCount : 0
  },
  attached:function(){
    console.log(this.properties)
  },

  /**
   * Component methods
   */
  methods: {
    
  },
  observers: {
    'json': function (json) {
      var imgs = 0;
      var vids = 0;
      var docs = 0;
      if (json){
        json.files.forEach(function(file){
          if(file.mime.includes("image")){
            imgs = imgs + 1;
          } else if (file.mime.includes("video")) {
            vids = vids + 1;
          } else{
            docs = docs + 1;
          }
        });
        this.setData({
          vidCount : vids,
          imgCount : imgs,
          docsCount : docs
        });
      }
    }
  }
})
