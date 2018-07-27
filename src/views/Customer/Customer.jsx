import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, Card, Form, Row, Col, Input, Button, Select, Tabs, Icon } from 'antd';
import { getBranch, queryCompanies, getGoodsGroup, queryGoodsChannel, getSummaryChannel, querySmallChannel } from 'store/tags';
import SenderTable from './SenderTable';
import WarehouseTable from './WarehouseTable';
import UmbrellaTable from './UmbrellaTable';
import PeerTable from './PeerTable';
import { queryArchive, getArchiveChildren, querySender, queryUmbrella, queryWarehouse, queryPeer } from './containers';

const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const columns = [
  {
    key: 'custCode',
    title: '经销商编码',
    dataIndex: 'custCode',
  }, {
    key: 'custName',
    title: '经销商名称',
    dataIndex: 'custName',
  }, {
    key: 'branchName',
    title: '分中心',
    dataIndex: 'branchName',
  }, {
    key: 'buName',
    title: '小 微',
    dataIndex: 'buName',
  }, {
    key: 'biChannelName',
    title: '大渠道',
    dataIndex: 'biChannelName',
  }, {
    key: 'cnChannelName',
    title: '汇总渠道',
    dataIndex: 'cnChannelName',
  }, {
    key: 'smChannelName',
    title: '小渠道',
    dataIndex: 'smChannelName',
  }, {
    key: 'shareFlag',
    title: '是否股权激励店',
    dataIndex: 'shareFlag',
  }, {
    key: 'legalOwner',
    title: '法人代表',
    dataIndex: 'legalOwner',
  }, {
    key: 'legalPhone',
    title: '联系电话',
    dataIndex: 'legalPhone',
  }, {
    key: 'contactAddr',
    title: '联系地址',
    dataIndex: 'contactAddr',
  },
];

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowId: '',
      expand: false,
      pagination: {
        showTotal: total => `一共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
      },
    };
    // 表单提交
    this.handleSubmit = this.handleSubmit.bind(this);
    // 重置表单
    this.handleReset = this.handleReset.bind(this);
    // 获取产品组下拉框的所有选项
    this.handleGroupFocus = this.handleGroupFocus.bind(this);
    // 获取大渠道下拉事件
    this.handleGoodsChannelFocus = this.handleGoodsChannelFocus.bind(this);
    // 汇总渠道改变更新小渠道
    this.handleSummaryChannelChange = this.handleSummaryChannelChange.bind(this);
    // 获取分中心下拉框的所有选项
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    // 改变小微下拉框的状态
    this.changeState = this.changeState.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  // 获取子级数据
  getArchiveChildren(expanded, record) {
    if (expanded) {
      const { key, rowId } = record;
      this.props.queryArchiveChildren(rowId, key);
    }
  }
  // 点击行触发数据更新
  rowClick(record) {
    const { form } = this.props;
    const prdGrpId = form.getFieldValue('prdGrpId') && form.getFieldValue('prdGrpId').join(',');
    const { custCode } = record;
    this.setState({ rowId: custCode });
    this.props.getSender({ custCode });
    this.props.getUmbrella({ custCode, type: 0, prdGrpId });
    this.props.getWarehouse({ custCode });
    this.props.getPeer({ custCode, type: 1, prdGrpId });
  }
  // 改变小微下拉框的状态
  changeState(value) {
    const { getCompany, form } = this.props;
    form.resetFields(['buCode']);
    getCompany(value);
  }
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({ show: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { prdGrpId } = fieldsValues;
    delete fieldsValues.goodsGroupId;
    const values = {
      ...fieldsValues,
      prdGrpId: prdGrpId && prdGrpId.join(','),
    };
    const { pagination } = this.state;
    this.setState({
      pagination: {
        current: 1,
        pageSize: 10,
      },
      expand: true,
    });
    const params = {
      ...values,
      ...pagination,
    };

    query(params);
  }

  // 分页事件
  handleTableChange(paginations) {
    const { current, pageSize } = paginations;
    const { form, query } = this.props;
    const fieldsValues = form.getFieldsValue();
    const { pagination } = this.state;
    const values = {
      ...fieldsValues,
      ...pagination,
    };
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

  // 获取产品组下拉框的所有选项
  handleGroupFocus() {
    const { getGroup } = this.props;
    getGroup();
  }

  // 大渠道
  handleGoodsChannelFocus() {
    const { getChannel, tags } = this.props;
    const { goodsChannel } = tags;
    // if (goodsChannel && !goodsChannel.data.length) {
    getChannel();
    // }
  }
  handleGoodsChannelChange(value) {
    const { querySummaryChannel, form } = this.props;
    form.resetFields(['cnChannelCode', 'smChannelCode']);
    querySummaryChannel(value);
  }
  // 汇总渠道改变更新小渠道的值
  handleSummaryChannelChange(value) {
    const { getSmallChannel, form } = this.props;
    form.resetFields(['smChannelCode']);
    getSmallChannel(value);
  }
  // 获取分中心下拉框的所有选项
  handleBranchFocus() {
    const { tags, getBranches } = this.props;
    const { branchs } = tags;
    // if (branchs && !branchs.data.length) {
    getBranches();
    // }
  }

  toggle(e) {
    e.preventDefault();
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  }

  render() {
    const { customers, tags, form } = this.props;
    const { archive } = customers;
    const {
      branchs, companies, goodsGroup,
      goodsChannel, summaryChannel, smallChannel,
    } = tags;
    const { pagination, rowId, expand } = this.state;
    const { getFieldDecorator } = form;
    pagination.total = archive.total;
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
                    { getFieldDecorator('branchCode', {
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
                    { getFieldDecorator('buCode')(
                      <Select
                        disabled={!form.getFieldValue('branchCode')}
                        placeholder="请选择小微"
                      >
                        {companies.data.map(company =>
                          <Option key={company.key} value={company.key}>{company.value}</Option>)}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="经销商编码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('custCode')(
                        <Input
                          type="text"
                          placeholder="请输入经销商编码"
                        />)
                    }
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="经销商名称"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('custName')(
                        <Input
                          type="text"
                          placeholder="请输入经销商名称"
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
                      getFieldDecorator('biChannelCode', {
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
                      getFieldDecorator('cnChannelCode', {
                        onChange: value => this.handleSummaryChannelChange(value),
                      })(
                        <Select
                          disabled={!form.getFieldValue('biChannelCode')}
                          placeholder="请选择汇总渠道"
                        >
                          {
                            summaryChannel.data.map(group =>
                              <Option key={`${group.key}_${group.value}`} value={group.key}>{group.value}</Option>)
                          }
                        </Select>)}
                  </FormItem>
                </Col>
                <Col sm={6} >
                  <FormItem
                    label="小渠道"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('smChannelCode')(
                        <Select
                          disabled={!form.getFieldValue('cnChannelCode')}
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
                    label="产品组"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('prdGrpId')(
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
                    label="送达方编码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('shCode')(
                        <Input
                          type="text"
                          placeholder="请输入送达方编码"
                        />,
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
            </section>
            <Row style={{ marginBottom: 14 }}>
              <Col sm={24} className="text-right">
                <Button
                  onClick={this.handleReset}
                  icon="close"
                  className="margin-right-10"
                >清 空</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon="search"
                  loading={archive.fetching}
                >查 询</Button>
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
          <Row gutter={16}>
            <Table
              columns={columns}
              pagination={pagination}
              dataSource={archive.data}
              scroll={{ x: 1280 }}
              loading={archive.fetching}
              onRowClick={(record) => {
                this.rowClick(record);
              }}
              onExpand={(expanded, record) => {
                this.getArchiveChildren(expanded, record);
              }}
              onChange={
                (paginations) => {
                  this.handleTableChange(paginations);
                }
              }
            />
          </Row>
        </Card>
        <Card loading={false}>
          <Tabs animated={false}>
            <TabPane tab="送达方" key="sender">
              <SenderTable
                id={rowId}
              />
            </TabPane>
            <TabPane tab="自建门店/仓库" key="warehouse">
              <WarehouseTable
                id={rowId}
              />
            </TabPane>
            <TabPane tab="伞下店" key="umbrella">
              <UmbrellaTable
                id={rowId}
              />
            </TabPane>
            <TabPane tab="同级理货" key="peer">
              <PeerTable
                id={rowId}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

Customer.propTypes = {
  form: PropTypes.object,
  customers: PropTypes.object,
  tags: PropTypes.object,
  query: PropTypes.func,
  getBranches: PropTypes.func,
  getCompany: PropTypes.func,
  getGroup: PropTypes.func,
  getChannel: PropTypes.func,
  querySummaryChannel: PropTypes.func,
  getSmallChannel: PropTypes.func,
  queryArchiveChildren: PropTypes.func,
  getSender: PropTypes.func,
  getUmbrella: PropTypes.func,
  getWarehouse: PropTypes.func,
  getPeer: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => queryArchive(param),
  getBranches: () => getBranch(),
  getCompany: param => queryCompanies(param),
  getGroup: () => getGoodsGroup(),
  getChannel: () => queryGoodsChannel(),
  querySummaryChannel: id => getSummaryChannel(id),
  getSmallChannel: id => querySmallChannel(id),
  queryArchiveChildren: (rowId, key) => getArchiveChildren(rowId, key),
  getSender: id => querySender(id),
  getUmbrella: id => queryUmbrella(id),
  getWarehouse: id => queryWarehouse(id),
  getPeer: id => queryPeer(id),
  
};
const mapStateTopProps = state => ({
  customers: state.customer,
  tags: state.tags,
});

Customer = Form.create()(Customer);

export default connect(mapStateTopProps, mapDispatchToProps)(Customer);

