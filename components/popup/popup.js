Component({
  data: {
    newOffsetTop: 0,
    showModal: false,
  },
  options: {
    multipleSlots: true,
  },
  properties: {
    offsetTop: {
      type: Number,
      observer(newVal) {
        if (newVal > 0) {
          this.setData({
            newOffsetTop: `${newVal}px`,
          });
        }
      },
    },
    msg:{
      type: String
    },
    title: {
      type: String
    }
  },
  attached() {
    console.log('### component modal attached.');
  },
  methods: {
    onClickNegativeButton(){
      console.log("onClickNegativeButton")
      this.triggerEvent('onClickPopupNegativeButton');
    },
    onClickPositiveButton() {
      console.log("onClickPositiveButton")
      this.triggerEvent('onClickPopupPositiveButton');
    }
  },
});
