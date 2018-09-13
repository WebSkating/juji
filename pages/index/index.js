//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    userLocation: {},
    markers: [],
    includePoints: []
  },
  showFocusList(){
    console.log('showFocusList');
  },
  markertap(e) {
    console.log(e.markerId);
    console.log(e);
    wx.showModal({
      title: '提示',
      content: '您点击了标记id:' + e.markerId + '',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function() {
    let self = this;
    wx.request({
      url: 'https://uney.juniuo.com/index.json',
      success: res => {
        console.log(res);

        if (res.data.errorCode === '0') {
          let arr = [];
          let p1 = new Promise(resolve => {
            let flag = 0;
            let includePointsArr = [];
            res.data.data.forEach(function (item, index) {
              console.log(item);
              includePointsArr.push({ latitude: item.lat, longitude: item.lng })
              let obj = {};
              obj.width = 30;
              obj.height = 30;
              let p2 = new Promise(function (reso) {
                wx.downloadFile({
                  url: item.tenantLogo, //仅为示例，并非真实的资源
                  success: function (res) {
                    console.log(res);
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                      console.log(res);
                      obj.iconPath = res.tempFilePath;
                      reso();
                    }else{
                      // wx.showToast({title:'标记加载错误',icon:'none'});
                      console.log('标记加载错误');
                      obj.iconPath = res.tempFilePath;
                      reso();
                    }
                  }
                });
              })
              
              p2.then(function () {
                flag++;
                // console.log(flag);
                arr.push(obj);
                //判断数组里的地址全部下载完毕才可以resolve
                if (flag === res.data.data.length){
                  resolve();
                }
              });
              obj.id = item.id;
              obj.latitude = item.lat;
              obj.longitude = item.lng;
              obj.tenantId = item.tenantId;
              // obj.label = {};
              // obj.label.content = item.name;
              // obj.label.anchorY = -55;
              // obj.label.anchorX = -30;
              // obj.label.borderRadius = 5;
              // obj.label.padding = 5;
              // obj.label.textAlign = 'center';
              obj.callout = {};
              obj.callout.display = 'ALWAYS';
              obj.callout.borderRadius = 5;
              obj.callout.padding = 5;
              obj.callout.content = item.name;
              obj.tenantName = item.tenantName;
            });
            self.setData({includePoints: includePointsArr});
          });
          p1.then(function(){
            console.log(arr);
            self.setData({
              markers: arr
            })
          })

        }
      },
      fail: function(err) {
        console.log(err);
      }
    });

    wx.getLocation({
      type: 'gcj02',
      success: res => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        // userLocation
        this.setData({
          userLocation: {
            longitude: longitude,
            latitude: latitude
          }
        });
        console.log(this.data.userLocation);
        //控制
      }
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  onReady: function(e) {
    this.mapCtx = wx.createMapContext('myMap');
    //移动到当前定位点
    this.mapCtx.moveToLocation();
  }
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})