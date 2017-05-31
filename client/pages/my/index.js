// pages/my/index.js
var util = require('../../utils/util.js')
Page({
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      city: "",
      province: "",
      country: ""
    },
    bType: "primary", // 按钮类型
    actionText: "登录", // 按钮文字提示
    lock: false //登录按钮状态，false表示未登录
  },
// 页面加载
  onLoad: function () {
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    // 获取本地数据-用户信息
    wx.getStorage({
      key: 'userInfo',
      // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
      success: (res) => {
        wx.hideLoading();
        this.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName,
            city: res.data.userInfo.city,
            province: res.data.userInfo.province,
            country: res.data.userInfo.country
          },
          bType: res.data.bType,
          actionText: res.data.actionText,
          lock: true
        })
      }
    });
  },
// 登录或退出登录按钮点击事件
  bindAction: function () {
    this.data.lock = !this.data.lock
    // 如果没有登录，登录按钮操作
    if (this.data.lock) {
      wx.showLoading({
        title: "正在登录"
      });
      var that=this;
      wx.login({
        success: (res) => {
          wx.hideLoading();
          wx.getUserInfo({
            withCredentials: false,
            success: (res) => {
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                  city: res.userInfo.city,
                  province: res.userInfo.province,
                  country: res.userInfo.country
                },
                bType: "warn",
                actionText: "退出登录"
              });
              // 存储用户信息到本地
              // wx.setStorage({
              //   key: 'userInfo',
              //   data: {
              //     userInfo: {
              //       avatarUrl: res.userInfo.avatarUrl,
              //       nickName: res.userInfo.nickName,
              //       city: res.userInfo.city,
              //       province: res.userInfo.province,
              //       country: res.userInfo.country
              //     },
              //     bType: "warn",
              //     actionText: "退出登录"
              //   },
              //   success: function (res) {
              //     console.log("存储成功")
              //   }
              // })

              //todo:把用户信息注册到服务器
              var timstamp = Date.parse(new Date());
              if (res.userInfo.nickName) {
                //1.先去登录咯
                wx.request({
                  url: 'https://o2o.daoapp.io/api/Users/login',
                  data: {
                    "username": res.userInfo.nickName,
                    "password": "midea_kjd"
                  },
                  method: 'POST', // POST
                  // header: {}, // 设置请求的 header
                  success: function (loginRes) {
                    // console.log(res.data.userId);
                    // console.log(res.data.id);
                  
                    if (loginRes.data.userId) {
                      wx.setStorage({
                        key: 'userInfo',
                        
                        data: {
                          userInfo: {
                            accessToken: loginRes.data.id,
                            userId: loginRes.data.userId,
                          
                            avatarUrl: that.data.userInfo.avatarUrl,
                            nickName: that.data.userInfo.nickName,
                            city: that.data.userInfo.city,
                            province: that.data.userInfo.province,
                            country: that.data.userInfo.country
                          },
                          bType: "warn",
                          actionText: "退出登录"

                        },
                        success: function (res) {
                          console.log("存储token成功")
                        }
                      })
                    } else {    //2.没能登录成功,就去插入数据
                      wx.request({
                        url: 'https://o2o.daoapp.io/api/Users',
                        data: {
                          "username": res.userInfo.nickName,
                          "email": timstamp + '@qq.com',
                          "password": "midea_kjd"
                        },
                        method: 'POST', // POST
                        // header: {}, // 设置请求的 header
                        success: function (createRes) {
                          console.log(createRes.data.id);
                          wx.setStorage({
                            // key: 'userInfo',
                            // data: {
                            //   userInfo: {
                          
                            //     userId: createRes.data.id
                            //   }

                               key: 'userInfo',
                              data: {
                                userInfo: {
                                  userId: createRes.data.id,
                                  avatarUrl: that.data.userInfo.avatarUrl,
                                  nickName: that.data.userInfo.nickName,
                                  city: that.data.userInfo.city,
                                  province: that.data.userInfo.province,
                                  country: that.data.userInfo.country
                                },
                                bType: "warn",
                                actionText: "退出登录"
                             
                            },
                            success: function (res) {
                              console.log("存储token成功")
                            }
                          })
                          // wx.showToast({
                          //   title: 'nice',
                          //   icon: 'success',
                          //   duration: 2000
                          // })
                        }
                      })
                    }



                  }
                })


              }


            }
          })
        }
      })
      // 如果已经登录，退出登录按钮操作
    } else {
      wx.showModal({
        title: "确认退出?",
        content: "退出后将不能使用o2o",
        success: (res) => {
          if (res.confirm) {
            console.log("确定")
            // 退出登录则移除本地用户信息
            wx.removeStorageSync('userInfo')
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: "primary",
              actionText: "登录"
            })
          } else {
            console.log("cancel")
            this.setData({
              lock: true
            })
          }
        }
      })
    }
  },
// 跳转至钱包
  movetoWallet: function () {
    wx.navigateTo({
      url: '../wallet/index'
    })
  }
})