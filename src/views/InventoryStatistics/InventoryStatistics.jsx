import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Icon, Card, Input, Select, DatePicker, Table, Button, Popover, Pagination } from 'antd';
import moment from 'moment';
import Authority from 'components/Authority';
import ExportButton from 'components/ExportButton';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import _ from 'lodash';
import { getBranch, queryCompanies, getBrands, getGoodsGroup, queryGoodsSeries, queryGoodsChannel, getSummaryChannel, querySmallChannel } from 'store/tags';
import * as container from './containers';

const Option = Select.Option;
const FormItem = Form.Item;
const content = (
  <div className="ant-table ant-table-small ant-table-bordered ant-table-scroll-position-left">
    <div className="ant-table-title">
      历史库存统计的最底层维度是仓库中商品型号账目数量，如果仓库商品型号的账目数量大于0，为正库存，小于0，为负库存。前台展示的不同维度是根据仓库商品型号正负库存的叠加。
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
                  <td className="" rowSpan="6">
                    <span className="ant-table-row-indent indent-level-0" style={{ paddingleft: 0 }} />
                    <span>历史库存统计</span>
                  </td>
                  <td className="column-money">库存数量（台）</td>
                  <td className="">查询库存日期以及查询维度的总的账面库存数量。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">库存金额（万元）</td>
                  <td className="">查询库存日期以及查询维度的总的账面库存金额。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">正库存数量（台）</td>
                  <td className="">查询库存日期以及查询维度的正库存数量。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">正库存金额（万元）</td>
                  <td className="">查询库存日期以及查询维度的正库存金额。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">负库存数量（台）</td>
                  <td className="">查询库存日期以及查询维度的负库存数量。</td>
                </tr>
                <tr className="ant-table-row  ant-table-row-level-0">
                  <td className="column-money">负库存金额（万元）</td>
                  <td className="">查询库存日期以及查询维度的负库存金额。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </span>
      </div>
    </div>
  </div>
);

class InventoryStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().subtract(moment('13:30', 'HH:mm').isBefore(new Date()) ? 1 : 2, 'days'),
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
      },
      companyShow: true,
      summaryShow: true,
      smallShow: true,
      serieShow: true,
      expand: false,
    };
    // 表单提交
    this.handleSubmit = this.handleSubmit.bind(this);
    // 重置表单
    this.handleReset = this.handleReset.bind(this);
    // 表单导出前的校验
    this.check = this.check.bind(this);
    // 获取分中心下拉框的所有选项
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    // 改变小微下拉框的状态
    this.changeState = this.changeState.bind(this);
    // 获取品牌下拉框的所有选项
    this.handleBrandFocus = this.handleBrandFocus.bind(this);
    // 获取大渠道
    this.handledqdChannelFocus = this.handledqdChannelFocus.bind(this);
    // 改变汇总渠道的状态
    this.changeHzState = this.changeHzState.bind(this);
    // 改变小渠道下拉框的状态
    this.changeSmallChannel = this.changeSmallChannel.bind(this);
    // 获取产品组下拉框
    this.handleGoodsGroupFocus = this.handleGoodsGroupFocus.bind(this);
    // 获取产品系列下拉框
    this.changeGoodsSeries = this.changeGoodsSeries.bind(this);
    // 展开搜索
    this.toggle = this.toggle.bind(this);
    // 分页事件
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleTablePageSizeChange = this.handleTablePageSizeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { inventory } = nextProps;
    const { result, summary } = inventory;
    if (result.data.length > 0) {
      if (!_.isEqual(summary, _.last(result.data))) {
        result.data.push(summary);
      }
    }
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      companyShow: true,
      summaryShow: true,
      smallShow: true,
    });
  }
  // 表单提交
  handleSubmit(e) {
    e.preventDefault();
    const { form, query, queryStatisticsSummary } = this.props;
    const { pageSize, current } = this.state.pagination;
    const fieldsValues = form.getFieldsValue();
    const { stockedAt, goodsGroupId } = fieldsValues;
    delete fieldsValues.stockedAt;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      stockedAt: moment(stockedAt).format('YYYY-MM-DD'),
      pageNo: current,
      pageSize,
    };
    this.setState({
      expand: true,
    });
    query(values);
    queryStatisticsSummary(values);
  }

  // 导出前校验
  check() {
    const { form } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { stockedAt, goodsGroupId } = fieldsValues;
    delete fieldsValues.stockedAt;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      stockedAt: moment(stockedAt).format('YYYY-MM-DD'),
    };
    return values;
  }

  // 获取分中心下拉框的所有选项
  handleBranchFocus() {
    const { queryBranch, tags } = this.props;
    const { branchs } = tags;
    // if (branchs && !branchs.data.length) {
    queryBranch();
    // }
  }

  // 改变小微下拉框的状态
  changeState(value) {
    const { queryCompany, tags } = this.props;
    const { companies } = tags;
    this.setState({ companyShow: false });
    // if (companies && !companies.data.length) {
    queryCompany(value);
    // }
  }

  // 获取大渠道下拉框的数据
  handledqdChannelFocus() {
    const { queryChannel, tags } = this.props;
    const { goodsChannel } = tags;
    // if (goodsChannel && !goodsChannel.data.length) {
    //   queryChannel();
    // }
    queryChannel();
  }

  // 改变汇总渠道的状态
  changeHzState(value) {
    const { querySummaryChannel, tags } = this.props;
    const { summaryChannel } = tags;
    this.setState({ summaryShow: false });
    // if (summaryChannel && !summaryChannel.data.length) {
    //   querySummaryChannel(value);
    // }
    querySummaryChannel(value);
  }

  // 改变小渠道的状态
  changeSmallChannel(value) {
    const { querySmall, tags } = this.props;
    const { smallChannel } = tags;
    this.setState({ smallShow: false });
    // if (smallChannel && !smallChannel.data.length) {
    //   querySmall(value);
    // }
    querySmall(value);
  }

  // 获取品牌下拉框的值
  handleBrandFocus() {
    const { queryBrand, tags } = this.props;
    queryBrand();
  }

  // 获取产品组下拉框的所有值
  handleGoodsGroupFocus() {
    const { queryGoodsGroup } = this.props;
    queryGoodsGroup();
  }
  // 改变产品系列下拉框的状态
  changeGoodsSeries(ids) {
    const groupIDS = ids.join(',');
    const { queryGoodSeries, form } = this.props;
    form.resetFields(['goodsSeriesId']);
    this.setState({
      serieShow: !groupIDS,
    });
    queryGoodSeries(groupIDS);
  }

  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  }

  // 分页事件
  handleTableChange(current) {
    const { pageSize } = this.state.pagination;
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { stockedAt } = fieldsValues;
    const values = {
      ...fieldsValues,
      stockedAt: moment(stockedAt).format('YYYY-MM-DD'),
    };
    this.setState({
      pagination: {
        ...this.state.pagination,
        current,
        pageSize,
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

  render() {
    const { inventory, form, tags } = this.props;
    const { result, column, summary } = inventory;
    const { branchs, companies, brands, goodsGroup, goodsSeries, goodsChannel, summaryChannel, smallChannel } = tags;
    const { companyShow, summaryShow, smallShow, serieShow, pagination, expand, date } = this.state;
    const scroll = { x: column.length > 7 ? column.length * 120 : true };
    const { getFieldDecorator } = form;
    pagination.total = result.total || 0;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const dateItemSale = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
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
                    {getFieldDecorator('branchCode')(
                      <Select
                        onFocus={this.handleBranchFocus}
                        onChange={this.changeState}
                        placeholder="请选择分中心"
                      >
                        {branchs.data.map(ele =>
                          <Option key={`${ele.key}_${ele.value}`} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="小微"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('companyCode')(
                      <Select
                        disabled={companyShow}
                        placeholder="请选择小微"
                        dropdownMatchSelectWidth={false}
                      >
                        {
                          companies.data.map(ele =>
                            <Option key={`${ele.key}_${ele.value}`} value={ele.key}>{ele.value}</Option>,
                          )
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="经销商编码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dealerCode')(
                      <Input type="text" placeholder="请填写经销商编码" />,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="经销商名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dealerName')(
                      <Input type="text" placeholder="请填写经销商名称" />,
                    ) }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="大渠道"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dqdChannelCode')(
                      <Select
                        onFocus={this.handledqdChannelFocus}
                        onChange={this.changeHzState}
                        placeholder="请选择大渠道"
                      >
                        {goodsChannel.data.map(ele =>
                          <Option key={`${ele.key}_${ele.value}`} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="汇总渠道"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('hzChannelCode')(
                      <Select
                        placeholder="请选择汇总渠道"
                        onChange={this.changeSmallChannel}
                        disabled={summaryShow}
                      >
                        {summaryChannel.data.map(ele =>
                          <Option key={`${ele.key}_${ele.value}`} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="小渠道"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('xqdChannelCode')(
                      <Select
                        placeholder="请选择小渠道"
                        disabled={smallShow}
                      >
                        {smallChannel.data.map(ele =>
                          <Option key={`${ele.key}_${ele.value}`} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
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
                    label="产品组"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsGroupId')(
                      <Select
                        multiple
                        onFocus={this.handleGoodsGroupFocus}
                        onChange={this.changeGoodsSeries}
                        placeholder="请选择产品组"
                      >
                        {goodsGroup.data.map(ele =>
                          <Option key={`${ele.key}_${ele.value}`} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="产品系列"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsSeriesId')(
                      <Select
                        placeholder="请选择产品系列"
                        disabled={serieShow}
                      >
                        {goodsSeries.data.map(ele =>
                          <Option key={`${ele.key}_${ele.value}`} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="商品编码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsCode')(
                      <Input type="text" placeholder="请填写商品编码" />,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="商品名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsName')(
                      <Input type="text" placeholder="请填写商品名称" />,
                    ) }
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
                      getFieldDecorator('brandCode')(
                        <Select
                          onFocus={this.handleBrandFocus}
                          placeholder="请选择品牌"
                        >
                          {
                            brands.data.map(brand =>
                              <Option key={`${brand.key}_${brand.value}`} value={brand.key}>{brand.value}</Option>)
                          }
                        </Select>,
                      )
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="库存日期"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('stockedAt', { initialValue: date })(
                      <DatePicker
                        disabledDate={(currentDate)=>{
                          return currentDate.isAfter(date)
                        }}
                        format="YYYY-MM-DD" />)}
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row gutter={16}>
              <Col sm={6}>
                <FormItem
                  label="销售维度"
                  {...formItemLayout}
                >
                  {getFieldDecorator('saleDimension')(
                    <Select
                      placeholder="请选择销售维度"
                      dropdownMatchSelectWidth={false}
                    >
                      <Option key="all_sale" value={undefined}>全 部</Option>
                      <Option key="branch" value="branch">分中心</Option>
                      <Option key="channel" value="channel">渠道</Option>
                      <Option key="branch_channel" value="branch_channel">分中心,渠道</Option>
                      <Option key="branch_company" value="branch_company">分中心,小微</Option>
                      <Option key="branch_company_channel" value="branch_company_channel">分中心,小微,渠道</Option>
                      <Option key="branch_company_dealer" value="branch_company_dealer">分中心,小微,客户</Option>
                      <Option key="branch_company_channel_dealer" value="branch_company_channel_dealer">分中心,小微,渠道,客户</Option>
                      <Option key="branch_dealer_stock" value="branch_dealer_stock">分中心,客户,仓库名称</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="产品维度"
                  {...formItemLayout}
                >
                  {getFieldDecorator('productDimension')(
                    <Select
                      placeholder="请选择产品维度"
                    >
                      <Option key="all_product_report" value={undefined}>全 部</Option>
                      <Option key="group_report" value="group">产品组</Option>
                      <Option key="group_series_report" value="group_series">产品组,系列</Option>
                      <Option key="group_series_goods_report" value="group_series_goods">产品组,系列,商品</Option>
                    </Select>,
                  ) }
                </FormItem>
              </Col>
              <Col span={12} className="text-right">
                <Popover content={content} title="报表说明" trigger="click" placement="left">
                  <Button className="margin-right-10"><Icon type="info-circle" />报表说明</Button>
                </Popover>
                <Authority permission="exportStockSummary">
                  <ExportButton
                    url="/api/impala/reports/summary/export"
                    params={this.check()}
                    progressUrl=" /api/impala/reports/summary/export-asyn"
                  />
                </Authority>
                <Button className="margin-right-10" onClick={this.handleReset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={inventory.fetching}>查 询</Button>
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
        <Card>
          <Table
            dataSource={result.data}
            scroll={scroll}
            loading={inventory.fetching}
            columns={column}
            pagination={false}
          />
          { !!result.total &&
            <div style={{ float: 'right', marginTop: 12, marginBottom: 12 }}>
              <Pagination
                total={result.total}
                pageSize={pagination.pageSize}
                current={pagination.current}
                size="small"
                showQuickJumper
                showSizeChanger
                showTotal={() => `一共 ${result.total} 条`}
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

InventoryStatistics.propTypes = {
  inventory: PropTypes.object,
  query: PropTypes.func,
  queryStatisticsSummary: PropTypes.func,
  form: PropTypes.object,
  tags: PropTypes.object,
  queryBranch: PropTypes.func,
  queryCompany: PropTypes.func,
  queryChannel: PropTypes.func,
  querySummaryChannel: PropTypes.func,
  querySmall: PropTypes.func,
  queryBrand: PropTypes.func,
  queryGoodsGroup: PropTypes.func,
  queryGoodSeries: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => container.queryInventoryStatistics(param),
  queryStatisticsSummary: param => container.queryInventoryStatisticsSummary(param),
  queryBranch: () => getBranch(),
  queryCompany: param => queryCompanies(param),
  queryChannel: () => queryGoodsChannel(),
  querySummaryChannel: param => getSummaryChannel(param),
  querySmall: param => querySmallChannel(param),
  queryBrand: () => getBrands(),
  queryGoodsGroup: () => getGoodsGroup(),
  queryGoodSeries: ids => queryGoodsSeries(ids),
};

const mapStateTopProps = state => ({
  inventory: state.inventoryStatistics,
  tags: state.tags,
});

InventoryStatistics = Form.create()(InventoryStatistics);

export default connect(mapStateTopProps, mapDispatchToProps)(InventoryStatistics);
