import React, { Component, PropTypes } from 'react';
import { Card, Table, Form, Button, Row, Col, Input, Select, DatePicker } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import { getBillGoods, queryBranches, queryCompanies, queryGoodBrands, queryGoodGroup, queryGoodSeries } from './containers';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const COLUMNS = [{
  title: '分中心编码 ',
  dataIndex: 'branch_code',
  width: 100,
  fixed: 'left',
  render: text => text || '无',
}, {
  title: '分中心',
  dataIndex: 'branch_name',
  width: 100,
  fixed: 'left',
}, {
  title: '小微编码',
  dataIndex: 'company_code',
  render: text => text || '无',
}, {
  title: '小微名称',
  dataIndex: 'company_name',
  render: text => text || '无',
}, {
  title: '主经销商编码',
  dataIndex: 'dealer_parent_code',
  render: text => text || '无',
}, {
  title: '经销商编码',
  dataIndex: 'dealer_code',
  render: text => text || '无',
}, {
  title: '经销商名称',
  dataIndex: 'dealer_name',
  render: text => text || '无',
}, {
  title: '源品牌id',
  dataIndex: 'origin_brand_id',
  render: text => text || '无',
}, {
  title: '品牌名称',
  dataIndex: 'brand_name',
  render: text => text || '无',
}, {
  title: '产品组',
  dataIndex: 'goods_group',
  render: text => text || '无',
}, {
  title: '产品系列',
  dataIndex: 'goods_series',
  render: text => text || '无',
}, {
  title: '商品编码',
  dataIndex: 'goods_code',
  render: text => text || '无',
}, {
  title: '商品名称',
  dataIndex: 'goods_name',
  render: text => text || '无',
}, {
  title: '数量',
  dataIndex: 'quantity',
  render: text => text || '无',
}, {
  title: '金额',
  dataIndex: 'fee',
  render: text => text || '无',
}, {
  title: '提单数量',
  dataIndex: 'order_quantity',
  render: text => text || '无',
}, {
  title: '提单金额',
  dataIndex: 'order_fee',
  render: text => text || '无',
}, {
  title: '自行入库数量',
  dataIndex: 'own_quantity',
  render: text => text || '无',
}, {
  title: '自行入库金额',
  dataIndex: 'own_fee',
  render: text => text || '无',
}, {
  title: '报溢数量',
  dataIndex: 'over_quantity',
  render: text => text || '无',
}, {
  title: '报溢金额',
  dataIndex: 'over_fee',
  render: text => text || '无',
}, {
  title: '其他入库数量 ',
  dataIndex: 'other_quantity',
  render: text => text || '无',
}, {
  title: '其他入库金额',
  dataIndex: 'other_fee',
  render: text => text || '无',
}, {
  title: '汇总时间',
  dataIndex: 'summary_date',
  render: (text, record) =>
    <span>
      {record.summary_date ? moment(record.summary_date).format('YYYY/MM/DD') : ''}
    </span>,
}];

class GoodsTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      show: true,
    };
    // 表单提交
    this.submit = this.submit.bind(this);
    // 重置表单
    this.reset = this.reset.bind(this);
    // 表单导出前的校验
    this.check = this.check.bind(this);
    // 获取源品牌下拉框的所有选项
    this.handleBrandFocus = this.handleBrandFocus.bind(this);
    // 获取产品组下拉框的所有选项
    this.handleGroupFocus = this.handleGroupFocus.bind(this);
    // 获取产品系列下拉框的所有选项
    this.handleSerieFocus = this.handleSerieFocus.bind(this);
    // 获取分中心下拉框的所有选项
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    // 改变小微编码下拉框的状态
    this.changeState = this.changeState.bind(this);
  }

  submit(e) {
    e.preventDefault();
    const { form, queryGoods } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { range } = fieldsValues;
    delete fieldsValues.range;
    const values = {
      ...fieldsValues,
      startAt: moment(range[0]).format('YYYY-MM-DD'),
      endAt: moment(range[1]).format('YYYY-MM-DD'),
    };
    queryGoods(values);
  }

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({ show: true });
  }

  check(exportValues) {
    const fieldsValues = this.props.form.getFieldsValue();
    const { range } = fieldsValues;
    delete fieldsValues.range;
    const values = {
      ...fieldsValues,
      startAt: moment(range[0]).format('YYYY-MM-DD'),
      endAt: moment(range[1]).format('YYYY-MM-DD'),
    };
    exportValues(values);
  }

  handleBrandFocus() {
    const { getBrands } = this.props;
    getBrands();
  }

  handleGroupFocus() {
    const { getGroup } = this.props;
    getGroup();
  }

  handleSerieFocus() {
    const { getSeries } = this.props;
    getSeries();
  }

  handleBranchFocus() {
    const { getBranches } = this.props;
    getBranches();
  }

  changeState(value) {
    const callback = (ele) => {
      if (ele.code === value) {
        return value;
      }
      return false;
    };
    const { getCompany, billStatistics } = this.props;
    const { allBranches } = billStatistics;
    this.setState({ show: false });
    const arr = allBranches.data;
    const result = arr.filter(callback) || '';
    getCompany({ branchId: result[0].origin_id });
  }

  // 分页事件
  handleTableChange(pagination) {
    const { current, pageSize } = pagination;
    const { billStatistics, form, queryGoods } = this.props;
    const { goods } = billStatistics;
    const fieldsValues = form.getFieldsValue();
    const { range } = fieldsValues;
    delete fieldsValues.range;
    const values = {
      ...fieldsValues,
      startAt: moment(range[0]).format('YYYY-MM-DD'),
      endAt: moment(range[1]).format('YYYY-MM-DD'),
    };
    this.setState({
      pagination: {
        current,
        pageSize,
      },
    });
    const page = goods.data.nextPage;
    queryGoods({
      page,
      pageSize,
      values,
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const dateItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    const { form, code, billStatistics } = this.props;
    const { show } = this.state;
    const { goods, allBranches, allCompanies, allBrands, allGroups, allSeries } = billStatistics;
    const { getFieldDecorator } = form;
    const initialValue = code && { initialValue: code };
    const pagination = {
      total: goods.total || 0,
    };
    return (
      <div>
        <Card>
          <Form horizontal onSubmit={this.submit}>
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
                      {
                        allBranches.data.map(branch =>
                          <Option key={`${branch.code}_${branch.origin_id}`} value={branch.code}>{branch.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="小微"
                  {...formItemLayout}
                >
                  {getFieldDecorator('companyCode')(
                    <Select placeholder="请输入小微" disabled={show}>
                      {
                        allCompanies.data.map(company =>
                          <Option key={`${company.code}_${company.origin_id}`} value={company.code}>{company.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="经销商代码"
                  {...formItemLayout}
                >
                  {getFieldDecorator('dealerCode', initialValue || {})(
                    <Input type="text" placeholder="请输入经销商代码" />
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="品牌"
                  {...formItemLayout}
                >
                  {getFieldDecorator('originBrandId')(
                    <Select
                      onFocus={this.handleBrandFocus}
                      placeholder="请选择品牌"
                    >
                      {
                        allBrands.data.map(brand =>
                          <Option key={`${brand.origin_id}_${brand.code}`} value={brand.code}>{brand.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col sm={6}>
                <FormItem
                  label="产品组"
                  {...formItemLayout}
                >
                  {getFieldDecorator('goodsGroup')(
                    <Select
                      placeholder="请选择产品组"
                      onFocus={this.handleGroupFocus}
                    >
                      {
                        allGroups.data.map(group =>
                          <Option key={`${group.origin_id}_${group.code}`} value={group.code}>{group.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="产品系列"
                  {...formItemLayout}
                >
                  {getFieldDecorator('goodsSeries')(
                    <Select
                      placeholder="请选择产品系列"
                      onFocus={this.handleSerieFocus}
                    >
                      {
                        allSeries.data.map(serie =>
                          <Option key={`${serie.origin_id}_${serie.code}`} value={serie.code}>{serie.name}</Option>
                        )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="商品编码"
                  {...formItemLayout}
                >
                  {getFieldDecorator('goodsCode')(
                    <Input type="text" placeholder="请输入商品编码" />
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                  label="起止时间"
                  {...dateItemLayout}
                >
                  {getFieldDecorator('range', { initialValue: [moment(), moment()] })(
                    <RangePicker
                      format="YYYY-MM-DD"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} offset={12} className="text-right">
                <Authority permission="exportBlStatisticsGoods">
                  <ExportButton url="/api/export/bl-statistics-goods" onClick={this.check} />
                </Authority>
                <Button className="margin-right-10" onClick={this.reset}>取 消</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={goods.fetching}
                > 搜 索
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Table
            scroll={{ x: 2400 }}
            columns={COLUMNS}
            dataSource={goods.data}
            loading={goods.fetching}
            pagination={pagination}
            onChange={
              (paginations) => {
                this.handleTableChange(paginations);
              }
            }
          />
        </Card>
      </div>
    );
  }
}

GoodsTab.propTypes = {
  form: PropTypes.object,
  queryGoods: PropTypes.func,
  billStatistics: PropTypes.object,
  code: PropTypes.string,
  getBranches: PropTypes.func,
  getCompany: PropTypes.func,
  getBrands: PropTypes.func,
  getGroup: PropTypes.func,
  getSeries: PropTypes.func,
};

GoodsTab = Form.create()(GoodsTab);

const mapDispatchToProps = {
  queryGoods: param => getBillGoods(param),
  getBrands: () => queryGoodBrands(),
  getGroup: () => queryGoodGroup(),
  getSeries: () => queryGoodSeries(),
  getBranches: () => queryBranches(),
  getCompany: param => queryCompanies(param),
};

const mapStateTopProps = state => ({
  billStatistics: state.billStatistics,
});

export default connect(mapStateTopProps, mapDispatchToProps)(GoodsTab);

