
/*
    组件渲染结构：
    .show({
        fold    :false,     //初始折叠状态
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
    })
*/

const defauleData = {
    fold    :false,
    foldNum :-1,
    labels  :[
        {
            name    :'此游戏',
            color   :'rgb(108,132,194)',
        },
        {
            name    :'行业',
            color   :'rgb(242, 190, 86)',  
        },
    ],
    list:[
    ],
    error:  false,      //是否显示为错误状态
    errmsg: '数据源异常',   //异常的提示信息
}

/*
 * 判断JavaScript对象类型的函数
 * @param {}
 */
function is(obj, type) {
	var toString = Object.prototype.toString, undefined;

	return (type === 'Null' && obj === null) ||
		(type === "Undefined" && obj === undefined) ||
		toString.call(obj).slice(8, -1) === type;
}
/*
 * 深拷贝函数
 * @param {Object} oldObj: 被拷贝的对象
 * @param {Object} newObj: 需要拷贝的对象
 * @ return {Object} newObj: 拷贝之后的对象
 */
function deepCopy(oldObj = {}, newObj={}) {
    for (var key in oldObj) {
        var copy = oldObj[key];
        if (oldObj === copy) continue; //如window.window === window，会陷入死循环，需要处理一下
        if (is(copy, "Object")) {
            newObj[key] = deepCopy(copy, newObj[key] || {});
        } else if (is(copy, "Array")) {
            newObj[key] = []
            newObj[key] = deepCopy(copy, newObj[key] || []);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
}

Component({
    properties: {  
        errmsg:{                //异常信息
            type: String,
            value:'',
        },
        foldNum:{               //折叠触发数量 -1 时不开启折叠功能
            type:  Number,
            value : -1,
        },
        foldStatus:{            //折叠按钮开启状态
            type:   Boolean,
            value:  true,
        },
        data0:{                 //非折叠数据项
            type: Array,
            value: [],
        },
        data1:{                 //折叠数据项
            type: Array,
            value : [],
        },
        labels:{                //标签数据项
            type: Array,
            value: [],
        },
        colors:{                //各label对应的color
            type: Array,
            value:[]
        }
    },
    options: {

    },
    behaviors: [],
    methods: {
        show(data){
            let _data = deepCopy(data,defauleData);
            if(_data.error){
                this.err(_data.errmsg);
                return;
            }
            let query = this.createSelectorQuery();
            query.select('#liucharts_line_databox').boundingClientRect()
            query.exec((res)=>{
                try{
                    let dataW_and_perW_and_titleW_and_padding = 25 + 50 + 80 + 5 + 2;
                    let lineWidth = res[0].width - dataW_and_perW_and_titleW_and_padding;
    
                    //页面数据
                    let _renderData = {};
    
                    _renderData.foldStatus = _data.fold;
                    _renderData.foldNum = _data.foldNum;
                    //如果展开数量大于现有数据数量，则展开按钮自动隐藏
                    if(_data.foldNum >= 0 && _data.foldNum >= _data.list.length){
                        _renderData.foldNum = -1;
                    }
    
                    //data0
                    let num = _renderData.foldNum < 0 ? _data.list.length : _renderData.foldNum;
                    let _data0 = [];
                    let i = 0
                    for(;i < num ; i++){
                        _data0.push(
                            this._parseData(
                                _data.list[i],_data.labels.length,lineWidth
                            )
                        )
                    }
                    //data1
                    let _data1 = [];
                    for(;i<_data.list.length;i++){
                        _data1.push(
                            this._parseData(
                                _data.list[i],_data.labels.length,lineWidth
                            )
                        )
                    }
                    _renderData.data0 = _data0;
                    _renderData.data1 = _data1;
    
                    //color & label
                    let _colors = [] , _labels = [];
                    for(let j in _data.labels){
                        let item = _data.labels[j];
                        _colors.push(item.color);
                        _labels.push(item.name);
                    }
                    _renderData.labels = _labels;
                    _renderData.colors = _colors;

                    this.setData(
                        _renderData
                    )
                    // console.log(_renderData)
                }catch(e){
                    // console.log(e)
                    this.err();
                }
            });

        },
        err(str = '数据源异常'){
            this.setData({
                errmsg:str
            })
        },
        _parseData(data,num,maxWidth){
            if(data.data.length != num){
                console.log('LiuCharts - Error : 存在数据项数量与labels数量不一致')
                throw new Error();
            }
            //数据项第一个必须为 0-100 的数值，且必须是正整数，并计算条形图width
            let _data = {
                // title:'',
                // data:[
                //     ...
                // ]
            }
            _data.title = data.title;
            _data.data = [];
            for(let i in data.data){
                let item = data.data[i];
                let _data0 = {}
                if(typeof item[0] != 'number' || item[0] < 0 || item[0] > 100){
                    console.log('LiuCharts - Error : 数据项的第一个元素必须是正整数，且小于等于100的范围')
                    throw new Error();
                }
                _data0.width = parseInt( maxWidth * item[0] / 100) + 2;
                _data0.d0 = item[1];
                _data0.d1 = item[2];
                _data.data.push(_data0);
            }
            
            return _data;
        },
        fold_close(){
            this.setData({
                foldStatus : false
            })
        },
        fold_open(){
            this.setData({
                foldStatus : true
            })
        }
    },
    attached() {
        
    }
});