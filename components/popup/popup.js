Component({
  data: {
    
  },
  options: {
  },
  properties: {
    msg:{
      type: String
    },
    title: {
      type: String
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
