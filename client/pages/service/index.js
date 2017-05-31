// pages/wallet/index.js
Page({
  data:{
    // 故障车周围环境图路径数组
    picUrls: [],
    // 故障车编号和备注
    inputValue: {
      num: 0,
      desc: ""
    },
    scale: 18,
    latitude: 0,
    longitude: 0,
    // 故障类型数组
    checkboxValue: [],
    // 选取图片提示
    actionText: "拍照/相册",
    // 提交按钮的背景色，未勾选类型时无颜色
    btnBgc: "",
    // 复选框的value，此处预定义，然后循环渲染到页面
    itemsValue: [
      {
        checked: false,
        value: "王者农药上分",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "无聊找朋友",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "我就发玩玩",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "我要招人",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "付费跑腿",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "我有东西卖",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "阳山水蜜桃",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "其他服务哦",
        color: "#b9dd08"
      }
    ]
  },
// 页面加载
  onLoad:function(options){
    wx.setNavigationBarTitle({
      title: '服务详情'
    })

    // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    });

  },
// 勾选故障类型，获取类型值存入checkboxValue
  checkboxChange: function(e){
    let _values = e.detail.value;
    if(_values.length == 0){
      this.setData({
        btnBgc: ""
      })
    }else{
      this.setData({
        checkboxValue: _values,
        btnBgc: "#b9dd08"
      })
    }   
  },
// 输入单车编号，存入inputValue
  numberChange: function(e){
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },
// 输入备注，存入inputValue
  descChange: function(e){
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value
      }
    })
  },
// 提交到服务器
  formSubmit: function(e){
    if(this.data.picUrls.length > 0 && this.data.checkboxValue.length> 0){
      wx.request({
        url: 'https://o2o.daoapp.io/api/locations',
        data: {
          // picUrls: this.data.picUrls,
          // inputValue: this.data.inputValue,
          // checkboxValue: this.data.checkboxValue

          "id":this.data.inputValue.num,
          "title": this.data.inputValue.desc,
          "iconPath": "/images/markers.png",
          "latitude": this.data.latitude,
          "longitude": this.data.longitude,
          "width": 45,
          "height": 50
        },
        method: 'POST', // POST
        // header: {}, // 设置请求的 header
        success: function(res){
          wx.showToast({
            title: 'nice',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }else{
      wx.showModal({
        title: "请填写信息",
        content: '看什么看，赶快填信息，削你啊',
        confirmText: "我我我填",
        cancelText: "劳资不填",
        success: (res) => {
          if(res.confirm){
            // 继续填
          }else{
            console.log("back")
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
          }
        }
      })
    }
    
  },
// 选择故障车周围环境图 拍照或选择相册
  bindCamera: function(){
    wx.chooseImage({
      count: 4, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: (res) => {
        let tfps = res.tempFilePaths;
        let _picUrls = this.data.picUrls;
        for(let item of tfps){
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          });
        }
      }
    })
  },
// 删除选择的故障车周围环境图
  delPic: function(e){
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index,1);
    this.setData({
      picUrls: _picUrls
    })
  }
})