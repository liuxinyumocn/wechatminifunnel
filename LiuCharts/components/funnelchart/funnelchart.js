const defauleData = {
    // default:false,   //是否基于默认配置
    width: 'auto',
    chart: {
        col: 1, //使用柱状图的表列 柱状图只允许出现在1个列内，其最大宽度
        data: [ //柱状图的长度百分比
            0.9,
            0.6,
            0.2,
            0.4,
        ],
        sortBy: 'desc', //支持填写 null（不排序） / asc / desc 
    },

    data: {
        header: [
            '',
            'PV',
            '耗时'
        ],
        body: [ //组成表格的数据
            ['启动点击', '300', '9s'],
            ['资源准备完成', '290', '12s'],
            ['代码注入完成', '300', '9s'],
            ['首屏渲染完成', '212', '50s'],
        ],
        tipper: [ //第一维对应每一个行，第二维对应框内每一行文字
            ['启动点击', '300,9s'],
            ['资源准备完成', '300,9s'],
            ['代码注入完成', '300,9s'],
            ['首屏渲染完成', '300,9s'],
        ]
    },

    style: {
        headerColor: '',
        bodyColor: '',
        chart: {
            color: { //请注意不使用排序将不进行颜色阶梯变化
                from: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 255,
                },
                to: {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 255,
                }
            },
            textColor: 'white',
        },
        col: {
            width: [ //宽度接受数值或字符串，数值则为固定的px值，若为字符串则需填写auto，auto为最大宽度剩余均分值（当有多个auto则均分）
                90,
                'auto',
                50,
            ]
        },
        padding: 5, //每一列的左右padding值

    },

    error: false, //是否显示为错误状态
    errmsg: '数据源异常', //异常的提示信息
}

/*
 * 判断JavaScript对象类型的函数
 * @param {}
 */
