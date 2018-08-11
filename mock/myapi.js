export const API = [{
  URL: '/api/zfirst',
  GET: {
    'success|1': [true, false],
    result: {
      headerData: {
        sitename: "KingP2P演示站api",
      }
    },
    error: '',
  },
}, {
  URL: '/api/znav',
  GET: {
    'success|1': [true, false],
    result: {
      nav: [{
        id: '10',
        // selected : false,
        da: [{
          daid: '1101',
          daname: '家用电器',
        }],
        db: [{
          dbid: '1201',
          dbname: '大家电'
        }, {
          dbid: '1202',
          dbname: '生活电器'
        }],
      }, {
        id: '20',
        // selected : false,
        da: [{
          daid: '2101',
          daname: '手机',
        }, {
          daid: '2102',
          daname: '数码',
        }, {
          daid: '2103',
          daname: '通信',
        }],
        db: [{
          dbid: '2201',
          dbname: '智能设备'
        }, {
          dbid: '2202',
          dbname: '数码配件'
        }],
      }, {
        id: '30',
        // selected : false,
        da: [{
          daid: '3101',
          daname: '电脑、办公',
        }],
        db: [{
          dbid: '3201',
          dbname: '服务产品'
        }, {
          dbid: '3202',
          dbname: '电脑整机'
        }],
      }, {
        id: '40',
        // selected : false,
        da: [{
          daid: '4101',
          daname: '家居、家具、家装、厨具',
        }],
        db: [{
          dbid: '4201',
          dbname: '厨具'
        }, {
          dbid: '4202',
          dbname: '家装建材'
        }],
      }, {
        id: '50',
        // selected : false,
        da: [{
          daid: '5101',
          daname: '男装、女装、内衣',
        }],
        db: [{
          dbid: '5201',
          dbname: '女装'
        }, {
          dbid: '5202',
          dbname: '男装'
        }]
      }, {
        id: '60',
        // selected : false,
        da: [{
          daid: '6101',
          daname: '鞋靴、箱包、钟表、奢侈品',
        }],
        db: [{
          dbid: '6201',
          dbname: '奢侈品'
        }, {
          dbid: '6202',
          dbname: '功能箱包'
        }],
      }, {
        id: '70',
        // selected : false,
        da: [{
          daid: '7101',
          daname: '个人化妆、清洁用品',
        }],
        db: [{
          dbid: '7201',
          dbname: '面部护肤'
        }, {
          dbid: '7202',
          dbname: '洗发护发'
        }]
      }]
    },
    error: '',
  }
}]