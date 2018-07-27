import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, Card, Form, Row, Col, Input, Button, Select, DatePicker, Icon, Popover, Pagination } from 'antd';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import { formatPrice, formatCount } from 'store/util';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import _ from 'lodash';
import { getBranch, queryCompanies, getBrands, getGoodsGroup, queryGoodsSeries, queryGoodsChannel, getSummaryChannel, querySmallChannel, getUnitTypes, getGoodsTypes } from 'store/tags';
import * as container from './containers';

const Option = Select.Option;
const FormItem = Form.Item;
const FILTERS = {
  0: '正 品',
  1: '样 品',
  2: '不良品',
  3: '礼 品',
  4: '活 动',
};
const content = (
  <div className="ant-table ant-table-small ant-table-bordered ant-table-scroll-position-left">
    <div className="ant-table-title">
      注：如果客户在中午12点之前没有上传昨天完整的库存，BVS会根据最近一天上传完整库存加减这几天的进销数据得出计算库存，之后BVS将不会再采用从ES上传的该天的库存。
    </div>
    <div className="ant-table-content">
      <div className="">
        <span>
          <div className="ant-table-body">
            <table className="">
              <colgroup>
                <col />
                <col />
                <col />
              </colgroup>
              <tbody className="ant-table-tbody">
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="" rowSpan="7">
                    <span className="ant-table-row-indent indent-level-0" style={{ paddingleft: 0 }} />
                    <span>历史库存明细</span>
                  </td>
                  <td className="column-money">供价（元）</td>
                  <td className="">取自BCC的标准供价金额。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">库存数量（台）</td>
                  <td className="">该经销商下仓库对应的商品和对应商品类型在查询日期的账目总数量。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">库存金额（万元）</td>
                  <td className="">该经销商下仓库对应的商品和对应商品类型在查询日期的账目总数量。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">正库存数量（台）</td>
                  <td className="">该经销商下仓库对应的商品和对应商品类型在查询日期的账目库存为正数的台数。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">正库存金额（万元）</td>
                  <td className="">该经销商下仓库对应的商品和对应商品类型在查询日期的账目库存为正数的金额。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">负库存数量（台）</td>
                  <td className="">该经销商下仓库对应的商品和对应商品类型在查询日期的账目库存为负数的台数。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">负库存金额（万元）</td>
                  <td className="">该经销商下仓库对应的商品和对应商品类型在查询日期的账目库存为负数的金额。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </span>
      </div>
    </div>
  </div>
);

const columns = [
  {
    title: '分中心',
    dataIndex: 'branchName',
    fixed: 'left',
    width: 100,
    render: text => text,
  }, {
    title: '小 微',
    fixed: 'left',
    width: 100,
    dataIndex: 'companyName',
    render: text => text,
  }, {
    title: '品 牌',
    dataIndex: 'brandName',
    render: text => text,
  }, {
    title: '产品组',
    dataIndex: 'goodsGroup',
    render: text => text,
  }, {
    title: '产品系列',
    dataIndex: 'goodsSeries',
    render: text => text,
  }, {
    title: '商品编码',
    dataIndex: 'goodsCode',
    render: text => text,
  }, {
    title: '商品名称',
    dataIndex: 'goodsName',
    render: text => text,
  }, {
    title: '供 价(元)',
    dataIndex: 'price',
    render: text => formatPrice(text, 1, 2),
  }, {
    title: '库存数量(台)',
    dataIndex: 'quantity',
    render: text => formatCount(text),
  }, {
    title: '库存金额(万元)',
    dataIndex: 'fee',
    render: text => formatPrice(text, 10000, 2),
  }, {
    title: '正库存数量(台)',
    dataIndex: 'positiveQuantity',
    render: text => formatCount(text),
  }, {
    title: '正库存金额(万元)',
    dataIndex: 'positiveFee',
    render: text => formatPrice(text, 10000, 2),
  }, {
    title: '负库存数量(台)',
    dataIndex: 'negativeQuantity',
    render: text => formatCount(text),
  }, {
    title: '负库存金额(万元)',
    dataIndex: 'negativeFee',
    render: text => formatPrice(text, 10000, 2),
  }, {
    title: '仓库名称',
    dataIndex: 'stockName',
    render: text => text,
  }, {
    title: '库存类型',
    dataIndex: 'stockType',
    render: text => FILTERS[text] || 0,
  }, {
    title: '送达方编码',
    dataIndex: 'receiverCode',
    render: text => text,
  }, {
    title: '送达方名称',
    dataIndex: 'receiverName',
    render: text => text,
  }, {
    title: '大渠道',
    dataIndex: 'dqdChannel',
    render: text => text,
  }, {
    title: '汇总渠道',
    dataIndex: 'hzChannel',
    render: text => text,
  }, {
    title: '小渠道',
    dataIndex: 'xqdChannel',
    render: text => text,
  }, {
    title: '经销商编码',
    dataIndex: 'dealerCode',
    render: text => text,
  }, {
    title: '经销商编码名称',
    dataIndex: 'dealerName',
    render: text => text,
  },
];

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

class SalesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
      },
      serieShow: true,
      expand: false,
    };
    // 表单提交
    this.handleSubmit = this.handleSubmit.bind(this);
    // 重置表单
    this.handleReset = this.handleReset.bind(this);
    // 表单导出前的校验
    this.check = this.check.bind(this);
    // 获取源品牌下拉框的所有选项
    this.handleBrandFocus = this.handleBrandFocus.bind(this);
    // 往来单位类型
    this.handleUnitTypeslFocus = this.handleUnitTypeslFocus.bind(this);
    // 商品类型
    this.handleGoodsAttrFocus = this.handleGoodsAttrFocus.bind(this);
    // 获取产品组下拉框的所有选项
    this.handleGroupFocus = this.handleGroupFocus.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    // 获取大渠道下拉事件
    this.handleGoodsChannelFocus = this.handleGoodsChannelFocus.bind(this);
    // 汇总渠道改变更新小渠道
    this.handleSummaryChannelChange = this.handleSummaryChannelChange.bind(this);
    // 获取分中心下拉框的所有选项
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    // 改变小微下拉框的状态
    this.changeState = this.changeState.bind(this);
    this.toggle = this.toggle.bind(this);
    // 分页事件
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleTablePageSizeChange = this.handleTablePageSizeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { inventorys } = nextProps;
    if (inventorys.data.length > 0) {
      if (!_.isEqual(_.last(inventorys.data), inventorys.summary)) {
        inventorys.data.push(inventorys.summary);
      }
    }
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({ show: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, query, queryInventorySummary } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { goodsGroupId, stockedAt } = fieldsValues;
    const { pagination } = this.state;
    delete fieldsValues.stockedAt;
    delete fieldsValues.goodsGroupId;
    this.setState({
      pagination: {
        showTotal: total => `一共 ${total} 条`,
        current: 1,
        pageSize: 10,
      },
      expand: true,
    });
    const params = {
      ...fieldsValues,
      ...pagination,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      stockedAt: moment(stockedAt).format('YYYY-MM-DD'),
    };

    query(params);
    queryInventorySummary(params);
  }
  check() {
    const fieldsValues = this.props.form.getFieldsValue();
    const { stockedAt } = fieldsValues;
    delete fieldsValues.stockedAt;
    const values = {
      ...fieldsValues,
      stockedAt: moment(stockedAt).format('YYYY-MM-DD'),
    };
    return values;
  }

  // 分页事件
  handleTableChange(current) {
    const { pageSize } = this.state.pagination;
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { goodsGroupId, stockedAt } = fieldsValues;
    const { pagination } = this.state;
    delete fieldsValues.stockedAt;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      ...pagination,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      stockedAt: moment(stockedAt).format('YYYY-MM-DD'),
    };
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
      },
    });
    values.pageNo = current;
    values.pageSize = pageSize;
    query(values);
  }
  handleTablePageSizeChange(current, pageSize) {
    this.setState({
      pagination: { ...this.state.pagination, pageSize },
    }, () => this.handleTableChange(1));
  }
  // 获取源品牌下拉框的所有选项
  handleBrandFocus() {
    const { tags, queryBrands } = this.props;
    queryBrands();
  }
  // 商品类型获取
  handleGoodsAttrFocus() {
    const { tags, queryGoodsTypes } = this.props;
    const { goodsTypes } = tags;
    // if (goodsTypes && !goodsTypes.data.length) {
    queryGoodsTypes();
    // }
  }
  // 往来单位类型
  handleUnitTypeslFocus() {
    const { tags, queryUnitTypes } = this.props;
    const { unitTypes } = tags;
    // if (unitTypes && !unitTypes.data.length) {
    queryUnitTypes();
    // }
  }
  // 获取产品组下拉框的所有选项
  handleGroupFocus() {
    const { getGroup, tags } = this.props;
    const { goodsGroup } = tags;
    getGroup();
  }
  handleGroupChange(ids) {
    const groupIDS = ids.join(',');
    const { getSeries, form } = this.props;
    this.setState({ serieShow: !groupIDS });
    form.resetFields(['goodsSeriesId']);
    getSeries(groupIDS);
  }
  // 大渠道
  handleGoodsChannelFocus() {
    const { getChannel, tags } = this.props;
    const { goodsChannel } = tags;
    // if (goodsChannel && !goodsChannel.data.length) {
    getChannel();
    // }
  }
  handleGoodsChannelChange(value) {
    const { querySummaryChannel, form } = this.props;
    form.resetFields(['secondChannel', 'hzChannelCode']);
    querySummaryChannel(value);
  }
  // 汇总渠道改变更新小渠道的值
  handleSummaryChannelChange(value) {
    const { getSmallChannel, form } = this.props;
    form.resetFields(['xqdChannelCode']);
    getSmallChannel(value);
  }
  // 获取分中心下拉框的所有选项
  handleBranchFocus() {
    const { tags, getBranches } = this.props;
    const { branchs } = tags;
    // if (branchs && !branchs.data.length) {
    getBranches();
    // }
  }
  // 改变小微下拉框的状态
  changeState(value) {
    const { getCompany, form } = this.props;
    form.resetFields(['companyCode']);
    getCompany(value);
  }

  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  }

  render() {
    const { inventorys, tags, form } = this.props;
    const {
      branchs, companies, brands, goodsGroup,
      goodsChannel, summaryChannel, smallChannel, goodsSeries,
    } = tags;
    const { pagination, expand, serieShow } = this.state;
    const { getFieldDecorator } = form;
    pagination.total = inventorys.total;
    const initDate = moment().subtract(moment('13:30', 'HH:mm').isBefore(new Date()) ? 1 : 2, 'days');
    return (
      <div>
        <Card loading={false}>
          <Form horizontal onSubmit={this.handleSubmit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="分中心"
                    {...formItemLayout}
                  >
                    { getFieldDecorator('branchCode', {
                      onChange: value => this.changeState(value),
                    })(
                      <Select
                        onFocus={this.handleBranchFocus}
                        placeholder="请选择分中心"
                      >
                        {
                          branchs.data.map(branch =>
                            <Option key={branch.key} value={branch.key}>{branch.value}</Option>)
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="小 微"
                    {...formItemLayout}
                  >
                    { getFieldDecorator('companyCode')(
                      <Select
                        disabled={!form.getFieldValue('branchCode')}
                        dropdownMatchSelectWidth={false}
                        placeholder="请选择小微"
                      >
                        {companies.data.map(company =>
                          <Option key={company.key} value={company.key}>{company.value}</Option>)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="经销商编码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('dealerCode')(
                        <Input
                          type="text"
                          placeholder="请输入经销商编码"
                        />)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="经销商名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('dealerName')(
                        <Input
                          type="text"
                          placeholder="请输入经销商名称"
                        />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="品 牌"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('originBrandId')(
                        <Select
                          onFocus={this.handleBrandFocus}
                          placeholder="请选择品牌"
                        >
                          {
                            brands.data.map(brand =>
                              <Option key={brand.key} value={brand.key}>{brand.value}</Option>)
                          }
                        </Select>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="产品组"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('goodsGroupId', {
                        onChange: ids => this.handleGroupChange(ids),
                      })(
                        <Select
                          multiple
                          placeholder="请选择产品组"
                          onFocus={this.handleGroupFocus}
                        >
                          {
                            goodsGroup.data.map(group =>
                              <Option key={`${group.key}_${group.value}`} value={group.key}>{group.value}</Option>)
                          }
                        </Select>)}
                  </FormItem>
                </Col>
                <Col sm={6} >
                  <FormItem
                    label="产品系列"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('goodsSeriesId')(
                        <Select
                          disabled={serieShow}
                          placeholder="请选择产品系列"
                        >
                          {
                            goodsSeries.data.map(serie =>
                              <Option key={`${serie.key}_${serie.value}`} value={serie.key}>{serie.value}</Option>)
                          }
                        </Select>)
                    }
                  </FormItem>
                </Col>
                <Col sm={6} >
                  <FormItem
                    label="库存类型"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('stockType')(
                        <Select
                          placeholder="请选择库存类型"
                        >
                          <Option key="all" value={undefined}>全部</Option>
                          <Option key="normal" value="0">正 品</Option>
                          <Option key="model" value="1">样 品</Option>
                          <Option key="bad" value="2">不良品</Option>
                          <Option key="gift" value="3">礼 品</Option>
                        </Select>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="大渠道"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('dqdChannelCode', {
                        onChange: value => this.handleGoodsChannelChange(value),
                      })(
                        <Select
                          onFocus={this.handleGoodsChannelFocus}
                          placeholder="请选择大渠道"
                        >
                          {
                            goodsChannel.data.map(brand =>
                              <Option key={brand.key} value={brand.key}>{brand.value}</Option>)
                          }
                        </Select>)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="汇总渠道"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('hzChannelCode', {
                        onChange: value => this.handleSummaryChannelChange(value),
                      })(
                        <Select
                          disabled={!form.getFieldValue('dqdChannelCode')}
                          placeholder="请选择汇总渠道"
                        >
                          {
                            summaryChannel.data.map(group =>
                              <Option key={`${group.key}_${group.value}`} value={group.key}>{group.value}</Option>)
                          }
                        </Select>)}
                  </FormItem>
                </Col>
                <Col sm={6} >
                  <FormItem
                    label="小渠道"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('xqdChannelCode')(
                        <Select
                          disabled={!form.getFieldValue('hzChannelCode')}
                          placeholder="请选择小渠道"
                        >
                          {
                            smallChannel.data.map(serie =>
                              <Option key={`${serie.key}_${serie.value}`} value={serie.key}>{serie.value}</Option>)
                          }
                        </Select>)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="库存日期"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('stockedAt', {
                      initialValue: initDate,
                    })(
                      <DatePicker
                        disabledDate={(date)=>{
                          return date.isAfter(initDate)
                        }}
                        format="YYYY-MM-DD" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="商品编码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('goodsCode')(
                        <Input
                          type="text"
                          placeholder="请输入商品编码"
                        />,
                      )
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="商品名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('goodsName')(
                        <Input
                          type="text"
                          placeholder="请输入商品名称"
                        />,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row gutter={16}>
              <Col span={12} offset={12} className="text-right">
                <Popover content={content} title="报表说明" trigger="click" placement="left">
                  <Button className="margin-right-10"><Icon type="info-circle" />报表说明</Button>
                </Popover>
                <Authority permission="exportPageStockDetail">
                  <ExportButton
                    url="/api/impala/reports/detail/export-paging"
                    params={this.check()}
                    progressUrl="/api/impala/reports/detail/export-paging-asyn"
                  />
                </Authority>
                <Button
                  onClick={this.handleReset}
                  icon="close"
                  className="margin-right-10"
                >清 空</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  loading={inventorys.fetching}
                >查 询</Button>
                {
                  expand ? <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle} href>
                  展开 <Icon type="down" />
                  </a> : <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle} href>
                  隐藏 <Icon type="up" />
                  </a>
                }
              </Col>
            </Row>
          </Form>
        </Card>
        <Card loading={false}>
          <Table
            columns={columns}
            pagination={false}
            scroll={{ x: 2600 }}
            dataSource={inventorys.data}
            loading={inventorys.fetching}
          />
          {
            !!inventorys.total &&
              <div style={{ float: 'right', marginBottom: 12, marginTop: 12 }}>
                <Pagination
                  total={inventorys.total}
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  size="small"
                  showQuickJumper
                  showSizeChanger
                  showTotal={() => `一共 ${inventorys.total} 条`}
                  onChange={this.handleTableChange}
                  onShowSizeChange={this.handleTablePageSizeChange}
                />
              </div>
          }
        </Card>
      </div>
    );
  }
}

SalesDetails.propTypes = {
  form: PropTypes.object,
  inventorys: PropTypes.object,
  tags: PropTypes.object,
  query: PropTypes.func,
  queryInventorySummary: PropTypes.func,
  getBranches: PropTypes.func,
  getCompany: PropTypes.func,
  queryBrands: PropTypes.func,
  getGroup: PropTypes.func,
  getSeries: PropTypes.func,
  getChannel: PropTypes.func,
  querySummaryChannel: PropTypes.func,
  getSmallChannel: PropTypes.func,
  queryUnitTypes: PropTypes.func,
  queryGoodsTypes: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => container.queryInventory(param),
  queryInventorySummary: param => container.queryInventorySummary(param),
  getBranches: () => getBranch(),
  getCompany: param => queryCompanies(param),
  queryBrands: () => getBrands(),
  getGroup: () => getGoodsGroup(),
  getSeries: ids => queryGoodsSeries(ids),
  getChannel: () => queryGoodsChannel(),
  querySummaryChannel: id => getSummaryChannel(id),
  getSmallChannel: id => querySmallChannel(id),
  queryUnitTypes: () => getUnitTypes(),
  queryGoodsTypes: () => getGoodsTypes(),
};
const mapStateTopProps = state => ({
  inventorys: state.inventory,
  tags: state.tags,
});

SalesDetails = Form.create()(SalesDetails);

export default connect(mapStateTopProps, mapDispatchToProps)(SalesDetails);

