export const API = [{
    URL: '/api/zfirst', // 请注意如果要指明 id 为数字请添加(\\d+)
    GET: {
      'success|1': [true, false],
      result: {
        headerData: {
            sitename: "KingP2P演示站api",
        }
      },
      error: '',
    },
  },
]