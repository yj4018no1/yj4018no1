import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Echarts from 'components/Echarts';
import { Card, Form, Col, Badge, Input, Row, Select, Button, notification } from 'antd';
import { formatPrice, formatCount } from 'store/util';
import { getPortrayal } from './containers';
import { initOptionCount, initOptionAmount, initOptionRadar, judgeIndex } from './options';

const FormItem = Form.Item;
const Option = Select.Option;

class Portrayal extends Component {
  constructor(props) {
    super(props);
    // 表单提交
    this.handleSubmit = this.handleSubmit.bind(this);
    // 重置表单
    this.handleReset = this.handleReset.bind(this);
  }
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const fieldsValues = this.props.form.getFieldsValue();
    const { dealerCode, dealerName } = fieldsValues;
    if (dealerCode || dealerName) {
      const { query } = this.props;
      query(fieldsValues);
    } else {
      notification.warning({
        message: '警告',
        description: '请输入经销商编码或者名称',
      });
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { form, portrayal } = this.props;
    const { getFieldDecorator } = form;
    const { counts, amounts, regionDealerPortrait, singleDealerPortrait } = portrayal;
    const single = singleDealerPortrait || {};
    const optionRadar = initOptionRadar('radar', regionDealerPortrait, singleDealerPortrait);
    const optionSecond = initOptionCount('line', counts);
    const optionThird = initOptionAmount('line', amounts);
    return (
      <div>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col sm={6}>
                <FormItem
                  label="经销商编码"
                  {...formItemLayout}
                >
                  {getFieldDecorator('dealerCode')(
                    <Input type="text" placeholder="请输入经销商编码" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="经销商名称"
                  {...formItemLayout}
                >
                  {getFieldDecorator('dealerName')(
                    <Input type="text" placeholder="请输入经销商名称" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="年份"
                  {...formItemLayout}
                >
                  {getFieldDecorator('year', { initialValue: '2017' })(
                    <Select
                      placeholder="请选择年份"
                    >
                      <Option value="2013">2013</Option>
                      <Option value="2014">2014</Option>
                      <Option value="2015">2015</Option>
                      <Option value="2016">2016</Option>
                      <Option value="2017">2017</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6} className="text-right">
                <Button
                  onClick={this.handleReset}
                  icon="close"
                  className="margin-right-10"
                >清 空</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  loading={portrayal.fetching}
                >查 询</Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card loading={false}>
          <Col span={12}>
            <Echarts
              type="radar"
              options={optionRadar}
              loading={false}
              height="450px"
            />
          </Col>
          <Col span={12}>
            <Form className="login-form">
              <FormItem
                label="销售量"
                {...formItemLayout}
              >
                {getFieldDecorator('saleQuantity')(
                  <div>
                    <span>{formatCount(single.saleQuantity)}</span>
                    <span> 台 </span>
                  </div>,
                )}
              </FormItem>
              <FormItem
                label="销售金额"
                {...formItemLayout}
              >
                {getFieldDecorator('saleFee')(
                  <div>
                    <span>{formatPrice(single.saleFee, 10000, 2)}</span>
                    <span> 万元 </span>
                  </div>,
                )}
              </FormItem>
              <FormItem
                label="进货量"
                {...formItemLayout}
              >
                {getFieldDecorator('purchaseQuantity')(
                  <div>
                    <span>{formatCount(single.purchaseQuantity)}</span>
                    <span> 台 </span>
                  </div>,
                )}
              </FormItem>
              <FormItem
                label="进货金额"
                {...formItemLayout}
              >
                {getFieldDecorator('purchaseFee')(
                  <div>
                    <span>{formatPrice(single.purchaseFee, 10000, 2)}</span>
                    <span> 万元 </span>
                  </div>,
                )}
              </FormItem>
              <FormItem
                label="库存量"
                {...formItemLayout}
              >
                {getFieldDecorator('storageQuantity')(
                  <div>
                    <span>{formatCount(judgeIndex(single, 'storageQuantity'))}</span>
                    <span> 台 </span>
                  </div>,
                )}
              </FormItem>
              <FormItem
                label="库存金额"
                {...formItemLayout}
              >
                {getFieldDecorator('storageFee')(
                  <div>
                    <span>{formatPrice(single.storageFee, 10000, 2)}</span>
                    <span> 万元 </span>
                  </div>,

                )}
              </FormItem>
              <FormItem
                label="周转天数(金额）"
                {...formItemLayout}
              >
                {getFieldDecorator('turnoverDays')(
                  <span>{formatCount(judgeIndex(single, 'turnoverDays'))}</span>,
                )}
              </FormItem>
              <FormItem
                label="平均库龄"
                {...formItemLayout}
              >
                {getFieldDecorator('stockAge')(
                  <span>{formatCount(judgeIndex(single, 'stockAge'))}</span>,
                )}
              </FormItem>
            </Form>
          </Col>
        </Card>
        <Card loading={false}>
          <Col span={12} style={{ fontSize: '14px' }}>经销商进销存数量月度统计趋势图</Col>
          <Col span={12} className="text-right" style={{ fontSize: '12px', color: '#999' }}>
            <Badge status="error" className="margin-right-10" text="进货总数量" />
            <Badge status="warning" className="margin-right-10" text="销售总数量" />
            <Badge status="success" text="库存总数量" />
          </Col>
          <Col span={24}>
            <Echarts
              type="line"
              options={optionSecond}
              height="330px"
              loading={false}
            />
          </Col>
        </Card>
        <Card loading={false}>
          <Col span={12} style={{ fontSize: '14px' }}>经销商进销存金额月度统计趋势图</Col>
          <Col span={12} className="text-right" style={{ fontSize: '12px', color: '#999' }}>
            <Badge status="error" className="margin-right-10" text="进货总金额" />
            <Badge status="warning" className="margin-right-10" text="销售总金额" />
            <Badge status="success" text="库存总金额" />
          </Col>
          <Col span={24}>
            <Echarts
              type="line"
              options={optionThird}
              height="300px"
              loading={false}
            />
          </Col>
        </Card>
      </div>
    );
  }
}

Portrayal.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  portrayal: PropTypes.object,
};
const mapDispatchToProps = {
  query: param => getPortrayal(param),
};
const mapStateTopProps = state => ({
  portrayal: state.portrayal,
});
Portrayal = Form.create()(Portrayal);
export default connect(mapStateTopProps, mapDispatchToProps)(Portrayal);
