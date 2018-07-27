import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Table, Row, Col, Button, Card, Select, Icon } from 'antd';
import { queryCompanies, getBranch } from 'store/tags';
import { queryBilling } from './containers';

const FormItem = Form.Item;
const Option = Select.Option;
const COMEFROM = {
  10: '海尔',
  20: '日日顺',
};
const CTYPE = {
  p: '售达方',
  H: '送达方',
  Y: '付款方',
  X: '伞下店'
};

const columns = [{
  title: '数据源',
  dataIndex: 'comeFrom',
  render: text => COMEFROM[text] || '无',
}, {
  title: '分中心/分公司',
  dataIndex: 'branchName',
  render: text => text || '无',
}, {
  title: '小微',
  dataIndex: 'buName',
  render: text => text || '无',
}, {
  title: '客户编码',
  dataIndex: 'code',
  render: text => text || '无',
}, {
  title: '客户名称',
  dataIndex: 'name',
  render: text => text || '无',
}, {
  title: '客户类型',
  dataIndex: 'customerTypeName',
  // render: text => CTYPE[text] || '无',
}, {
  title: '状态',
  dataIndex: 'activeFlagName',
  render: text => text || '无',
}];
const PAGE = {
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
};

class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        ...PAGE,
      },
      disabled: true,
      expand: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.changeState = this.changeState.bind(this);
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleReset(e) {
    e.preventDefault();
    this.setState({ disabled: true });
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const values = {
      ...fieldsValues,
      pageNo: PAGE.current,
      pageSize: PAGE.pageSize,
    };
    query(values);
    this.setState({
      pagination: {
        ...PAGE,
      },
      expand: true,
    });
  }

  // 焦点事件
  handleBranchFocus(name) {
    const { queryBranch, queryCompany } = this.props;
    const comeFrom = this.props.form.getFieldValue('comeFrom');
    if (name === 'branchCode') {
      queryBranch({ comeFrom }, comeFrom ? false : true);
    } else if (name === 'buCode') {
      const fieldsValues = this.props.form.getFieldsValue();
      queryCompany(fieldsValues.branchCode);
    }
  }
  // changeState
  changeState() {
    this.setState({ disabled: false });
  }
  // 分页事件
  handleTableChange(pagination) {
    const { current, pageSize } = pagination;
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    query({
      pageNo: current,
      pageSize,
      ...fieldsValues,
    });
    this.setState({
      pagination: {
        current,
        pageSize,
      },
    });
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
    this.setState({ disabled: false });
    form.setFieldsValue({ branchCode: undefined });
    form.setFieldsValue({ buCode: undefined });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { billing, form, tags } = this.props;
    const { pagination, expand } = this.state;
    const { current, pageSize } = pagination;
    const { branchs, companies } = tags;
    const { getFieldDecorator } = form;
    const pagination_ = {
      total: billing.total || 0,
      showTotal: total => `一共 ${total} 条`,
      pageSize,
      current,
      showQuickJumper: true,
      showSizeChanger: true,
    };
    return (
      <div>
        <Card loading={false}>
          <Form horizontal onSubmit={this.handleSubmit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="数据源"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('comeFrom')(
                      <Select
                        placeholder="请选择数据源"
                        onChange={this.inputClear}
                      >
                        <Option value="">全部</Option>
                        <Option value="10">海尔</Option>
                        <Option value="20">日日顺</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="分中心/分公司"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('branchCode')(
                      <Select
                        onFocus={() => this.handleBranchFocus('branchCode')}
                        onChange={this.changeState}
                        dropdownMatchSelectWidth={false}
                        placeholder="请选择分中心"
                      >
                        {
                          branchs.data.map(branch =>
                            <Option key={`${branch.key}_${branch.value}`} value={branch.key}>{branch.value}</Option>,
                          )
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="小微/网格"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('buCode')(
                      <Select
                        onFocus={() => this.handleBranchFocus('buCode')}
                        onChange={this.changeState}
                        placeholder="请选择小微"
                        disabled={this.state.disabled}
                      >
                        {
                          companies.data.map(branch =>
                            <Option key={`${branch.key}_${branch.value}`} value={branch.key}>{branch.value}</Option>,
                          )
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="客户类型"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('customerType')(
                      <Select placeholder="请选择客户类型">
                        <Option value="">全部</Option>
                        <Option value="P">售达方</Option>
                        <Option value="H">送达方</Option>
                        <Option value="Y">付款方</Option>
                        <Option value="X">伞下店</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="客户编码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('code')(
                      <Input type="text" placeholder="请填写客户编码" />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="客户名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('name')(
                      <Input type="text" placeholder="请填写客户名称" />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="状态"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('activeFlag')(
                      <Select placeholder="请选择状态">
                        <Option value="">全部</Option>
                        <Option value="1">正常</Option>
                        <Option value="2">冻结</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row>
              <Col
                span={12}
                offset={12}
                className="text-right"
              >
                <Button className="margin-right-10" onClick={this.handleReset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={billing.fetching}>查 询</Button>
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
            columns={columns}
            dataSource={billing.data}
            loading={billing.fetching}
            pagination={pagination_}
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
Billing.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  billing: PropTypes.object,
  queryBranch: PropTypes.func,
  queryCompany: PropTypes.func,
  tags: PropTypes.object,
};

const mapDispatchToProps = {
  query: param => queryBilling(param),
  queryBranch: (param, clear) => getBranch(param, clear),
  queryCompany: param => queryCompanies(param),
};

const mapStateTopProps = state => ({
  billing: state.billing,
  tags: state.tags,
});

Billing = Form.create()(Billing);

export default connect(mapStateTopProps, mapDispatchToProps)(Billing);

