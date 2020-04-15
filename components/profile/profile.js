// components/profile/profile.js
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
    notifications: [],
    showPopup : false, 
    popupTitle : '', 
    popupMsg : '',
    showPopupNegBtn: false,
    popupNegText: '',
    popupType : '',
    popupPosText: wx.getStorageSync('locale').confirm,
    showVideoUploadDueWarning : false
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.getMemberships()
      console.log("showing profile")
     },
    hide: function () { },
    resize: function () { },
  },
  attached: function () {
    const name = wx.getStorageSync('name')
    this.setData({ name: name });
    this.getMemberships()
  },
  /**
   * Component methods
   */
  methods: {
    resetAndHideModal: function(){
      this.setData({
        showPopup: false,
        popupTitle: '',
        popupMsg: '',
        showPopupNegBtn: false,
        popupNegText: '',
        popupType: '',
        popupPosText: this.data.locale.confirm
      })
    },
    onClickPopupPositiveButton: function(){
      if (this.data.popupType === 'buyMembership') {
        wx.navigateTo({
          url: '/pages/coursesList/coursesList?needRegistration=false',
        })
        this.resetAndHideModal();
        return;
      }
      if (this.data.popupType === 'checkinSuccess' || this.data.popupType === 'licensePaySuccess') {
        this.getMemberships()
      }
      this.resetAndHideModal();
    },
    onClickPopupNegativeButton: function () {
      if (this.data.popupType === 'buyMembership'){
        wx.navigateBack({
          delta: 1
        });
        return;
      }
      this.resetAndHideModal();
    },
    updateMembershipLicenseOutTrade: function(outTrade){
      const ctx = this;
      wx.showLoading({})
      wx.request({
        url: urls.getUrl('UPDATE_LICENSE_OUT_TRADE_NUMBER').replace(':id' , this.data.membership.id),
        method: "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        data: { out_trade_no: outTrade},
        success: res => {
          console.log(res.data.data)
          wx.hideLoading()
          ctx.setData({
            popupType: 'licensePaySuccess',
            popupTitle: ctx.data.locale.thankYou,
            popupMsg: ctx.data.locale.licensePaySuccess,
            showPopup: true
          })
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }

      })
    },
    payFee: function(){
      var today = new Date();
      var out_trade_no = "MybUsr" + wx.getStorageSync("user_id") + "Mbr" + this.data.membership.id + "Lc" + today.getMilliseconds();
      const ctx = this;
      wx.showLoading({})
      wx.request({
        url: urls.getUrl('PAY'),
        method: "POST",
        header: {
          Authorization: wx.getStorageSync('token')
        },
        data: { orderCode: out_trade_no, money: 0.01 },
        success: res => {
          const payRes = res.data.data;
          wx.requestPayment({
            timeStamp: payRes.timeStamp,
            nonceStr: payRes.nonceStr,
            package: 'prepay_id=' + payRes.prepayId,
            signType: 'MD5',
            paySign: payRes.paySign,
            success: function (successRes) {
              console.log("successRes")
              console.log(successRes)
              wx.hideLoading()
              ctx.updateMembershipLicenseOutTrade(out_trade_no)
              // ctx.updateOrderStatus(orderNo, out_trade_no)
            },
            fail: function (payErr) {
              console.log("payErr")
              console.log(payErr)
            }
          })
          console.log(res.statusCode)
          wx.hideLoading()
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }

      })
    },
    scanTrainingQR: function(){
      const ctx = this;
      wx.scanCode({
        success(res) {
          var result = res.result;
          try{
            var json = JSON.parse(result)
            const courseId = json.courseId || -1;
            if(courseId === -1){
              ctx.setData({
                popupType: 'invalidQr',
                popupTitle: ctx.data.locale.error,
                popupMsg: ctx.data.locale.invalidQr,
                showPopup : true
              })
              return;
            }
            console.log(ctx.data.membership.course.id)
            console.log(courseId)
            if (courseId != ctx.data.membership.course.id){
              ctx.setData({
                popupType : 'incorrectCourse',
                popupTitle: ctx.data.locale.error,
                popupMsg: ctx.data.locale.incorrectCourseQr,
                showPopup: true
              })
              return
            }
            wx.showLoading();
            wx.request({
              url: urls.getUrl('COURSE_CHECK_IN').replace(":id" , courseId),
              method : 'POST',
              header: {
                Authorization: wx.getStorageSync('token')
              },
              success: function (res) {
                wx.hideLoading()
                ctx.setData({
                  popupType: 'checkinSuccess',
                  popupTitle: ctx.data.locale.success,
                  popupMsg: ctx.data.locale.checkinSucess,
                  showPopup: true
                })
              },
              fail: function (err) {
                console.log(err)
                wx.hideLoading()
              }
            })


          }catch(e){
            console.log(e)
            ctx.setData({
              popupType: 'invalidQr',
              popupTitle: ctx.data.locale.error,
              popupMsg: ctx.data.locale.invalidQr,
              showPopup: true
            })
          } 
        },
        fail(err){
          ctx.setData({
            popupType: 'invalidQr',
            popupTitle: ctx.data.locale.error,
            popupMsg: ctx.data.locale.invalidQr,
            showPopup: true
          })
          console.log(err)
        }
      })
    },
    getMemberships : function(){
      const ctx = this;
      wx.showLoading();
      wx.request({
        url: urls.getUrl('MY_MEMBERSHIP'),
        header: {
          Authorization: wx.getStorageSync('token')
        },
        success : function(res){
          const membership = res.data.data || null;
          if(membership === null){
            wx.hideLoading()
            ctx.setData({
              popupType: 'buyMembership',
              popupTitle: 'Access Denied',
              popupMsg: "You don't have a valid membership. Please buy MYBarre membership to continue",
              showPopupNegBtn: true,
              popupNegText: 'Exit',
              popupPosText: 'Buy Membership',
              showPopup: true
            })
            return;
          }
          const expiry = membership.end || '';
          const expiryDate = new Date(expiry);
          const today = new Date()

          
          if(expiryDate < today){
            ctx.setData({
              popupType: 'buyMembership',
              popupTitle: 'Membership Expired',
              popupMsg: "Your membership has already expired . Please renew your membership before continueing",
              showPopupNegBtn: true,
              popupNegText: 'Exit',
              popupPosText: 'Renew Membership',
              showPopup: true
            })
          }

          const uploadDate = new Date(membership.video_submission_date);
          
          if (uploadDate < today) {
            ctx.setData({ showVideoUploadDueWarning : true})
          }else{
            ctx.setData({ showVideoUploadDueWarning: false })
          }

          


          ctx.setData({
            membership: membership
          })
          wx.setStorageSync('membership_expiry', expiry);
          wx.setStorageSync('membership_id', membership.id);
          console.log("wx.getStorageSync('membership_id')")
          console.log(wx.getStorageSync('membership_id'))
          wx.hideLoading()
        },
        fail : function(err){
          console.log(err)
          wx.hideLoading()
        }
      })
    },
    uploadFiles: function(){
      wx.navigateTo({
        url: '/pages/uploadTrainingVideos/uploadTrainingVideos',
      })
    },
    downoadLicense: function(){
      const ctx = this;
      const url = this.data.membership.certificate_url;
      wx.downloadFile({
        url: url,
        success: function (res) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              wx.hideLoading()
            },
            fail: function (err) {
              console.log(err)
              wx.hideLoading();
              ctx.setData({
                popupType: 'error',
                popupTitle: ctx.data.locale.error,
                popupMsg: ctx.data.locale.saveFailed + ". " + err,
                showPopup: true
              })
            }
          })


          // wx.saveFile({
          //   tempFilePath: filePath,
          //   success: function (res) {
          //     console.log(res)
          //     wx.hideLoading()
          //   },
          //   fail: function (err) {
          //     console.log(err)
          //     wx.hideLoading();
          //     ctx.setData({
          //       popupType: 'error',
          //       popupTitle: ctx.data.locale.error,
          //       popupMsg: ctx.data.locale.saveFailed,
          //       showPopup: true
          //     })
          //   }
          // })
        },
        fail: function (err) {
          wx.hideLoading();
          ctx.setData({
            popupType: 'error',
            popupTitle: ctx.data.locale.error,
            popupMsg: ctx.data.locale.downloadFail,
            showPopup: true
          })
        }
      })
    },
    onClickStatus: function(){
      wx.navigateTo({
        url: '/pages/membershipStatusRoadmap/membershipStatusRoadmap?status=' + this.data.membership.status,
      })
    }
  }
})
