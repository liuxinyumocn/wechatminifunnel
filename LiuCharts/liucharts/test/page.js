// liucharts/test/page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      {
        fold    :false,     //折叠状态
        foldNum :4,         //当超过 foldNum 时开始折叠，若该参数为 -1 则不开启折叠功能
        list    :[          //每个元素代表 一行 数据
            {
                title   :'广告买量',        //每一个小项标题
                data:[                     //此处元素个数必须与 labels 个数相同
                    [ 0.8 , '60' ,  '，80%' ],                 //每一项由一个三元组构成 分别为  条形长度的百分比 / 数据1 / 数据2 
                    [ 1 , '12' , '，40%' ]                  //（数据之间不与条形长度产生任何关系，需导入时自行计算）
                ]
            },
            {
                ...
            }
        ],
        labels  :[
            {
                name    :'此游戏',
                color   :'#777',            //此处颜色决定 Label 前的圆圈颜色以及 条形 图颜色
            },
            {
                name    :'行业',
                color   :'#777',  
            },
        ]
    }
    */

        //测试项    不同尺寸  不同内容长度测试
        this.selectComponent('#doubleline').show({
            fold    :false,
            foldNum : 4,
            labels  :[
                {
                    name    :'此游戏',
                    color   :'#7283ba',
                },
                {
                    name    :'行业',
                    color   :'#79c1d3',  
                },
            ],
            list:[
                {
                    title:'广告买量',                                 //基本测试项
                    data:[
                        [  20  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },
                {
                    title:'分享',
                    data:[
                        [  0  ,   '0',   '，0%'],                   //极端数据测试项
                        [  100  ,   '100',   '，100%'],
                    ]
                },
                {
                    title:'搜索',
                    data:[
                        [  100  ,   '100',   '，100%'],             //极端数据测试项
                        [  0  ,   '0',   '，0%'],
                    ]
                },
                {
                    title:'任务栏+小程序列表',                          //长title测试项
                    data:[
                        [  100  ,   '100',   '，100%'],
                        [  100  ,   'ccc',   '，aaa'],
                    ]
                },{
                    title:'广告买量',                               //折叠测试项
                    data:[
                        [  20  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },{
                    title:'广告买量',                               //折叠测试项
                    data:[
                        [  20  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },{
                    title:'广告买量',                               //折叠测试项
                    data:[
                        [  20  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },
            ]
        }) //测试项    不同尺寸  不同内容长度测试
        this.selectComponent('#doubleline2').show({
            fold    :false,
            foldNum : 4,
            labels  :[
                {
                    name    :'此游戏1',
                    color   :'#7283ba',
                },
                {
                    name    :'行业1',
                    color   :'#79c1d3',  
                },
            ],
            list:[
                {
                    title:'广告买量',                                 //基本测试项
                    data:[
                        [  23  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },
                {
                    title:'分享',
                    data:[
                        [  10  ,   '0',   '，0%'],                   //极端数据测试项
                        [  100  ,   '100',   '，100%'],
                    ]
                },
                {
                    title:'搜索',
                    data:[
                        [  100  ,   '100',   '，100%'],             //极端数据测试项
                        [  0  ,   '0',   '，0%'],
                    ]
                },
                {
                    title:'任务栏+小程序列表',                          //长title测试项
                    data:[
                        [  100  ,   '100',   '，100%'],
                        [  100  ,   'ccc',   '，aaa'],
                    ]
                },{
                    title:'广告买量',                               //折叠测试项
                    data:[
                        [  20  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },{
                    title:'广告买量',                               //折叠测试项
                    data:[
                        [  20  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },{
                    title:'广告买量',                               //折叠测试项
                    data:[
                        [  20  ,   '20',   '，20%'],
                        [  60  ,   '60',   '，60%'],
                    ]
                },
            ]
        })
  
        this.selectComponent('#funnelchartid').show({
            style:{
                chart:{
                    color:{
                        from:{
                            r:119,
                            g:133,
                            b:182,
                        },
                        to:{
                            r:199,
                            g:206,
                            b:227,
                        }
                    }
                }
            }
        })
        this.selectComponent('#funnelchartid2').show({
            style:{
                chart:{
                    color:{
                        from:{
                            r:50,
                            g:50,
                            b:50,
                        },
                        to:{
                            r:199,
                            g:206,
                            b:227,
                        }
                    }
                }
            }
        })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})