import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, Card, Form, Row, Col, Input, Button, Select, DatePicker, Icon, Pagination } from 'antd';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import _ from 'lodash';
import moment from 'moment';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import { getBranch, queryCompanies, getBrands, getGoodsGroup, queryGoodsSeries, queryGoodsChannel, getSummaryChannel, querySmallChannel, getUnitTypes, getGoodsTypes } from 'store/tags';
import * as container from './containers';


const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const saleHaier = [{
  key: undefined,
  value: '全 部',
}, {
  key: 'branch',
  value: '分中心',
}, {
  key: 'channel',
  value: '渠 道',
}, {
  key: 'branch_channel',
  value: '分中心,渠道',
}, {
  key: 'branch_company',
  value: '分中心,小微',
}, {
  key: 'branch_company_channel',
  value: '分中心,小微,渠道',
}, {
  key: 'branch_company_channel_dealer',
  value: '分中心,小微,渠道,客户',
}];

const goodsHaier = [{
  key: undefined,
  value: '全 部',
}, {
  key: 'brand',
  value: '品 牌',
}, {
  key: 'brand_group',
  value: '品牌,产品组',
}, {
  key: 'brand_group_series',
  value: '品牌,产品组,系列',
}, {
  key: 'brand_group_series_goods',
  value: '品牌,产品组,系列,商品',
}];

const saleRRS = [{
  key: undefined,
  value: '全 部',
}, {
  key: 'branch',
  value: '分公司',
}, {
  key: 'branch_company',
  value: '分公司,网格',
}, {
  key: 'branch_ company_ dealer',
  value: '分公司,网格,客户',
}];

const goodRRS = [{
  key: undefined,
  value: '全 部',
}, {
  key: 'brand',
  value: '品 牌',
}, {
  key: 'brand_group',
  value: '品牌,产品中类',
}, {
  key: 'brand_group_series',
  value: '品牌,产品中类,产品小类',
}, {
  key: 'brand_group_series_goods',
  value: '品牌,产品中类,产品小类,商品',
}];

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const dateItemSale = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

class BillingCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      sale: saleHaier,
      goods: goodsHaier,
      pagination: {
        pageSize: 10,
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true,
      },
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
    // 改变搜索条件
    this.toggle = this.toggle.bind(this);
    // 监听提单来源的改变事件
    this.handleComeFrom = this.handleComeFrom.bind(this);
    // 分页事件
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleTablePageSizeChange = this.handleTablePageSizeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { billingCount } = nextProps;
    const { result, summary } = billingCount;
    if (summary && result.data.length > 0) {
      if (!_.isEqual(summary, _.last(result.data))) {
        result.data.push(summary);
      }
    }
  }

  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({ show: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, query, queryBillingCountSummary } = this.props;
    const { current, pageSize } = this.state.pagination;
    const fieldsValues = { ...form.getFieldsValue(), pageNo: current, pageSize };
    fieldsValues.dt = moment(fieldsValues.dt).format('YYYY-MM');
    this.setState({
      expand: true,
    });
    query(fieldsValues);
    queryBillingCountSummary(fieldsValues);
  }

  check() {
    const { form } = this.props;
    const fieldsValues = form.getFieldsValue();
    fieldsValues.dt = moment(fieldsValues.dt).format('YYYY-MM');
    return fieldsValues;
  }
  // 分页事件
  handleTableChange(current) {
    const { pageSize } = this.state.pagination;
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
      },
    });
    fieldsValues.dt = moment(fieldsValues.dt).format('YYYY-MM');
    fieldsValues.pageNo = current;
    fieldsValues.pageSize = pageSize;
    query(fieldsValues);
  }
  // 分页大小改变
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
    form.resetFields(['hzChannelCode', 'xqdChannelCode']);
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
    const { getBranches } = this.props;
    const comeFrom = this.props.form.getFieldValue('comeFrom');
    getBranches({ comeFrom }, !comeFrom);
  }
  // 改变小微下拉框的状态
  changeState(value) {
    const { getCompany, form } = this.props;
    form.resetFields(['companyCode']);
    getCompany(value);
  }

  handleComeFrom(value) {
    if (value === '20') {
      this.setState({
        sale: saleRRS,
        goods: goodRRS,
      });
    }
  }

  render() {
    const { billingCount, tags, form } = this.props;
    const { column, result, summary } = billingCount;
    const scroll = { x: column.length >= 5 ? 120 * column.length : true };
    const { expand, pagination, sale, goods } = this.state;
    const {
      branchs, companies,
      goodsChannel, summaryChannel, smallChannel,
    } = tags;
    const { getFieldDecorator } = form;
    pagination.total = result.total || 0;
    return (
      <div>
        <Card loading={false}>
          <Form horizontal onSubmit={this.handleSubmit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="提单来源"
                    {...formItemLayout}
                  >
                    { getFieldDecorator('comeFrom')(
                      <Select
                        onChange={this.handleComeFrom}
                        placeholder="请选择提单来源"
                      >
                        <Option key="" value="">全 部</Option>
                        <Option key={'haier'} value={'10'}>海 尔</Option>
                        <Option key={'daliy'} value={'20'}>日日顺</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
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
                        dropdownMatchSelectWidth={false}
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
                        placeholder="请选择小微"
                        dropdownMatchSelectWidth={false}
                      >
                        {companies.data.map(company =>
                          <Option key={company.key} value={company.key}>{company.value}</Option>)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="销售时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dt', { initialValue: moment() })(
                      <MonthPicker locale={zhCN} format="YYYY-MM" />,
                    )}
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
                    label="经销商编码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('dealerCode')(
                        <Input
                          type="text"
                          placeholder="请输入经销商代码"
                        />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="经销商名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('dealerName')(
                        <Input
                          type="text"
                          placeholder="请输入经销商代码"
                        />)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="送达方编码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('shCode')(
                        <Input
                          type="text"
                          placeholder="请输入送达方编码"
                        />)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="送达方名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('shName')(
                        <Input
                          type="text"
                          placeholder="请输入送达方名称"
                        />)
                    }
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row type="flex" gutter={16} justify="center" align="middle">
              <Col span={6}>
                <FormItem
                  label="销售维度"
                  {...formItemLayout}
                >
                  { getFieldDecorator('saleDimension')(
                    <Select
                      dropdownMatchSelectWidth={false}
                      placeholder="请选择销售维度"
                    >
                      <Option key="all_sale" value={undefined}>全 部</Option>
                      <Option key="branch" value="branch">分中心</Option>
                      <Option key="channel" value="channel">渠道</Option>
                      <Option key="branch_channel" value="branch_channel">分中心,渠道</Option>
                      <Option key="branch_company" value="branch_company">分中心,小微</Option>
                      <Option key="branch_company_channel" value="branch_company_channel">分中心,小微,渠道</Option>
                      <Option key="branch_company_dealer" value="branch_company_dealer">分中心,小微,客户</Option>
                      <Option key="branch_company_channel_dealer" value="branch_company_channel_dealer">分中心,小微,渠道,客户</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  label="产品维度"
                  {...formItemLayout}
                >
                  { getFieldDecorator('productDimension')(
                    <Select
                      placeholder="请选择产品维度"
                    >
                      {
                        goods.map(ele =>
                          <Option value={ele.key}>{ele.value}</Option>,
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12} className="text-right">
                <Authority permission="exportDeliverySummary">
                  <ExportButton
                    url="/api/impala/deliverys/export-summary"
                    params={this.check()}
                    progressUrl="/api/impala/deliverys/export-summary-asyn"
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
                  loading={billingCount.fetching}
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
            columns={column}
            scroll={scroll}
            pagination={false}
            dataSource={result.data}
            loading={billingCount.fetching}
          />
          { !!result.total &&
            <div style={{ float: 'right', marginBottom: 12, marginTop: 12 }}>
              <Pagination
                pageSize={pagination.pageSize}
                current={pagination.current}
                total={result.total}
                showQuickJumper
                showSizeChanger
                showTotal={() => `一共 ${result.total} 条`}
                size="small"
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

BillingCount.propTypes = {
  form: PropTypes.object,
  billingCount: PropTypes.object,
  tags: PropTypes.object,
  query: PropTypes.func,
  queryBillingCountSummary: PropTypes.func,
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
  query: param => container.queryBillingCount(param),
  queryBillingCountSummary: param => container.queryBillingCountSummary(param),
  getBranches: (param, clear) => getBranch(param, clear),
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
  billingCount: state.billingCount,
  tags: state.tags,
});

BillingCount = Form.create()(BillingCount);

export default connect(mapStateTopProps, mapDispatchToProps)(BillingCount);

