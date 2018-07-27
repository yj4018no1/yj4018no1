import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Row, Col, Button, Card, Table, Select, Icon } from 'antd';
import ExportButton from 'components/ExportButton';
import Authority from 'components/Authority';
import { getBrands, getGoodsGroup, queryGoodsSeries } from 'store/tags';
import { queryGoods } from './containers';

const FormItem = Form.Item;
const Option = Select.Option;
const FILTERS = {
  0: '无效',
  1: '正常',
  2: '冻结',
};
const SALEPROP = {
  1: '内生内销',
  2: '内生外销',
  3: '外生内销',
  4: '外生外销',
};

// 表头
const columns = [{
  title: '数据源',
  dataIndex: 'comeFromName',
  fixed: 'left',
  width: 100,
  render: text => text || '无',
}, {
  title: '品牌',
  dataIndex: 'brand',
  fixed: 'left',
  width: 100,
  render: text => text || '无',
}, {
  title: '产品组',
  dataIndex: 'prdGrpDesc',
  render: text => text || '无',
}, {
  title: '产品系列',
  dataIndex: 'prdSeriesDesc',
  render: text => text || '无',
}, {
  title: '单位',
  dataIndex: 'unit',
  render: text => text || '无',
}, {
  title: '商品编码',
  dataIndex: 'code',
  render: text => text || '无',
}, {
  title: '商品名称',
  dataIndex: 'name',
  render: text => text || '无',
}, {
  title: '是否有效',
  dataIndex: 'activeFlag',
  render: text => FILTERS[text] || '无',
}, {
  title: '销售特征',
  dataIndex: 'saleProp',
  render: text => SALEPROP[text] || '--',
}];

class Goods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showTotal: total => `一共 ${total} 条`,
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
    // 获取产品组下拉框的所有选项
    this.handleGoodsGroupFocus = this.handleGoodsGroupFocus.bind(this);
    // 获取产品系列下拉框的所有选项
    this.changeGoodsSeries = this.changeGoodsSeries.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { goodsGroupId } = fieldsValues;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
    };
    query(values);
    this.setState({
      expand: true,
    });
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      serieShow: true,
    });
  }

  check() {
    const { form } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { goodsGroupId } = fieldsValues;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      goodsGroupId: goodsGroupId && goodsGroupId.join(','),
    };
    return values;
  }

  // 获取品牌下拉框的值
  handleBrandFocus() {
    const { queryBrand } = this.props;
    const comeFrom = this.props.form.getFieldValue('comeFrom');
    queryBrand({ comeFrom }, comeFrom ? false : true);
  }

  // 获取产品组下拉框的所有值
  handleGoodsGroupFocus() {
    const { queryGoodsGroup } = this.props;
    const comeFrom = this.props.form.getFieldValue('comeFrom');
    queryGoodsGroup({ comeFrom }, comeFrom ? false : true);
  }
  // 改变产品系列下拉框的状态
  changeGoodsSeries(value) {
    const groupIDS = value.join(',');
    const { queryGoodSeries, form } = this.props;
    const comeFrom = form.getFieldValue('comeFrom');
    this.setState({ serieShow: !groupIDS });
    form.resetFields(['goodsSeriesId']);
    queryGoodSeries(groupIDS, comeFrom);
  }

  // 分页事件
  handleTableChange(pagination) {
    const { current, pageSize } = pagination;
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    this.setState({
      pagination: {
        current,
        pageSize,
      },
    });
    fieldsValues.pageNo = current;
    fieldsValues.pageSize = pageSize;
    query(fieldsValues);
  }
  // 数据源转变
  clearInput = () => {
    const { form } = this.props;
    form.setFieldsValue({ goodsGroupId: [] });
    form.setFieldsValue({ brandCode: undefined });
    form.setFieldsValue({ goodsSeriesId: undefined });
    this.setState({ serieShow: true })
  }
  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { goods, form, tags } = this.props;
    const { brands, goodsGroup, goodsSeries } = tags;
    const { serieShow, pagination, expand } = this.state;
    const { getFieldDecorator } = form;
    pagination.total = goods.total || 0;
    return (
      <div>
        <Card>
          <Form horizontal onSubmit={this.handleSubmit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
                <Col sm={6}>
                  <FormItem
                    label="商品编码"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsCode')(
                      <Input type="text" placeholder="请填写商品编码" />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="商品名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('goodsName')(
                      <Input type="text" placeholder="请填写商品名称" />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="数据源"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('comeFrom')(
                      <Select placeholder="请选择数据源" onChange={this.clearInput}>
                        <Option value="10">海尔</Option>
                        <Option value="20">日日顺</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="是否有效"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('activeFlag')(
                      <Select placeholder="请选择">
                        <Option value="1">有效</Option>
                        <Option value="2">冻结</Option>
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
                        onFocus={this.handleGoodsGroupFocus}
                        onChange={this.changeGoodsSeries}
                        placeholder="请选择产品组"
                      >
                        {goodsGroup.data.map(ele =>
                          <Option key={ele.key} value={ele.key}>{ele.value}</Option>,
                        )}
                      </Select>,
                    ) }
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
                    ) }
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
                <Authority permission="exportMdGoods">
                  <ExportButton url="/api/export/md-goods" getParamas={this.check} />
                </Authority>
                <Button className="margin-right-10" onClick={this.handleReset}>清 空</Button>
                <Button type="primary" htmlType="submit" loading={goods.fetching}>查 询</Button>
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

Goods.propTypes = {
  form: PropTypes.object,
  tags: PropTypes.object,
  query: PropTypes.func,
  goods: PropTypes.object,
  queryBrand: PropTypes.func,
  queryGoodsGroup: PropTypes.func,
  queryGoodSeries: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => queryGoods(param),
  queryBrand: (param, clear) => getBrands(param, clear),
  queryGoodsGroup: (param, clear) => getGoodsGroup(param, clear),
  queryGoodSeries: (param, comeFrom) => queryGoodsSeries(param, comeFrom),
};

const mapStateTopProps = state => ({
  goods: state.goods,
  tags: state.tags,
});

// 将 form 绑定到组件上
Goods = Form.create()(Goods);

export default connect(mapStateTopProps, mapDispatchToProps)(Goods);