function is(obj, type) {
    var toString = Object.prototype.toString,
        undefined;

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
function deepCopy(oldObj = {}, newObj = {}) {
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
        errmsg: { //异常信息
            type: String,
            value: '',
        },
        currentData: {
            type: Object,
            value: null
        },
        header: {
            type: Array,
            value: [],
        },
        colWidth: {
            type: Array,
            value: [],
        },
        body: {
            type: Array,
            value: [],
        },
        chart: {
            type: Array,
            value: [],
        },
        chartid: {
            type: Number,
            value: -1,
        },
        color: {
            type: Array,
            value: []
        },
        textColor: {
            type: String,
            value: 'white',
        },
        throttle: {
            type: Object,
            value: {}
        },
        tipper: {
            type: Object,
            value: {
                show: false,
                left: 0,
                top: 0,
                col: -1,
                touchx: 0,
                touchy: 0,
            }
        },
        tipperdata: {
            type: Array,
            value: [],
        }
    },
    options: {

    },
    behaviors: [],
    methods: {
        show(data) {
            if (!this.data.currentData || data.defaule) {
                this.data.currentData = deepCopy(data, defauleData);
            } else {
                this.data.currentData = deepCopy(data, this.data.currentData);
            }
            let _data = this.data.currentData;
            if (_data.error) {
                this.err(_data.errmsg);
                return;
            }

            if (_data.width && typeof _data.width == 'number') { //使用设定最大宽度
                this._parseData(_data.width);
            } else { //使用自动获取的最大宽度
                let query = this.createSelectorQuery();
                query.select('#funnel_charts_box').boundingClientRect();
                query.exec((res) => {
                    let width = res[0].width;
                    this._parseData(width);
                });
            }

        },
        err(str = '数据源异常') {
            this.setData({
                errmsg: str
            })
        },
        _parseData(maxWidth) {
            console.log(this.data.currentData);
            let _data = this.data.currentData;
            let padding = _data.style.padding * 2;

            //各列宽度计算
            let _col = []; {
                let _autoIndex = [];
                let w = 0;
                for (let i = 0; i < _data.style.col.width.length; i++) {
                    let item = _data.style.col.width[i];
                    if (typeof item == 'number') {
                        item += padding;
                        w += item;
                    } else if (typeof item == 'string') {
                        //这里目前仅支持 auto 以后可以支持 %
                        _autoIndex.push(i);
                    }
                    _col.push(item);
                }
                let autoW = (maxWidth - w) / _autoIndex.length;
                for (let j in _autoIndex) {
                    _col[_autoIndex[j]] = autoW;
                }
            }

            //解析Header
            let _header = []; {
                for (let i in _data.data.header) {
                    _header.push({
                        name: _data.data.header[i]
                    })
                }
            }

            //表格
            let _body = []; {
                _body = JSON.parse(JSON.stringify(_data.data.body)); //深拷贝
            }

            //提示信息框
            let _tipperdata = []; {
                //对数据进行预处理补全
                for (let i = 0; i < _data.data.body.length; i++) {
                    let item = _data.data.tipper[i];
                    if (item) {
                        _tipperdata.push(item);
                    } else {
                        _tipperdata.push([]);
                    }
                }
            }

            //柱状图数据
            let _chart = [];
            let _chartid = -1; {

                if (_data.chart.col >= 0 && _data.chart.col < _col.length) {
                    _chartid = _data.chart.col;
                    let _chartMax5 = (_col[_chartid] - padding) / 2;
                    for (let i in _data.chart.data) {
                        let item = _data.chart.data[i];
                        _chart.push(_chartMax5 + _chartMax5 * item);
                    }
                }
            }

            //排序问题
            let sort = true; {
                switch (_data.chart.sortBy) {
                    case 'asc':
                        for (let i = 0; i < _chart.length; i++) {
                            for (let j = i + 1; j < _chart.length; j++) {
                                if (_chart[j] < _chart[i]) {
                                    let m = _chart[i];
                                    _chart[i] = _chart[j];
                                    _chart[j] = m;

                                    m = _body[i];
                                    _body[i] = _body[j];
                                    _body[j] = m;

                                    m = _tipperdata[i];
                                    _tipperdata[i] = _tipperdata[j];
                                    _tipperdata[j] = m;
                                }
                            }
                        }
                        break;
                    case 'desc':
                        for (let i = 0; i < _chart.length; i++) {
                            for (let j = i + 1; j < _chart.length; j++) {
                                if (_chart[j] > _chart[i]) {
                                    let m = _chart[i];
                                    _chart[i] = _chart[j];
                                    _chart[j] = m;

                                    m = _body[i];
                                    _body[i] = _body[j];
                                    _body[j] = m;
                                }
                            }
                        }
                        break;
                    default:
                        sort = true;
                }
            }

            //阶梯颜色问题
            let _color = [];
            let _textcolor = ''; {
                _textcolor = _data.style.chart.textColor;
                let len = _data.data.body.length;
                if (sort) {
                    let from = _data.style.chart.color.from,
                        to = _data.style.chart.color.to;
                    let dr = (to.r - from.r) / len,
                        dg = (to.g - from.g) / len,
                        db = (to.b - from.b) / len,
                        da = (to.a - from.a) / len;
                    let r = from.r,
                        g = from.g,
                        b = from.b,
                        a = from.a;
                    for (let i = 0; i < len; i++) {
                        _color.push(
                            'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
                        );
                        r += dr;
                        g += dg;
                        b += db;
                        a += da;
                    }
                } else {
                    let from = _data.style.chart.color.from;
                    let r = from.r,
                        g = from.g,
                        b = from.b,
                        a = from.a;
                    let c = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                    for (let i = 0; i < len; i++) {
                        _color.push(
                            c
                        );
                    }
                }
            }

            this.setData({
                colWidth: _col,
                header: _header,
                body: _body,
                chart: _chart,
                chartid: _chartid,
                color: _color,
                tipperdata: _tipperdata,
            })
            console.log({
                colWidth: _col,
                header: _header,
                body: _body,
                chart: _chart,
                chartid: _chartid,
                color: _color,
                textColor: _textcolor,
                tipperdata: _tipperdata,
            });
        },
        containerTap(res) {
            this.throttle('containerTap', res, (res) => { //节流
                let { pageX, pageY } = res.changedTouches[0];
                let { offsetLeft, offsetTop } = res.currentTarget;
                let left = pageX - offsetLeft,
                    top = pageY - offsetTop;

                this.data.tipper.touchx = left;
                this.data.tipper.touchy = top;
                this.setTipperPostion(this.data.tipper);
            });
        },
        dataTap(res) {
            this.throttle('dataTap', res, (res) => { //节流
                let col = res.currentTarget.dataset.col;
                this.data.tipper.col = col;
                if (this.data.tipper.show == false) {
                    this.data.tipper.left = -9999;
                    this.data.tipper.top = -9999;
                    this.data.tipper.show = true;
                    this.setData({
                        tipper: this.data.tipper
                    })
                    setTimeout(() => {
                        this.setTipperPostion(this.data.tipper);
                    }, 300)
                }
                setTimeout(() => {
                    this.setTipperPostion(this.data.tipper);
                }, 30)
            });
        },
        containerTapCancel(res) {
            this.data.tipper.show = false;
            this.setData({
                tipper: this.data.tipper
            })
        },
        throttle(key, res, callback = function(res) {}) {
            let now = new Date().getTime();
            let V = this.data.throttle[key];
            if (V) {
                let d = now - V.timestamp;
                if (d < 30) { //30ms
                    return;
                }
            }
            this.data.throttle[key] = {
                timestamp: now
            }
            callback(res);
        },
        setTipperPostion(tipper) {
            let queryBox = this.createSelectorQuery();
            queryBox.select('#funnel_charts_box').boundingClientRect();
            queryBox.exec((res1) => {
                let queryTipper = this.createSelectorQuery();
                queryTipper.select('#funnel_charts_tipper_box').boundingClientRect();
                queryTipper.exec((res2) => {
                    if (res1[0] && res2[0]) {
                        tipper.left = tipper.touchx - res2[0].width;
                        tipper.top = tipper.touchy - res2[0].height;

                        if (tipper.left < 0)
                            tipper.left = 0;
                        if (tipper.top < 0)
                            tipper.top = 0;
                        let maxLeft = res1[0].width - res2[0].width,
                            maxTop = res1[0].height - res2[0].height;
                        if (tipper.left > maxLeft)
                            tipper.left = maxLeft;
                        if (tipper.top > maxTop)
                            tipper.top = maxTop;
                        this.setData({
                            tipper: tipper
                        })
                    }
                });
            });


        }
    },
    attached() {
        this.show({

        })
    }
});