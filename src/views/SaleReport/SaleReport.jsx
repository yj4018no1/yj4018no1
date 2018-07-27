import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Form, Input, Row, Col, Button, Card, Table, Select, DatePicker, Icon, Popover, Pagination} from 'antd';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import _ from 'lodash';
import moment from 'moment';
import {
  getBranch,
  queryCompanies,
  getBrands,
  getGoodsGroup,
  queryGoodsSeries,
  queryGoodsChannel,
  getSummaryChannel,
  querySmallChannel
} from 'store/tags';
import * as container from './containers';

const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const content = (
  <div className="ant-table ant-table-small ant-table-bordered ant-table-scroll-position-left">
    <div className="ant-table-content">
      <div className="">
        <span>
          <div className="ant-table-body">
            <table className="">
              <colgroup>
                <col/>
                <col/>
                <col/>
              </colgroup>
              <tbody className="ant-table-tbody">
              <tr className="ant-table-row  ant-table-row-level-0">
                <td className="" rowSpan="7">
                  <span className="ant-table-row-indent indent-level-0" style={{paddingleft: 0}}/>
                  <span>销售统计</span>
                </td>
                <td className="column-money">零售数量</td>
                <td className="">往来单位为对销售单零售、工程客户、企业客户类型的零售和批发数量。</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td className="column-money">零售金额</td>
                <td className="">往来单位为对销售单零售、工程客户、企业客户类型的零售和批发金额。</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td className="column-money">批发数量</td>
                <td className="">往来单位为 伞下店 类型的零售和批发数量。</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td className="column-money">批发金额</td>
                <td className="">往来单位为 伞下店 类型的零售和批发金额。</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td className="column-money">同级理货数量</td>
                <td className="">往来单位为 经销商 类型的零售和批发数量。</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td className="column-money">同级理货金额</td>
                <td className="">往来单位为 经销商 类型的零售和批发金额。</td>
              </tr>
              <tr className="ant-table-row  ant-table-row-level-0">
                <td className="column-money">进店人数</td>
                <td className="">统计该查询销售维度或者该查询客户下所有门店进店客户数之和。</td>
              </tr>
              </tbody>
            </table>
          </div>
        </span>
      </div>
    </div>
  </div>
);

class SaleReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
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
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleTablePageSizeChange = this.handleTablePageSizeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {sale} = nextProps;
    const {result, summary} = sale;
    if (summary && result.data.length > 0) {
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
    const {form, query, getSaleReportSummary} = this.props;
    const fieldsValues = form.getFieldsValue();
    const {rangeStart,rangeEnd, goodsGroupId} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      startAt: moment(rangeStart).format('YYYY-MM-DD'),
      endAt: moment(rangeEnd).format('YYYY-MM-DD'),
    };
    this.setState({
      pagination: {
        current: 1,
        pageSize: 10,
      },
      expand: true,
    });
    query(values);
    getSaleReportSummary(values);
  }

  // 导出前校验
  check() {
    const {form} = this.props;
    const fieldsValues = form.getFieldsValue();
    const {rangeStart, rangeEnd, goodsGroupId} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      startAt: moment(rangeStart).format('YYYY-MM-DD'),
      endAt: moment(rangeEnd).format('YYYY-MM-DD'),
    };
    return values;
  }

  // 获取分中心下拉框的所有选项
  handleBranchFocus() {
    const {queryBranch, tags} = this.props;
    const {branchs} = tags;
    queryBranch();
  }

  // 改变小微下拉框的状态
  changeState(value) {
    const {queryCompany, form} = this.props;
    this.setState({companyShow: false});
    form.resetFields(['companyCode']);
    queryCompany(value);
  }

  // 获取大渠道下拉框的数据
  handledqdChannelFocus() {
    const {queryChannel, tags} = this.props;
    const {goodsChannel} = tags;
    queryChannel();
  }

  // 改变汇总渠道的状态
  changeHzState(value) {
    const {querySummaryChannel, form} = this.props;
    this.setState({summaryShow: false});
    form.resetFields(['hzChannelCode', 'xqdChannelCode']);
    querySummaryChannel(value);
  }

  // 改变小渠道的状态
  changeSmallChannel(value) {
    const {querySmall, form} = this.props;
    this.setState({smallShow: false});
    form.resetFields(['xqdChannelCode']);
    querySmall(value);
  }

  // 获取品牌下拉框的值
  handleBrandFocus() {
    const {queryBrand, tags} = this.props;
    const {brands} = tags;
    queryBrand();
  }

  // 获取产品组下拉框的所有值
  handleGoodsGroupFocus() {
    const {queryGoodsGroup} = this.props;
    queryGoodsGroup();
  }

  // 改变产品系列下拉框的状态
  changeGoodsSeries(value) {
    const groupIDS = value.join(',');
    const {queryGoodSeries, form} = this.props;
    this.setState({serieShow: !groupIDS});
    form.resetFields(['goodsSeriesId']);
    queryGoodSeries(groupIDS);
  }

  toggle(e) {
    e.preventDefault();
    const {expand} = this.state;
    this.setState({
      expand: !expand,
    });
  }

  // 分页事件
  handleTableChange(current) {
    const {pageSize} = this.state.pagination;
    const {form, query} = this.props;
    const fieldsValues = form.getFieldsValue();
    const {rangeStart, rangeEnd} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    const values = {
      ...fieldsValues,
      startAt: moment(rangeStart).format('YYYY-MM-DD'),
      endAt: moment(rangeEnd).format('YYYY-MM-DD'),
    };
    this.setState({
      pagination: {
        ...this.state.pagination, current,
      },
    });
    values.pageNo = current;
    values.pageSize = pageSize;
    query(values);
  }

  // 分页页面大小改变
  handleTablePageSizeChange(current, pageSize) {
    this.setState({
      pagination: Object.assign({}, this.state.pagination, {
        pageSize,
      }),
    }, () => this.handleTableChange(1));
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 10},
      wrapperCol: {span: 14},
    };
    const {sale, form, tags} = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    const {branchs, companies, brands, goodsGroup, goodsSeries, goodsChannel, summaryChannel, smallChannel} = tags;
    const {companyShow, summaryShow, smallShow, serieShow, pagination, expand} = this.state;
    const {result, column} = sale;
    const scroll = {x: column.length >= 5 ? 120 * column.length : true};
    pagination.total = result.total || 0;
    return (
      <div>
        <Card loading={false}>
          <Form horizontal onSubmit={this.handleSubmit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="分中心/分公司"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('branchCode')(
                      <Select
                        onFocus={this.handleBranchFocus}
                        onChange={this.changeState}
                        placeholder="请选择分中心"
                      >
                        {branchs.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="小微/网格"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('companyCode')(
                      <Select
                        dropdownMatchSelectWidth={false}
                        placeholder="请选择小微"
                        disabled={companyShow}
                      >
                        {companies.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
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
                      <Input type="text" placeholder="请填写经销商编码"/>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="经销商名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dealerName')(
                      <Input type="text" placeholder="请填写经销商名称"/>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="品牌"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('brandCode')(
                      <Select
                        placeholder="请选择品牌"
                        onFocus={this.handleBrandFocus}
                      >
                        {brands.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="产品组"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsGroupId')(
                      <Select
                        multiple={true}
                        onFocus={this.handleGoodsGroupFocus}
                        onChange={this.changeGoodsSeries}
                        placeholder="请选择产品组"
                      >
                        {goodsGroup.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
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
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="客户视图"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('custView')(
                      <Select
                        placeholder="请选择客户视图"
                      >
                        <Option key="0" value="-1">全部</Option>
                        <Option value="1">MCD店客户</Option>
                        <Option value="2">会长客户</Option>
                      </Select>,
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
                    {getFieldDecorator('dqdChannelCode')(
                      <Select
                        onFocus={this.handledqdChannelFocus}
                        onChange={this.changeHzState}
                        placeholder="请选择大渠道"
                      >
                        {goodsChannel.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
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
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
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
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="商品编码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsCode')(
                      <Input type="text" placeholder="请填写商品编码"/>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="商品名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsName')(
                      <Input type="text" placeholder="请填写商品名称"/>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="商品类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsAttribute')(
                      <Select
                        placeholder="请选择商品类型"
                      >
                        <Option value="0">正品</Option>
                        <Option value="1">样品</Option>
                        <Option value="2">不良品</Option>
                        <Option value="3">礼品</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="往来单位类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('partnerType')(
                      <Select
                        multiple={true}
                        placeholder="请选择往来单位类型"
                      >
                        <Option value="0">个人</Option>
                        <Option value="1">工程客户</Option>
                        <Option value="2">企业客户</Option>
                        <Option value="3">伞下店</Option>
                        <Option value="4">经销商</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="门店编码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('shopCode')(
                      <Input type="text" placeholder="请填写门店编码"/>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="门店名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('shopName')(
                      <Input type="text" placeholder="请填写门店名称"/>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="开始时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('rangeStart', {initialValue: moment().startOf('month')})(
                      <DatePicker
                        allowClear={false}
                        disabledDate={(currentDate) => {
                          return currentDate.isAfter(moment());
                        }}
                        onChange={(date)=>{
                          const rangeEnd = getFieldValue('rangeEnd');
                          if(rangeEnd.isBefore(date)){
                            setFieldsValue({rangeEnd:date})
                          }
                        }}
                        format="YYYY-MM-DD"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="结束时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('rangeEnd', {initialValue: moment()})(
                      <DatePicker
                        allowClear={false}
                        disabledDate={(currentDate) => {
                          const rangeStart = getFieldValue('rangeStart');
                          return currentDate.isAfter(moment()) || currentDate.isBefore(rangeStart);
                        }}
                        format="YYYY-MM-DD"
                      />,
                    )}
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
                      <Option key="branch_company_channel_dealer"
                              value="branch_company_channel_dealer">分中心,小微,渠道,客户</Option>
                      <Option key="branch_company_channel_dealer_shop" value="branch_company_channel_dealer_shop">分中心,小微,渠道,客户,门店</Option>
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
                  )}
                </FormItem>
              </Col>
              <Col sm={12} className="text-right">
                <Popover content={content} title="报表说明" trigger="click" placement="left">
                  <Button className="margin-right-10"><Icon type="info-circle"/>报表说明</Button>
                </Popover>
                <Authority permission="exportSalesSummary">
                  <ExportButton
                    url="/api/impala/reports/export-sales-summary"
                    params={this.check()}
                    progressUrl="/api/impala/reports/export-sales-summary-asyn"
                  />
                </Authority>
                <Button className="margin-right-10" onClick={this.handleReset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={sale.fetching}>查 询</Button>
                {
                  expand ? <a style={{marginLeft: 8, fontSize: 12}} onClick={this.toggle} href>
                    展开 <Icon type="down"/>
                  </a> : <a style={{marginLeft: 8, fontSize: 12}} onClick={this.toggle} href>
                    隐藏 <Icon type="up"/>
                  </a>
                }
              </Col>
            </Row>
          </Form>
        </Card>
        <Card loading={false}>
          <Table
            dataSource={result.data}
            loading={sale.fetching}
            columns={column}
            pagination={false}
            scroll={scroll}
            // onChange={
            //   (paginations) => {
            //     this.handleTableChange(paginations);
            //   }
            // }
          />
          {!!result.total &&
          <div style={{float: 'right', marginTop: 12, marginBottom: 12}}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={result.total}
              showSizeChanger
              showQuickJumper
              size="small"
              showTotal={() => `一共 ${result.total} 条`}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTablePageSizeChange}
            />
          </div>}
        </Card>
      </div>
    );
  }
}

SaleReport.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  getSaleReportSummary: PropTypes.func,
  sale: PropTypes.object,
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
  query: param => container.getSaleReport(param),
  getSaleReportSummary: param => container.getSaleReportSummary(param),
  queryBranch: () => getBranch(),
  queryCompany: param => queryCompanies(param),
  queryChannel: () => queryGoodsChannel(),
  querySummaryChannel: param => getSummaryChannel(param),
  querySmall: param => querySmallChannel(param),
  queryBrand: () => getBrands(),
  queryGoodsGroup: () => getGoodsGroup(),
  queryGoodSeries: param => queryGoodsSeries(param),
};

const mapStateToProps = state => ({
  sale: state.salereport,
  tags: state.tags,
});

SaleReport = Form.create()(SaleReport);

export default connect(mapStateToProps, mapDispatchToProps)(SaleReport);
