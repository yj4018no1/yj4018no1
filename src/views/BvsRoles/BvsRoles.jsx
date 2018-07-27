import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Table, Row, Col, Button, Card, Select, Icon } from 'antd';
import { getRoles, addRole } from './containers';
import moment from 'moment';
import { browserHistory } from 'react-router'
const FormItem = Form.Item;
const Option = Select.Option;

// 分页
const PAGE = {
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
};

class BvsRoles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showTotal: total => `一共 ${total} 条`,
        ...PAGE,
      },
      disabled: true,
      expand: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.changeState = this.changeState.bind(this);
    this.toggle = this.toggle.bind(this);
    this.editRole = this.editRole.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    this.props.query();
  }
  
  // 新增页面跳转
  handleAdd(e) {
    e.preventDefault();
    browserHistory.push('/addRole');
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
      pagingFlag : 0,
    };
    query(values);
    this.setState({
      pagination: {
        ...PAGE,
      },
      expand: true,
    });
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

  // 编辑事件
  editRole(e, id) {
    e.preventDefault();    
    browserHistory.push(`/addRole?id=${id}&isNewRecord=false`);
  }

  inputClear = () => {
    const { form } = this.props;
    this.setState({ disabled: false });
    form.setFieldsValue({ branchCode: undefined });
    form.setFieldsValue({ buCode: undefined });
  }

  render() {
    // 列表
    const columns = [{
      title: '角色名',
      dataIndex: 'name',
      render: text => text || '',
    }, {
      title: '描述',
      dataIndex: 'description',
      render: text => text || '',
    }, {
      title: '创建者',
      dataIndex: 'createBy',
      render: text => text || '无',
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: text => 
      <span>
          {text ? moment(text).format('YYYY-MM-DD') : ''}
      </span>,
    }, {
      title: '最后修改者',
      dataIndex: 'lastModifiedBy',
      render: text => text || '无',
    }, {
      title: '最后修改时间',
      dataIndex: 'gmtModified',
      render: text => 
      <span>
          {text ? moment(text).format('YYYY-MM-DD') : ''}
      </span>,
    }, {
      key: 'operation',
      title: '操 作',
      dataIndex: '',
      render: item => (<a onClick={e => this.editRole(e, item.id)} href>编辑</a>),
    }];

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { bvsRoles, form, tags } = this.props;
    const { pagination, expand } = this.state;
    const { current, pageSize } = pagination;
    const { branchs, companies } = tags;
    const { getFieldDecorator } = form;
    pagination.total = bvsRoles.total || 0;
    return (
      <div>
        <Card loading={false}>
          <Form horizontal onSubmit={this.handleSubmit}>
            <section className={expand ? 'hide' : ''}>
              <Row gutter={16}>
         
                <Col sm={6}>
                  <FormItem
                    label="角色名"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('name')(
                      <Input type="text" placeholder="请填写角色名" />,
                    )}
                  </FormItem>
                </Col>
                <Col sm={6}>
                  <FormItem
                    label="描述"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('description')(
                      <Input type="text" placeholder="请填写描述" />,
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
                <Button type="primary" htmlType="submit" loading={bvsRoles.fetching}>查 询</Button>
                <Button type="dashed" className="margin-left-10" htmlType="button" onClick={this.handleAdd}>新增</Button>                
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
            dataSource={bvsRoles.data}
            loading={bvsRoles.fetching}
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
BvsRoles.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  bvsRoles: PropTypes.object,
  tags: PropTypes.object,
};

const mapDispatchToProps = {
  query: param => getRoles(param),
  addRole: param => addRole(param),
};

const mapStateTopProps = state => ({
  bvsRoles: state.bvsRoles,
  tags: state.tags,
});

BvsRoles = Form.create()(BvsRoles);

export default connect(mapStateTopProps, mapDispatchToProps)(BvsRoles);

