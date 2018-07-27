import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import zhCN from 'antd/lib/date-picker/locale/zh_CN';
import { Form, Table, Button, Row, Col, Card, DatePicker, Select, Radio, Icon } from 'antd';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import moment from 'moment';
import { getBranch, queryCompanies, getGoodsGroup } from 'store/tags';
import { queryBestSell } from './containers';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class BestSell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showTotal: total => `一共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      companyShow: true,
      expand: false,
      weeks: [],
    };
    // 表单提交
    this.submit = this.submit.bind(this);
    // 重置表单
    this.reset = this.reset.bind(this);
    // 表单导出前的校验
    this.check = this.check.bind(this);
    // 获取产品组下拉框的所有选项
    this.handleGroupFocus = this.handleGroupFocus.bind(this);
    // 获取分中心下拉框的所有选项
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    // 改变小微下拉框的状态
    this.changeState = this.changeState.bind(this);
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
  // 表单提交
  submit(e) {
    e.preventDefault();
    const { query } = this.props;
    const values = this.filterWeek() || {};
    this.setState({
      expand: true,
    });
    query(values);
  }
  // 重置表单
  reset() {
    const { form } = this.props;
    form.resetFields();
    this.setState({ companyShow: true });
  }
  // 表单导出前校验
  check() {
    const values = this.filterWeek() || {};
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

  // 获取产品组下拉框的所有选项
  handleGroupFocus() {
    const { queryGoodsGroup } = this.props;
    queryGoodsGroup();
  }

  // 改变小微下拉框的状态
  changeState(value) {
    const { queryCompany, form } = this.props;
    this.setState({ companyShow: false });
    form.resetFields(['companyCode']);
    queryCompany(value);
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
    values.pageNo = current;
    values.pageSize = pageSize;
    query(values);
  }

  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({
      expand: !expand,
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

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rangeItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const { form, bestSell, tags } = this.props;
    const { branchs, companies, goodsGroup } = tags;
    const { companyShow, pagination, expand, weeks } = this.state;
    const { getFieldDecorator } = form;
    const { result, column } = bestSell;
    pagination.total = result.total || 0;
    return (
      <div>
        <Card>
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
                        onFocus={this.handleBranchFocus}
                        onChange={this.changeState}
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
                    label="小 微"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('companyCode')(
                      <Select
                        placeholder="请选择小微"
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
                    label="产品组"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsGroupId')(
                      <Select
                        multiple
                        placeholder="请选择产品组"
                        onFocus={this.handleGroupFocus}
                      >
                        {
                          goodsGroup.data.map(ele =>
                            <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
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
                    {getFieldDecorator('size', { initialValue: 100 })(
                      <RadioGroup>
                        <Radio value={100}>100</Radio>
                        <Radio value={200}>200</Radio>
                        <Radio value={500}>500</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={2}></Col>
                <Col sm={6}>
                  <FormItem
                    label="销售维度"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('saleDimension')(
                      <Select
                        placeholder="请选择销售维度"
                      >
                        <Option key="country" value={undefined}>全国</Option>
                        <Option key="branch" value="branch">分中心</Option>
                        <Option key="branch_company" value="branch_company">分中心,小微</Option>
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
                <Authority permission="export">
                  <ExportButton url="/api/impala/bestselling/export" getParamas={this.check} />
                </Authority>
                <Button className="margin-right-10" onClick={this.reset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={bestSell.fetching}>查 询</Button>
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
            loading={bestSell.fetching}
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

BestSell.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  tags: PropTypes.object,
  bestSell: PropTypes.object,
  queryBranch: PropTypes.func,
  queryCompany: PropTypes.func,
  queryGoodsGroup: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => queryBestSell(param),
  queryBranch: () => getBranch(),
  queryCompany: param => queryCompanies(param),
  queryGoodsGroup: () => getGoodsGroup(),
};

const mapStateTopProps = state => ({
  bestSell: state.bestSell,
  tags: state.tags,
});

BestSell = Form.create()(BestSell);

export default connect(mapStateTopProps, mapDispatchToProps)(BestSell);
