import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Form, Table, Card, Input, Col, Row, Button, Select, DatePicker, Popover, Icon, Pagination} from 'antd';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import moment from 'moment';
import {
  getBranch,
  queryCompanies,
  getBrands,
  getGoodsGroup,
  queryGoodsSeries,
  queryGoodsChannel,
  getSummaryChannel,
  querySmallChannel,
} from 'store/tags';
import {queryEnterSells, querySummary} from './containers';
import Content from './Tip';

const FormItem = Form.Item;
const Option = Select.Option;

class EnterSells extends Component {
  constructor(props) {
    super(props);

    const rangeEnd = moment().subtract(moment('13:30', 'HH:mm').isBefore(new Date()) ? 1 : 2, 'days');
    const rangeStart = rangeEnd.clone().startOf('month');
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      companyShow: true,
      summaryShow: true,
      smallShow: true,
      serieShow: true,
      expand: false,
      rangeStart,
      rangeEnd,
      initRangeStart: rangeStart,
      initRangeEnd: rangeEnd,
    };
    // 提交表单
    this.submit = this.submit.bind(this);
    // 重置表单
    this.reset = this.reset.bind(this);
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
    // 处理分页改变
    this.onTableChange = this.onTableChange.bind(this);
    // 处理pageSize改变
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {enterSells} = nextProps;
    const {summary, result} = enterSells;
    // 当props变化的时候，填充summary字段
    if (summary && result.data.length > 0) {
      if (!_.isEqual(summary, _.last(result.data))) {
        result.data.push(summary);
      }
    }
  }

  // 提交表单
  submit(e) {
    e.preventDefault();
    const {form, query, querySummary} = this.props;
    const fieldsValues = form.getFieldsValue();
    const {rangeStart, rangeEnd, goodsGroupId} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      startAt: rangeStart.format('YYYY-MM-DD'),
      endAt: rangeEnd.format('YYYY-MM-DD'),
    };
    this.setState({
      expand: true,
    });
    query(values);
    querySummary(values);
  }

  // 表单的重置
  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      companyShow: true,
      summaryShow: true,
      smallShow: true,
      serieShow: true,
    });
  }

  // 导出前的校验
  check() {
    const {form} = this.props;
    const fieldsValues = form.getFieldsValue();
    const {rangeStart, rangeEnd, goodsGroupId} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    delete fieldsValues.goodsGroupId;
    return {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      startAt: rangeStart.format('YYYY-MM-DD'),
      endAt: rangeEnd.format('YYYY-MM-DD'),
    };
  }

  // 获取分中心下拉框的所有选项
  handleBranchFocus() {
    const {queryBranch} = this.props;
    queryBranch();
  }

  // 改变小微下拉框的状态
  changeState(value) {
    const {queryCompany, form} = this.props;
    this.setState({companyShow: false});
    form.resetFields(['companyCode']);
    queryCompany(value.join(','));
  }

  // 获取大渠道下拉框的数据
  handledqdChannelFocus() {
    const {queryChannel, tags} = this.props;
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
    const {queryBrand} = this.props;
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
  onTableChange(current) {
    const {pageSize} = this.state.pagination;
    const {form, query} = this.props;
    const fieldsValues = form.getFieldsValue();
    const {rangeStart, rangeEnd} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    const values = {
      ...fieldsValues,
      startAt: rangeStart.format('YYYY-MM-DD'),
      endAt: rangeEnd.format('YYYY-MM-DD'),
    };
    this.setState({
      pagination: Object.assign({}, this.state.pagination, {
        current,
        pageSize,
      }),
    });
    query({
      pageNo: current,
      pageSize,
      ...values,
    });
  }

  onPageSizeChange(current, pageSize) {
    const pagination = Object.assign({}, this.state.pagination, {pageSize});
    this.setState({
      pagination,
    }, () => this.onTableChange(1));
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 10},
      wrapperCol: {span: 14},
    };
    const {enterSells, form, tags} = this.props;
    const {
      branchs, companies, brands, goodsGroup, goodsSeries,
      goodsChannel, summaryChannel, smallChannel,
    } = tags;
    const {
      companyShow, summaryShow, smallShow, serieShow, pagination, expand,
      rangeStart, rangeEnd, initRangeEnd, initRangeStart,
    } = this.state;

    // rangeEnd的值，不能大于initRangeStart+30天，也不能超过initRangeEnd
    const {getFieldDecorator, setFieldsValue, getFieldValue} = form;
    const {result, column} = enterSells;
    return (
      <div>
        <Card>
          <Form horizontal onSubmit={this.submit}>
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
                        multiple
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
                    label="小微"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('companyCode')(
                      <Select
                        placeholder="请选择小微"
                        disabled={companyShow}
                        dropdownMatchSelectWidth={false}
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
                    label="商品类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsAttribute')(
                      <Select
                        placeholder="请选择商品类型"
                      >
                        <Option value="">全部</Option>
                        <Option value="0">正品</Option>
                        <Option value="1">样品</Option>
                        <Option value="2">不良品</Option>
                        <Option value="3">礼品</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                </Row>
              <Row gutter={16}>
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
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="渠道专供型号"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsTypeMulti')(
                      <Select
                        placeholder="请选择渠道专供型号"
                      >
                        <Option value="">全部</Option>
                        <Option value="1">包销定制</Option>
                        <Option value="2">三专专供</Option>
                        <Option value="3">综合专供</Option>
                        <Option value="4">乡镇专供</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
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
                    label="账户类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('dataChangeClass')(
                      <Select
                        placeholder="请选择账户类型"
                      >
                        <Option value="">全部</Option>
                        <Option value="10">T1</Option>
                        <Option value="50">B2B</Option>
                        <Option value="30">DMP</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="客户状态"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('openStatus')(
                      <Select
                        placeholder="请选择客户状态"
                      >
                        <Option value="">全部</Option>
                        <Option value="1">已开通</Option>
                        <Option value="0">已下线</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
                <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="客户视图"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('custView')(
                      <Select
                        placeholder="请选择客户视图"
                      >
                        <Option value="">全部</Option>
                        <Option value="1">MCD店客户</Option>
                        <Option value="2">会长客户</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="开始时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('rangeStart', {
                      initialValue: initRangeStart,
                    })(
                      <DatePicker
                        format="YYYY-MM-DD"
                        allowClear={false}
                        disabledDate={(currentDate) => {
                          return currentDate.isAfter(rangeEnd);
                        }}
                        onChange={(date) => {
                          this.setState({rangeStart: date});
                          // rangeEnd的值，不能大于initRangeStart+30天，也不能超过initRangeEnd
                          const currentRangeEnd = getFieldValue('rangeEnd');
                          const rangeStartAfterMonth = date.clone().add(30, 'days');
                          if(currentRangeEnd.isAfter(rangeStartAfterMonth)){
                            setFieldsValue({
                              rangeEnd: rangeStartAfterMonth,
                            });
                          }
                          if(currentRangeEnd.isBefore(date)){
                            setFieldsValue({
                              rangeEnd: date,
                            });
                          }
                        }}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="结束时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('rangeEnd', {
                      initialValue: initRangeEnd,
                    })(
                      <DatePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        disabledDate={(currentDate) => {
                          return currentDate.isBefore(rangeStart) ||
                            currentDate.isAfter(rangeStart.clone().add(30, 'days')) ||
                            currentDate.isAfter(initRangeEnd);
                        }}
                      />
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
                      <Option value="">全部</Option>
                      <Option value="branch">分中心</Option>
                      <Option value="channel">渠道</Option>
                      <Option value="branch_channel">分中心,渠道</Option>
                      <Option value="branch_company">分中心,小微</Option>
                      <Option value="branch_company_channel">分中心,小微,渠道</Option>
                      <Option value="branch_company_dealer">分中心,小微,客户</Option>
                      <Option
                        key="branch_company_channel_dealer"
                        value="branch_company_channel_dealer"
                      >分中心,小微,渠道,客户</Option>
                      <Option key="branch_branchXv" value="branch_branchXv">分中心,分类</Option>
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
                      <Option value="">全部</Option>
                      <Option value="industry">产业</Option>
                      <Option value="group">产品组</Option>
                      <Option value="group_series">产品组,系列</Option>
                      <Option value="group_series_goods">产品组,系列,商品</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col
                span={12}
                className="text-right"
              >
                <Popover placement="left" content={<Content/>} title="报表说明" trigger="click">
                  <Button icon="info-circle" className="margin-right-10">报表说明</Button>
                </Popover>
                <Authority permission="exportPssSummary">
                  <ExportButton
                    url="/api/impala/reports/export-pss-summary"
                    progressUrl="/api/impala/reports/export-pss-summary-asyn"
                    params={this.check()}
                  />
                </Authority>
                <Button className="margin-right-10" onClick={this.reset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={result.fetching}>查 询</Button>
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
        <Card>
          <Table
            size="middle"
            scroll={{x: 4600}}
            pagination={false}
            bordered
            columns={column}
            dataSource={result.data}
            loading={enterSells.fetching}
          />
          {!!result.total &&
          <div style={{float: 'right', marginTop: 12, marginBottom: 12}}>
            <Pagination
              defaultCurrent={1}
              defaultPageSize={10}
              onChange={this.onTableChange}
              onShowSizeChange={this.onPageSizeChange}
              size="small"
              showQuickJumper
              showSizeChanger
              showTotal={() => `一共 ${result.total} 条`}
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={result.total}
            />
          </div>
          }
        </Card>
      </div>
    );
  }
}

EnterSells.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  querySummary: PropTypes.func,
  enterSells: PropTypes.object,
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
  query: param => queryEnterSells(param),
  querySummary: param => querySummary(param),
  queryBranch: () => getBranch(),
  queryCompany: param => queryCompanies(param),
  queryChannel: () => queryGoodsChannel(),
  querySummaryChannel: param => getSummaryChannel(param),
  querySmall: param => querySmallChannel(param),
  queryBrand: () => getBrands(),
  queryGoodsGroup: () => getGoodsGroup(),
  queryGoodSeries: param => queryGoodsSeries(param),
};

const mapStateTopProps = state => ({
  enterSells: state.enterSells,
  tags: state.tags,
});

// 将 form 绑定到组件上
EnterSells = Form.create()(EnterSells);

export default connect(mapStateTopProps, mapDispatchToProps)(EnterSells);
