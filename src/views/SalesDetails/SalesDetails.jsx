import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Table, Card, Form, Row, Col, Input, Button, Select, DatePicker, Popover, Icon, Pagination} from 'antd';
import moment from 'moment';
import ExportButton from 'components/ExportButton';
import {formatPrice} from 'store/util';
import Authority from 'components/Authority';
import {
  getBranch,
  queryCompanies,
  getBrands,
  getGoodsGroup,
  queryGoodsSeries,
  queryGoodsChannel,
  getSummaryChannel,
  querySmallChannel,
  getUnitTypes,
  getGoodsTypes
} from 'store/tags';
import {getSaleDetail, getSaleDetailSummary} from './containers';

const FormItem = Form.Item;
const TYPE = {
  0: '个人',
  1: '工程客户',
  2: '企业客户',
  3: '伞下店',
  4: '经销商',
};

const content = (
  <div className="ant-table ant-table-small ant-table-bordered ant-table-scroll-position-left">
    <div className="ant-table-content">
      <div className="ant-table-body">
        <table>
          <tbody className="ant-table-tbody">
          <tr>
            <td rowSpan="7" width="72">
              销售明细
            </td>
            <td>
              零售数量
            </td>
            <td>
              往来单位为 对销售单零售、工程客户、企业客户类型的零售和批发数量。
            </td>
          </tr>
          <tr>
            <td>
              零售金额
            </td>
            <td>
              往来单位为 对销售单零售、工程客户、企业客户类型的零售和批发金额。
            </td>
          </tr>
          <tr>
            <td>
              批发数量
            </td>
            <td>
              往来单位为 伞下店 类型的零售和批发数量。
            </td>
          </tr>
          <tr>
            <td>
              批发金额
            </td>
            <td>
              往来单位为 伞下店 类型的零售和批发金额。
            </td>
          </tr>
          <tr>
            <td>
              同级理货数量
            </td>
            <td>
              往来单位为 经销商 类型的零售和批发数量。
            </td>
          </tr>
          <tr>
            <td>
              同级理货金额
            </td>
            <td>
              往来单位为 经销商 类型的零售和批发金额。
            </td>
          </tr>
          <tr>
            <td>
              单价
            </td>
            <td>
              取自BCC中的标准供价。
            </td>
          </tr>
          </tbody>
        </table>
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
    render: text => text || '',
  }, {
    title: '小 微',
    fixed: 'left',
    width: 100,
    dataIndex: 'companyName',
    render: text => text || '',
  }, {
    title: '主经销商编码',
    dataIndex: 'dealerParentCode',
    render: text => text || '',
  }, {
    title: '主经销商名称',
    dataIndex: 'dealerParentName',
    render: text => text || '',
  }, {
    title: '经销商编码',
    dataIndex: 'dealerCode',
    render: text => text || '',
  }, {
    title: '经销商名称',
    dataIndex: 'dealerName',
    render: text => text || '',
  }, {
    title: '品 牌',
    dataIndex: 'brandName',
    render: text => text || '',
  }, {
    title: '产品组',
    dataIndex: 'goodsGroup',
    render: text => text || '',
  }, {
    title: '产品系列',
    dataIndex: 'goodsSeries',
    render: text => text || '',
  }, {
    title: '商品编码',
    dataIndex: 'goodsCode',
    render: text => text || '',
  }, {
    title: '商品名称',
    dataIndex: 'goodsName',
    render: text => text || '',
  }, {
    title: '销售时间',
    dataIndex: 'orderedAt',
    render: (text, record) => record.orderedAt && moment(record.orderedAt).format('YYYY/MM/DD HH:mm:ss'),
  }, {
    title: '单价(元)',
    dataIndex: 'price',
    render: text => text || '',
  }, {
    title: '总数量(台)',
    dataIndex: 'quantity',
    render: text => text || 0,
  }, {
    title: '总金额(万元)',
    dataIndex: 'fee',
    render: text => formatPrice(text, 10000, 2),
  }, {
    title: '零售数量(台)',
    dataIndex: 'retailQuantity',
    render: text => text || '',
  }, {
    title: '零售(万元)',
    dataIndex: 'retailFee',
    render: text => formatPrice(text, 10000, 2),
  }, {
    title: '批发数量(台)',
    dataIndex: 'wholesaleQuantity',
    render: text => text || '',
  }, {
    title: '批发(万元)',
    dataIndex: 'wholesaleFee',
    render: text => formatPrice(text, 10000, 2),
  }, {
    title: '同级理货(台)',
    dataIndex: 'peerQuantity',
    render: text => text || '',
  }, {
    title: '同级理货(万元)',
    dataIndex: 'peerFee',
    render: text => formatPrice(text, 10000, 2),
  }, {
    title: '往来单位编码',
    dataIndex: 'partnerCode',
    render: text => text || '',
  }, {
    title: '往来单位名称',
    dataIndex: 'partnerName',
    render: text => text || '',
  }, {
    title: '往来单位类型',
    dataIndex: 'partnerType',
    render: text => TYPE[text] || '',
  }, {
    title: '顾客电话',
    dataIndex: 'customerPhone',
    render: text => text || '',
  }, {
    title: '门店编码',
    dataIndex: 'shopCode',
    render: text => text || '',
  }, {
    title: '门店名称',
    dataIndex: 'shopName',
    render: text => text || '',
  }, {
    title: '出货仓库',
    dataIndex: 'storageName',
    render: text => text || '',
  }, {
    title: '大渠道',
    dataIndex: 'dqdChannelName',
    render: text => text || '',
  }, {
    title: '汇总渠道',
    dataIndex: 'hzChannelName',
    render: text => text || '',
  }, {
    title: '小渠道',
    dataIndex: 'xqdChannelName',
    render: text => text || '',
  },
];

