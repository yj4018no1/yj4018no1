export function sortArray(array) {
  if(!!array) {
    array.sort(function(a,b){
      return a>b?1:-1
    });
  }
  return array;
};

export function initOptionLine(_type, _data) {
  const option = {
    color: ['#FF5500', '#FFAA00', '#87D068'],
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data:sortArray(_data.months) || [],
      axisLine: {
        lineStyle: {
          width: 2,
          color: '#999',
        },
      },
      axisTick: {
        show: true,
        length: 8,
        lineStyle: {
          color: '#eee',
        },
      },
      axisLabel: {
        margin: 10,
      },
    },
    yAxis: {
      type: 'value',
      nameGap: '20',
    },
    textStyle: {
      fontFamily: 'MicrosoftYaHei',
      fontSize: '12px',
      color: '#999999',
      lineHeight: '12px',
      textAlign: 'left',
    },
    series: [
      {
        name: '进货总数量',
        type: 'line',
        symbol: 'none',
        data: _data.enters || [],
        lineStyle: {
          normal: {
            color: '#FF5500',
          },
        },
      },
      {
        name: '销售总数量',
        type: 'line',
        data: _data.sales || [],
        symbol: 'none',
        lineStyle: {
          normal: {
            color: '#FFAA00',
          },
        },
      },
      {
        name: '库存总数量',
        type: 'line',
        data: _data.storage || [],
        symbol: 'none',
        lineStyle: {
          normal: {
            color: '#87D068',
          },
        },
      },
    ],
  };
  return option;
}

export function initOptionPie(_type, _data) {
  const option = {
    title: {
      text: '库存结构',
      textStyle: {
        color: '#666',
        fontFamily: 'MicrosoftYaHei',
        fontSize: '14px',
      },
      x: 'left',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      top: '20%',
      right: '22%',
      data: _data,
    },
    calculable: true,
    series: [
      {
        name: '库存结构',
        type: _type,
        radius: [40, 160],
        center: ['40%', '50%'],
        roseType: 'radius',
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: true,
          },
        },
        lableLine: {
          normal: {
            show: false,
          },
          emphasis: {
            show: true,
          },
        },
        data: _data,
      },
    ],
  };
  return option;
}
