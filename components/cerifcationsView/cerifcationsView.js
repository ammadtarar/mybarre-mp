// components/cerifcationsView/cerifcationsView.js
Component({
  properties: {
    title: {
      type: String
    },
    key: {
      type: String
    }
  },
  data: {
    locale: wx.getStorageSync('locale'),
    certificates: [],
    showAddModal : false,
    certificate : {}
  },
  methods: {
    onTextViewUpdated: function (e) {
      const key = e.detail.key;
      const value = e.detail.value;
      var f = 'certificate.' + key;
      this.setData({
        [f]: value
      })
    },
    showModal: function(e){
      this.setData({showAddModal : true})
      this.triggerEvent('onToggleModal', { visible: false });
    },
    hideModal: function(e){
      this.setData({showAddModal : false})
      this.triggerEvent('onToggleModal', { visible: false });
    },
    delCertificate: function(e){
      var index = e.currentTarget.id;
      var certs = this.data.certificates;
      certs.splice(index , 1);
      this.setData({certificates : certs});
    },
    saveCertification: function(e){
      if (Object.keys(this.data.certificate).length < 3){
        return;
      }
      var certs = this.data.certificates;
      certs.push(this.data.certificate);
      this.setData({ certificates : certs , certificate : {} , showAddModal : false})
    }
  }
})
