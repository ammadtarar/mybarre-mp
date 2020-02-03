// pages/register/register.js
Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    stage : 1,
    form : [],
    sectionTitle: "",
    sectionDescription : "",
    min: 0,
    max: 2000,
    showingCertificateModal: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.locale.signUp,
    })
    this.setData({
      genderValues: [{ key: this.data.locale.male, value: 'male' }, { key: this.data.locale.female, value: 'female' }],
      languageValues: [{ key: this.data.locale.english, value: 'en' }, { key: this.data.locale.mandarin, value: 'zh' }],
      yesNoValues: [{key: this.data.locale.yes , value: 'y'} , {key: this.data.locale.no , value: 'n'}]
    })
    this.processSectionTitleAndDescription();
  },
  inputs: function (e) {
    var id = e.currentTarget.id;
    var value = e.detail.value;
    var f = 'form.' + id;
    this.setData({
      [f]: value
    })
    console.log(this.data.form)
  },
  onToggleCertificateModal: function(e){
    console.log("onToggleCertificateModal")
    console.log(e.detail)
    this.setData({ showingCertificateModal: e.detail.visible })
    console.log(this.data.showingCertificateModal)
  },
  next: function(e){
    var stage = this.data.stage;
    if(stage === 5){
      stage = 1;
    }else{
      stage = stage+1;
    }
    this.setData({stage : stage})
    this.processSectionTitleAndDescription();
  },
  onTextViewUpdated: function(e){
    const key = e.detail.key;
    const value = e.detail.value;
    var f = 'form.' + key ;    
    this.setData({
      [f] : value
    })
    console.log(this.data.form);
  },
  onSingleOptionViewUpdated: function(e){
    const key = e.detail.key;
    const value = e.detail.value;
    var f = 'form.' + key;
    console.log(f);
    this.setData({
      [f]: value
    })
    console.log(this.data.form);
  },
  onClickSectionBack: function(e){
    console.log("onClickSectionBack");

    var stage = this.data.stage;
    if (stage <= 1) {
      stage = 1;
    } else {
      stage = stage - 1;
    }
    this.setData({ stage: stage })
    this.processSectionTitleAndDescription();

  },
  processSectionTitleAndDescription: function(){
    const stage = this.data.stage;
    var title = "";
    var desc = "";
    switch(stage){
      case 1:
        title = "regStageOneTitle";
        desc = "regStageOneDesc";
      break;
      case 2:
        title = "regStageTwoTitle";
        desc = "regStageTwoDesc";
        break;
      case 3:
        title = "regStageThreeTitle";
        desc = "regStageThreeDesc";
        break;
      case 4:
        title = "regStageFourTitle";
        desc = "regStageFourDesc";
        break;
      case 5:
        title = "t&cTitle";
        desc = "t&cDesc";
        break;
    }
    this.setData({
      sectionTitle: this.data.locale[title],
      sectionDescription: this.data.locale[desc],
    })
  }
})