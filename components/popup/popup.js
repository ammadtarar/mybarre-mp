const locale = wx.getStorageSync('locale')
Component({
  data: {
    locale: wx.getStorageSync('locale')
  },
  options: {
  },
  properties: {
    msg:{
      type: String
    },
    title: {
      type: String
    },
    showNegativeBtn:{
      type : Boolean,
      defaultValue : true
    },
    negativeTitle:{
      type : String,
      value: locale.negativeTitle
    },
    positiveTitle: {
      type: String,
      value: locale.confirm
    }
  },
  attached() {
  },
  methods: {
    onClickNegativeButton(){
      this.triggerEvent('onClickPopupNegativeButton');
    },
    onClickPositiveButton() {
      this.triggerEvent('onClickPopupPositiveButton');
    }
  },
});