const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 14},
};

class SalesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
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
    this.handleTableChange = this.handleTableChange.bind(this);
    this.handleTablePageSizeChange = this.handleTablePageSizeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {saledetail} = nextProps;
    if (saledetail && saledetail.data.length > 0) {
      if (!_.isEqual(saledetail.summary, _.last(saledetail.data))) {
        saledetail.data.push(saledetail.summary);
      }
    }
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({show: true});
  }

  handleSubmit(e) {
    e.preventDefault();
    const {form, query, queryDetailSummary} = this.props;
    const fieldsValues = form.getFieldsValue();
    const {rangeStart, rangeEnd, goodsGroupId, partnerType} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      partnerType: partnerType && partnerType.join(','),
      startAt: moment(rangeStart).format('YYYY-MM-DD'),
      endAt: moment(rangeEnd).format('YYYY-MM-DD'),
    };
    this.setState({
      pagination: Object.assign({}, this.state.pagination, {
        current: 1,
        pageSize: 10,
      }),
      expand: true,
    });
    query(values);
    queryDetailSummary(values);
  }

  check() {
    const fieldsValues = this.props.form.getFieldsValue();
    const {rangeStart, rangeEnd} = fieldsValues;
    delete fieldsValues.rangeStart;
    delete fieldsValues.rangeEnd;
    const values = {
      ...fieldsValues,
      startAt: moment(rangeStart).format('YYYY-MM-DD'),
      endAt: moment(rangeEnd).format('YYYY-MM-DD'),
    };
    return values;
  }

  // 分页事件
  handleTableChange(current) {
    const {form, query} = this.props;
    const {pageSize} = this.state.pagination;
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
      pagination: Object.assign({}, this.state.pagination, {
        current,
      }),
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

  // 获取源品牌下拉框的所有选项
  handleBrandFocus() {
    const {tags, queryBrands} = this.props;
    queryBrands();
  }

  // 商品类型获取
  handleGoodsAttrFocus() {
    const {tags, queryGoodsTypes} = this.props;
    const {goodsTypes} = tags;
    queryGoodsTypes();
  }

  // 往来单位类型
  handleUnitTypeslFocus() {
    const {tags, queryUnitTypes} = this.props;
    const {unitTypes} = tags;
    queryUnitTypes();
  }

  // 获取产品组下拉框的所有选项
  handleGroupFocus() {
    const {getGroup, tags} = this.props;
    const {goodsGroup} = tags;
    getGroup();
  }

  handleGroupChange(ids) {
    const groupIDS = ids.join(',');
    const {getSeries, form} = this.props;
    this.setState({serieShow: !groupIDS});
    form.resetFields(['goodsSeriesId']);
    getSeries(groupIDS);
  }

  // 大渠道
  handleGoodsChannelFocus() {
    const {getChannel, tags} = this.props;
    const {goodsChannel} = tags;
    getChannel();
  }

  handleGoodsChannelChange(value) {
    const {querySummaryChannel, form} = this.props;
    form.resetFields(['hzChannelCode', 'xqdChannelCode']);
    querySummaryChannel(value);
  }

  // 汇总渠道改变更新小渠道的值
  handleSummaryChannelChange(value) {
    const {getSmallChannel, form} = this.props;
    form.resetFields(['xqdChannelCode']);
    getSmallChannel(value);
  }

  // 获取分中心下拉框的所有选项
  handleBranchFocus() {
    const {tags, getBranches} = this.props;
    const {branchs} = tags;
    getBranches();
  }

  // 改变小微下拉框的状态
  changeState(value) {
    const {getCompany, form} = this.props;
    form.resetFields(['companyCode']);
    getCompany(value);
  }

  toggle(e) {
    e.preventDefault();
    const {expand} = this.state;
    this.setState({
      expand: !expand,
    });
  }

  render() {
    const {saledetail, tags, form} = this.props;
    const {
      branchs, companies, brands, goodsGroup, unitTypes,
      goodsChannel, summaryChannel, smallChannel, goodsSeries,
    } = tags;
    const {pagination, expand, serieShow} = this.state;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
    pagination.total = saledetail.total || 0;
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
                    {getFieldDecorator('branchCode', {
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
                    {getFieldDecorator('companyCode')(
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
                    label="主经销商编码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('dealerParentCode')(
                        <Input
                          type="text"
                          placeholder="请输入经销商代码"
                        />)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="主经销商名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('dealerParentName')(
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
                <Col sm={6}>
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
                <Col sm={6}>
                  <FormItem
                    label="门店名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('shopName')(
                        <Input
                          type="text"
                          placeholder="请输入门店名称"
                        />)
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
                <Col sm={6}>
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
                    label="客户视图"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('custView')(
                        <Select
                          placeholder="请选择客户视图"
                        >
                          <Option key="0" value="—">全部</Option>
                          <Option key="1" value="1">MCD店客户</Option>
                          <Option key="2" value="2">会长客户</Option>
                          <Option key="3" value="3">RMP粉丝转化</Option>
                        </Select>,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="出货仓库"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('storageName')(
                        <Input
                          type="text"
                          placeholder="请输入出货仓库"
                        />)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="往来单位类型"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('partnerType')(
                        <Select
                          multiple
                          onFocus={this.handleUnitTypeslFocus}
                          placeholder="请选择往来单位类型"
                        >
                          {
                            unitTypes.data.map(unitType =>
                              <Option
                                key={unitType.key} value={unitType.key}
                              >{unitType.value}</Option>)
                          }
                        </Select>)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="往来单位名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('partnerName')(
                        <Input
                          type="text"
                          placeholder="请输入往来单位名称"
                        />)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="商品类型"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('goodsAttribute')(
                        <Select
                          placeholder="请选择商品类型"
                        >
                          <Option key="goodsAttribute" value="-">全部</Option>
                          <Option key="goodsAttribute0" value="0">正品</Option>
                          <Option key="goodsAttribute1" value="1">样品</Option>
                          <Option key="goodsAttribute2" value="2">不良品</Option>
                          <Option key="goodsAttribute3" value="3">礼品</Option>
                        </Select>)
                    }
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
                <Col sm={6}>
                  <FormItem
                    label="开始时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('rangeStart', {initialValue: moment().startOf('month')})(
                      <DatePicker
                        format="YYYY-MM-DD"
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
                        format="YYYY-MM-DD"
                        disabledDate={(currentDate) => {
                          const rangeStart = getFieldValue('rangeStart');
                          return currentDate.isAfter(moment()) || currentDate.isBefore(rangeStart);
                        }}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row gutter={16}>
              <Col span={12} offset={12} className="text-right">
                <Popover placement="left" content={content} title="报表说明" trigger="click">
                  <Button icon="info-circle" className="margin-right-10">报表说明</Button>
                </Popover>
                <Authority permission="exportPagingSales">
                  <ExportButton
                    url="/api/impala/reports/export-paging-sales"
                    params={this.check()}
                    progressUrl="api/impala/reports/export-paging-sales-async"
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
                  loading={saledetail.fetching}
                >查 询</Button>
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
            columns={columns}
            pagination={false}
            scroll={{x: 4600}}
            dataSource={saledetail.data}
            loading={saledetail.fetching}
          />
          {
            !!saledetail.total && <div style={{float: 'right', marginTop: 12, marginBottom: 12}}>
              <Pagination
                current={pagination.current}
                onChange={this.handleTableChange}
                onShowSizeChange={this.handleTablePageSizeChange}
                showSizeChanger
                showQuickJumper
                pageSize={pagination.pageSize}
                total={saledetail.total}
                showTotal={() => `一共 ${saledetail.total} 条`}
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
  saledetail: PropTypes.object,
  tags: PropTypes.object,
  query: PropTypes.func,
  queryDetailSummary: PropTypes.func,
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
  query: param => getSaleDetail(param),
  queryDetailSummary: param => getSaleDetailSummary(param),
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
  saledetail: state.saledetail,
  tags: state.tags,
});

SalesDetails = Form.create()(SalesDetails);

export default connect(mapStateTopProps, mapDispatchToProps)(SalesDetails);

