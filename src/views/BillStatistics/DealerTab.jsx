import React, { Component, PropTypes } from 'react';
import { Card, Table, Form, Button, Row, Col, Select, Input, DatePicker } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import { queryBillStatistics, queryBranches, queryCompanies } from './containers';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;


class DealerTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      pagination: {},
    };
    // 表单提交
    this.submit = this.submit.bind(this);
    // 重置表单
    this.reset = this.reset.bind(this);
    // 表单导出前的校验
    this.check = this.check.bind(this);
    // 获取分中心下拉框的所有选项
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    // 改变小微编码下拉框的状态
    this.changeState = this.changeState.bind(this);
  }

  submit(e) {
    e.preventDefault();
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { range } = fieldsValues;
    delete fieldsValues.range;
    const values = {
      ...fieldsValues,
      startAt: moment(range[0]).format('YYYY-MM-DD'),
      endAt: moment(range[1]).format('YYYY-MM-DD'),
    };
    query(values);
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
    const { form, query } = this.props;
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
    values.pageNo = current;
    values.pageSize = 10;
    query(values);
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
    const { form, billStatistics } = this.props;
    const { dealers, allBranches, allCompanies } = billStatistics;
    const { show } = this.state;
    const { getFieldDecorator } = form;
    const pagination = {
      total: dealers.total || 0,
    };
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
      render: text => text || '无',
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
    }, {
      title: '操作',
      dataIndex: 'operate',
      width: 100,
      fixed: 'right',
      render: (text, record) =>
        <Button
          type="primary"
          onClick={() => this.props.changeTab('2', record.dealer_code)}
        >
        查看经销商产品
        </Button>,
    }];

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
                    <Select placeholder="请输入小微" disabled={show}>
                      {
                        allCompanies.data.map(company =>
                          <Option key={`${company.code}_${company.origin_id}`} value={company.code}>{company.name}</Option>
                        )
                      }
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="经销商代码"
                  {...formItemLayout}
                >
                  {getFieldDecorator('dealerCode')(
                    <Input type="text" placeholder="请填写经销商代码" />,
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
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} offset={12} className="text-right">
                <Authority permission="exportBlStatistics">
                  <ExportButton url="/api/export/bl-statistics" onClick={this.check} />
                </Authority>
                <Button className="margin-right-10" onClick={this.reset}>取 消</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={dealers.fetching}
                > 搜 索
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Table
            scroll={{ x: 1900 }}
            columns={COLUMNS}
            dataSource={dealers.data}
            loading={dealers.fetching}
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

DealerTab.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  billStatistics: PropTypes.object,
  getBranches: PropTypes.func,
  getCompany: PropTypes.func,
  changeTab: PropTypes.func,
};

DealerTab = Form.create()(DealerTab);

const mapDispatchToProps = {
  query: param => queryBillStatistics(param),
  getBranches: () => queryBranches(),
  getCompany: param => queryCompanies(param),
};

const mapStateToProps = state => ({
  billStatistics: state.billStatistics,
});

export default connect(mapStateToProps, mapDispatchToProps)(DealerTab);

