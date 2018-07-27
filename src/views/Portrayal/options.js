export function initOptionCount(_type, _data) {
  const option = {
    color: ['#FF5500', '#FFAA00', '#87D068'],
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '6%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 12,
      },
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
        type: _type,
        symbol: 'none',
        data: _data.enters,
        lineStyle: {
          normal: {
            color: '#FF5500',
          },
        },
      },
      {
        name: '销售总数量',
        type: _type,
        data: _data.sales,
        symbol: 'none',
        lineStyle: {
          normal: {
            color: '#FFAA00',
          },
        },
      },
      {
        name: '库存总数量',
        type: _type,
        symbol: 'none',
        data: _data.storage,
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
export function initOptionAmount(_type, _data) {
  const option = {
    color: ['#FF5500', '#FFAA00', '#87D068'],
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '1%',
      right: '1%',
      bottom: '6%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 12,
      },
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
        name: '进货总金额',
        type: _type,
        symbol: 'none',
        data: _data.enters,
        lineStyle: {
          normal: {
            color: '#FF5500',
          },
        },
      },
      {
        name: '销售总金额',
        type: _type,
        data: _data.sales,
        symbol: 'none',
        lineStyle: {
          normal: {
            color: '#FFAA00',
          },
        },
      },
      {
        name: '库存总金额',
        type: _type,
        symbol: 'none',
        data: _data.storage,
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
export function judgeIndex(value, index) {
  const valueIndex = value ? value[index] : '';
  return valueIndex ? valueIndex.toFixed(2) : 0;
}

export function initOptionRadar(_type, region, single) {
  const option = {
    title: {
      text: '经销商画像',
    },
    tooltip: {},
    legend: {
      data: ['经销商', '平均'],
    },
    radar: {
      indicator: [
        { name: '销售量' },
        { name: '提单量' },
        { name: '进货量' },
        { name: '平均库龄' },
        { name: '周转天数' },
        { name: '库存量' },
      ],
    },
    series: [{
      type: _type,
      data: [
        {
          value: [judgeIndex(single, 'saleQuantity'), judgeIndex(single, 'deliveryQuantity'), judgeIndex(single, 'purchaseQuantity'), judgeIndex(single, 'stockAge'), judgeIndex(single, 'turnoverDays'), judgeIndex(single, 'storageQuantity')],
          name: '经销商',
        }, {
          value: [judgeIndex(region, 'saleQuantity'), judgeIndex(region, 'deliveryQuantity'), judgeIndex(region, 'purchaseQuantity'), judgeIndex(region, 'stockAge'), judgeIndex(region, 'turnoverDays'), judgeIndex(region, 'storageQuantity')],
          name: '平均',
        },
      ],
    }],
  };
  return option;
}
