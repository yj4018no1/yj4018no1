import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import { Form, Input, Row, Col, Button, Card, Select, Table, DatePicker, Icon, Popover,Pagination } from 'antd';
import moment from 'moment';
import Authority from 'components/Authority';
import ExportButton from 'components/ExportButton';
import { formatPrice, formatCount } from 'store/util';
import _ from 'lodash'
import { getBranch, queryCompanies, queryGoodsChannel, getSummaryChannel, querySmallChannel } from 'store/tags';
import * as container from './containers';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const FILTER = {
  10: 'GVS',
  20: 'JDE',
};

const content = (
  <div>该报表提单数据取自JDE/GVS系统，其中如果字段“是否获取”为“待T1获取”，说明客户端可以下载该提单;
  如果为“待TC入库”说明该提单没有在HLES系统入库，需在HLES入库后才可下载该提单。</div>
);
// 表头
const columns = [{
  title: '分中心/分公司',
  dataIndex: 'branchName',
  width: 95,
  fixed: 'left',
  render: text => text ,
}, {
  title: '小微/网格',
  dataIndex: 'companyName',
  width: 95,
  fixed: 'left',
  render: text => text ,
}, {
  title: '经销商编码',
  dataIndex: 'dealerCode',
  fixed: 'left',
  width: 95,
  render: text => text ,
}, {
  title: '经销商名称',
  dataIndex: 'dealerName',
  fixed: 'left',
  render: text => text ,
}, {
  title: '商品编码',
  dataIndex: 'goodsCode',
  render: text => text ,
}, {
  title: '商品名称',
  dataIndex: 'goodsName',
  render: text => text ,
}, {
  title: '提货单号',
  dataIndex: 'deliveryNo',
  render: text => text ,
}, {
  title: '数量（台）',
  dataIndex: 'quantity',
  render: text => formatCount(text) ,
}, {
  title: '金额（万元）',
  dataIndex: 'fee',
  render: text => formatPrice(text, 10000, 2),
}, {
  title: '提单制货日期',
  dataIndex: 'deliveryAt',
  render: text =>
    <span>
      {text ? moment(text).format('YYYY-MM-DD') : ''}
    </span>,
}, {
  title: '送达方编码',
  dataIndex: 'shCode',
  render: text => text ,
}, {
  title: '送达方名称',
  dataIndex: 'shName',
  render: text => text ,
}, {
  title: '销售制单日期',
  dataIndex: 'soData',
  render: text =>
    <span>
      {text ? moment(text).format('YYYY-MM-DD') : ''}
    </span>,
}, {
  title: '大渠道',
  dataIndex: 'dqdChannel',
  render: text => text ,
}, {
  title: '汇总渠道',
  dataIndex: 'hzChannel',
  render: text => text ,
}, {
  title: '小渠道',
  dataIndex: 'xqdChannel',
  render: text => text ,
}, {
  title: '是否获取',
  dataIndex: 'dealFlagName',
  render: text => text ,
}, {
  title: '处理时间',
  dataIndex: 'dealTime',
  render: text =>
    <span>
      {text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''}
    </span>,
}, {
  title: '采购单号',
  dataIndex: 'poNo',
  render: text => text ,
}, {
  title: '销售单号',
  dataIndex: 'soNo',
  render: text => text ,
}, {
  title: '提单供价（万元）',
  dataIndex: 'supplyPrice',
  render: text => formatPrice(text, 10000, 2),
}, {
  title: '折扣价（万元）',
  dataIndex: 'agioPrice',
  render: text => formatPrice(text, 10000, 2),
}, {
  title: '行项目',
  dataIndex: 'itemNo',
  render: text => text ,
}, {
  title: '原单号',
  dataIndex: 'originSoNo',
  render: text => text ,
}, {
  title: '原单行号',
  dataIndex: 'originItemNo',
  render: text => text ,
}, {
  title: '提货来源',
  dataIndex: 'comeFrom',
  render: text => FILTER[text] ,
}];

class BillingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
      },
      companyShow: true,
      summaryShow: true,
      smallShow: true,
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
    // 获取大渠道
    this.handledqdChannelFocus = this.handledqdChannelFocus.bind(this);
    // 改变汇总渠道的状态
    this.changeHzState = this.changeHzState.bind(this);
    // 改变小渠道下拉框的状态
    this.changeSmallChannel = this.changeSmallChannel.bind(this);
    // 分页事件
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleTablePageSizeChange=this.handleTablePageSizeChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentWillReceiveProps(nextProps){
    const {bill} =nextProps;
    const {summary}=bill;
    if(summary&&bill.data.length>0){
      if(!_.isEqual(summary,_.last(bill.data))){
        bill.data.push(summary);
      }
    }

  }

  // 表单提交
  handleSubmit(e) {
    e.preventDefault();
    const { form, query,queryBillingDetailSummary } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { deliveryAt } = fieldsValues;
    const values = {
      ...fieldsValues,
      deliveryAt: deliveryAt && moment(deliveryAt).format('YYYY-MM'),
    };
    this.setState({
      pagination: {
        current: 1,
        pageSize: 10,
      },
      expand: true,
    });
    query(values);
    queryBillingDetailSummary(values);
  }
  // 重置表单
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      companyShow: true,
      summaryShow: true,
      smallShow: true,
    });
  }

  check() {
    const { form } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { deliveryAt } = fieldsValues;
    const values = {
      ...fieldsValues,
      deliveryAt: deliveryAt && moment(deliveryAt).format('YYYY-MM'),
    };
    return values;
  }

  // 获取分中心下拉框的所有选项
  handleBranchFocus() {
    const { queryBranch, tags } = this.props;
    const { branchs } = tags;
    const comeFrom = this.props.form.getFieldValue('comeFrom');
    queryBranch({ comeFrom }, !comeFrom);
  }

  // 改变小微下拉框的状态
  changeState(value) {
    const { queryCompany, form } = this.props;
    this.setState({ companyShow: false });
    form.resetFields(['companyCode']);
    queryCompany(value);
  }

  // 获取大渠道下拉框的数据
  handledqdChannelFocus() {
    const { queryChannel, tags } = this.props;
    const { goodsChannel } = tags;
    // if (goodsChannel && !goodsChannel.data.length) {
    queryChannel();
    // }
  }

  // 改变汇总渠道的状态
  changeHzState(value) {
    const { querySummaryChannel, form } = this.props;
    this.setState({ summaryShow: false });
    form.resetFields(['hzChannelCode', 'xqdChannelCode']);
    querySummaryChannel(value);
  }

  // 改变小渠道的状态
  changeSmallChannel(value) {
    const { querySmall, form } = this.props;
    this.setState({ smallShow: false });
    form.resetFields(['xqdChannelCode']);
    querySmall(value);
  }

  // 分页事件
  handleTableChange(current) {
    const { pageSize } = this.state.pagination;
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { deliveryAt } = fieldsValues;
    const values = {
      ...fieldsValues,
      deliveryAt: deliveryAt && moment(deliveryAt).format('YYYY-MM'),
    };
    this.setState({
      pagination:{...this.state.pagination,current},
    });
    values.pageNo = current;
    values.pageSize = pageSize;
    query(values);
  }
  handleTablePageSizeChange(current,pageSize){
    this.setState({
      pagination:Object.assign({},this.state.pagination,{pageSize}),
    },()=>this.handleTableChange(current))

  }
  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  }
  inputClear = () => {
    const { form } = this.props;
    form.setFieldsValue({ branchCode: undefined });
    form.setFieldsValue({ buCode: undefined });
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { bill, form, tags } = this.props;
    const { branchs, companies, goodsChannel, summaryChannel, smallChannel } = tags;
    const { getFieldDecorator } = form;
    const { companyShow, summaryShow, smallShow, pagination, expand } = this.state;
    pagination.total = bill.total;
    return (
      <div>
        <Card>
          <Form horizontal onSubmit={this.handleSubmit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="提单来源"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('comeFrom')(
                      <Select
                        placeholder="请选择提单来源"
                      >
                        <Option key='' value=''>全 部</Option>
                        <Option key="10" value="10">海尔</Option>
                        <Option key="20" value="20">日日顺</Option>
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="分中心/分公司"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('branchCode')(
                      <Select
                        onFocus={this.handleBranchFocus}
                        onChange={this.changeState}
                        dropdownMatchSelectWidth={false}
                        placeholder="请选择分中心"
                      >
                        {branchs.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="小微/网格"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('companyCode')(
                      <Select
                        placeholder="请选择小微"
                        dropdownMatchSelectWidth={false}
                        disabled={companyShow}
                      >
                        {companies.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('deliveryAt', { initialValue: moment() })(
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
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
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
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="提单货号"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('deliveryNo')(
                      <Input type="text" placeholder="请填写提单货号" />,
                    ) }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
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
                <Col sm={6}>
                  <FormItem
                    label="送达方编码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('shCode')(
                      <Input type="text" placeholder="请填写送达方编码" />,
                    ) }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="送达方名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('shName')(
                      <Input type="text" placeholder="请填写送达方名称" />,
                    ) }
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
                <Col sm={6}>
                  <FormItem
                    label="提单动作"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('actFlag')(
                      <Select placeholder="请选择提单动作">
                        <Option value="Z">正向发货</Option>
                        <Option value="R">逆向退货</Option>
                        <Option value="D">DN删除</Option>
                      </Select>,
                    ) }
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row gutter={16}>
              <Col span={12} offset={12} className="text-right">
                <Popover content={content} title="报表说明" trigger="click" placement="left">
                  <Button className="margin-right-10"><Icon type="info-circle" />报表说明</Button>
                </Popover>
                <Authority permission="exportDeliverys">
                  <ExportButton url="/api/impala/deliverys/export-deliverys"
                                params={this.check()}
                                progressUrl="/api/impala/deliverys/export-deliverys-asyn"
                  />
                </Authority>
                <Button className="margin-right-10" onClick={this.handleReset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={bill.fetching}>查 询</Button>
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
            scroll={{ x: 2750 }}
            columns={columns}
            dataSource={bill.data}
            loading={bill.fetching}
            pagination={false}
            onChange={this.handleTableChange}
          />
          {!!bill.total&&
            <div style={{float:'right',marginBottom:12,marginTop:12}}>
              <Pagination current={pagination.current}
                          pageSize={pagination.pageSize}
                          total={bill.total}
                          showSizeChanger
                          showQuickJumper
                          size='small'
                          onChange={this.handleTableChange}
                          showTotal={() => `一共 ${bill.total} 条`}
                          onShowSizeChange={this.handleTablePageSizeChange}
              />
            </div>
          }
        </Card>
      </div>
    );
  }
}

BillingDetail.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  queryBillingDetailSummary:PropTypes.func,
  queryBranch: PropTypes.func,
  queryCompany: PropTypes.func,
  queryChannel: PropTypes.func,
  querySummaryChannel: PropTypes.func,
  querySmall: PropTypes.func,
  bill: PropTypes.object,
  tags: PropTypes.object,
};

const mapDispatchToProps = {
  query: param => container.queryBillingDetail(param),
  queryBillingDetailSummary:param=>container.queryBillingDetailSummary(param),
  queryBranch: (param, clear) => getBranch(param, clear),
  queryCompany: param => queryCompanies(param),
  queryChannel: () => queryGoodsChannel(),
  querySummaryChannel: param => getSummaryChannel(param),
  querySmall: param => querySmallChannel(param),
};

const mapStateToProps = state => ({
  bill: state.billingDetail,
  tags: state.tags,
});

// 将 form 绑定到组件上
BillingDetail = Form.create()(BillingDetail);

export default connect(mapStateToProps, mapDispatchToProps)(BillingDetail);
