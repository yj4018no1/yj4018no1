import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import { Form, Radio, Icon, Select, Row, Col, Button, Card, Table, DatePicker } from 'antd';
import moment from 'moment';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import { queryCompanies, getBranch, getGoodsGroup } from 'store/tags';
import { queryUnsale } from './containers';
import './Unsale.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const PAGE = {
  current: 1,
  pageSize: 10,
};

class Unsale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        ...PAGE,
      },
      show: true,
      expand: false,
      weeks: [],
    };
    // 表单提交
    this.submit = this.submit.bind(this);
    // 重置表单
    this.reset = this.reset.bind(this);
    // 表单导出前的校验
    this.check = this.check.bind(this);
    // 获取分中心下拉框的所有选项
    this.handleFocus = this.handleFocus.bind(this);
    // 改变小微下拉框的状态
    this.changeState = this.changeState.bind(this);
    // 展开搜索
    this.toggle = this.toggle.bind(this);
    // 日期变化
    this.handleMonthChange = this.handleMonthChange.bind(this);
  }
  componentDidMount() {
    const { form } = this.props;
    this.handleMonthChange(form.getFieldValue('yearMonth'));
  }

  filterWeek() {
    const { form } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { week, goodsGroupId } = fieldsValues;
    delete fieldsValues.week;
    delete fieldsValues.goodsGroupId;
    delete fieldsValues.yearMonth;
    const callback = (ele) => {
      if (ele.start === week) {
        return ele;
      }
      return false;
    };
    const result = this.state.weeks.filter(callback) || [];
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
      startAt: result[0].start,
      endAt: result[0].final,
    };
    return values;
  }

  submit(event) {
    event.preventDefault();
    const values = this.filterWeek() || {};
    const { query } = this.props;
    query(values);
  }
  reset() {
    const { form } = this.props;
    form.resetFields();
    this.setState({ show: true });
  }

  check() {
    const values = this.filterWeek() || {};
    return values;
  }

   // 获取分中心下拉框的所有选项
  handleFocus(name) {
    const { getBranches, getCompany, getGroup } = this.props;
    switch (name) {
      case 'branch':
        getBranches();
        break;
      case 'group':
        getGroup();
        break;
      case 'company':
        getCompany(this.state.branchCode);
        break;
      default:
        break;
    }
  }
  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  }
  // 改变小微下拉框的状态
  changeState(value) {
    this.setState({
      show: false,
      branchCode: value,
    });
  }
  // 获取对应月份的自然周
  handleMonthChange(date) {
    this.props.form.resetFields(['week']);
    const weeks = [];
    const currentDate = moment(date).startOf('month');
    let startWeek = moment(currentDate).week();
    const finalWeek = moment(date).endOf('month').week();
    const dayOfWeek = currentDate.format('d');
    const weeksInYear = moment(currentDate).subtract(1, 'years').weeksInYear();
    if (startWeek === weeksInYear) {
      startWeek = 1;
    }
    for (let i = startWeek; i <= finalWeek; i++) {
      const tempVal = moment(date).startOf('month');
      const temp = tempVal.add((i - startWeek) * 7, 'days');
      const a = temp.subtract(dayOfWeek, 'days');
      const start = a.format('YYYY-MM-DD');
      const final = a.add(6, 'days').format('YYYY-MM-DD');
      const obj = {
        key: i,
        start,
        final,
      };
      weeks.push(obj);
      this.setState({
        weeks,
      });
    }
  }
  // 分页事件
  handleTableChange(pagination) {
    const { current, pageSize } = pagination;
    const { query } = this.props;
    const values = this.filterWeek() || {};
    this.setState({
      pagination: {
        current,
        pageSize,
      },
    });
    query(Object.assign({}, values, {pageNo: current, pageSize}));
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rangeItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const { form, tags, unsales } = this.props;
    const { branchs, companies, goodsGroup } = tags;
    const { column, result, fetching } = unsales;
    const { show, expand, weeks, pagination } = this.state;
    const { current, pageSize } = pagination;
    const { getFieldDecorator } = form;
    const pagination_ = {
      total: result.total || 0,
      showTotal: total => `一共 ${total} 条`,
      pageSize,
      current,
      showQuickJumper: true,
      showSizeChanger: true,
    };
    return (
      <div>
        <Card className="card-content">
          <Form horizontal onSubmit={this.submit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="年 月"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('yearMonth', { initialValue: moment() })(
                      <MonthPicker locale={zhCN} format="YYYY-MM" onChange={this.handleMonthChange} />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="分中心"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('branchCode')(
                      <Select
                        placeholder="请选择分中心"
                        onFocus={() => this.handleFocus('branch')}
                        onChange={this.changeState}
                      >
                        {
                          branchs.data.map(branch =>
                            <Option key={`${branch.key}`} value={branch.key}>{branch.value}</Option>,
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
                      <Select
                        placeholder="请选择小微"
                        disabled={show}
                        onFocus={() => this.handleFocus('company')}
                      >
                        {
                          companies.data.map(company =>
                            <Option key={`${company.key}`} value={company.key}>{company.value}</Option>,
                          )
                        }
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
                        multiple
                        placeholder="请选择产品组"
                        onFocus={() => this.handleFocus('group')}
                      >
                        {
                          goodsGroup.data.map(group =>
                            <Option key={`${group.key}`} value={group.key}>{group.value}</Option>,
                          )
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={8}>
                  <FormItem
                    label=" 周 "
                    {...rangeItemLayout}
                  >
                    {getFieldDecorator('week', { initialValue: weeks.length ? weeks[0].start : '' })(
                      <Select
                        onFocus={() => this.handleMonthChange(form.getFieldValue('yearMonth'))}
                      >
                        {
                          weeks.map(week =>
                            <Option key={`${week.key}${week.start}${week.final}`} value={week.start}>{`第${week.key}周(${week.start}-${week.final})`}</Option>,
                          )
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={8}>
                  <FormItem
                    label="查询范围"
                    {...rangeItemLayout}
                  >
                    {getFieldDecorator('count', { initialValue: '100' })(
                      <RadioGroup onChange={this.onChange}>
                        <Radio value="100">100</Radio>
                        <Radio value="200">200</Radio>
                        <Radio value="500">500</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}></Col>
                <Col span={6}>
                  <FormItem
                    label="销售维度"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('saleDimension')(
                      <Select
                        placeholder="请选择产品维度"
                      >
                        <Option value="null">全国</Option>
                        <Option value="branch">分中心</Option>
                        <Option value="branch_company">分中心，小微</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row gutter={16}>
              <Col
                span={24}
                className="text-right"
              >
                <Authority permission="exportUnsale">
                  <ExportButton url="/api/impala/reports/unsale/export" getParamas={this.check} />
                </Authority>
                <Button className="margin-right-10" onClick={this.reset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={fetching}>查 询</Button>
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
            columns={column}
            dataSource={result.data}
            loading={fetching}
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

Unsale.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  unsales: PropTypes.object,
  tags: PropTypes.object,
  getCompany: PropTypes.func,
  getBranches: PropTypes.func,
  getGroup: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => queryUnsale(param),
  getBranches: () => getBranch(),
  getCompany: param => queryCompanies(param),
  getGroup: () => getGoodsGroup(),
};

const mapStateToProps = state => ({
  unsales: state.unsale,
  tags: state.tags,
});

Unsale = Form.create()(Unsale);

export default connect(mapStateToProps, mapDispatchToProps)(Unsale);
