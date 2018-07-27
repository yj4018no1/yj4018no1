import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Table, Row, Col, Button, Card, Select, Icon, Modal, Transfer, notification} from 'antd';
import { postUserManagement, getRowID, setNewUser } from './containers';
import { Link } from 'react-router';
import moment from 'moment';

const FormItem = Form.Item;
//分页
const PAGE = {
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
};
//状态转换展示
const Option = Select.Option;
const COMEFROM = {
  0: '禁用',
  1: '启用',
};




//创建的实体类
class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        ...PAGE,
      },
      visible: false,
      name: 0,
      targetKeys: [],
      disabled: true,
      expand: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.changeState = this.changeState.bind(this);
    this.toggle = this.toggle.bind(this);
    this.showModalChange = this.showModalChange.bind(this);
  }

//start
      state = {
        visible: false,
      };
      showModal = () => {
        this.setState({ visible: true });
      }
      handleCancel = () => {
        this.setState({ visible: false });
      }
      handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          console.log('Received values of form: ', values);
          form.resetFields();
          this.setState({ visible: false });
        });
      }
      saveFormRef = (formRef) => {
        this.formRef = formRef;
      }
//end

//start_two
showModalChange(e, item) {
  e.preventDefault();
  const { userManagement, getRowId } = this.props;
  getRowId(item.name).then((res) => {
    if (item.name) {   
      this.setState({
        visible: true,
        name:item.name,
        nickname:item.nickName,
      });
    }
  });
  
}
//end_two
//创建新用户
setNewUser(e) {
  e.preventDefault();
  const {form} = this.props;
  const { userManagement } = this.props;
  const permissionIds = form.getFieldsValue();
  this.props.updateRolePiss({
      ...permissionIds,
    }).then((res) => {
      if (permissionIds.name) {
        console.log(userManagement);
        notification.success({
          message: '操作成功',
          description: '用户添加成功!',
        });
        this.handleCancel();
      }
    });
  

}

//
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

  render() {    
    const columns = [ {
      colSpan: '0',
      title: '用户ID',
      dataIndex: 'id',
      render: text => text || '无',
    },{
      colSpan: '0',
      title: '登录名',
      dataIndex: 'name',
      render: text => text || '无',
    },{
      title: '用户名',
      dataIndex: 'nickName',
      render: text => text || '无',
    },{
      title: '邮箱',
      dataIndex: 'email',
      render: text => text || '无',
    },{
      title: '角色',
      dataIndex: 'roleName',
      render: text => text || '无',
    },{
      title: '部门',
      dataIndex: 'departmentName',
      render: text => text || '无',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => COMEFROM[text] || '无',
    },
    {
      title: '最近登录IP',
      dataIndex: 'lastLoginIp',
      render: text => text || '无',
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginTime',
      render: text => 
      <span>
          {text ? moment(text).format('YYYY-MM-DD') : ''}
      </span>,
    },
    {
      key: 'operation',
      title: '操 作',
      dataIndex: '',
      render: item => (
        <Link to={ 
            { 
                pathname:"/userManagmentAdd", 
                state:{name: item.name, nickName:item.nickName, userId:item.id},   
            } 
          } activeClassName="GlobalNav-active">编辑
        </Link> 
      ),      
    }]; 

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { userManagement, form, tags } = this.props;
    const { pagination, expand } = this.state;
    const { current, pageSize } = pagination;
    const { getFieldDecorator } = form;
    const pagination_ = {
      total: userManagement.total || 0,
      showTotal: total => `一共 ${total} 条`,
      pageSize,
      current,
      showQuickJumper: true,
      showSizeChanger: true,
    };
    const { visible, onCancel, onCreate } = this.props;

    return (
      <div>
      <Card loading={false}>
        <Form horizontal onSubmit={this.handleSubmit}>
          <section className={expand ? 'hide' : ''}>
            <Row gutter={16}>
              <Col sm={6}>
                <FormItem
                  label="登录名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('name')(
                    <Input type="text" placeholder="请填写名称" />,
                  )}
                </FormItem>
              </Col>
              <Col sm={6}>
                <FormItem
                  label="用户名"
                  {...formItemLayout}
                >
                  {getFieldDecorator('nickName')(
                    <Input type="text" placeholder="请填写类型" />,
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
              <Button className="margin-right-10" type="primary" htmlType="submit" loading={userManagement.fetching}>查 询</Button>
              <Button type="primary" onClick={this.showModal}>新增</Button>
              <Modal ref="modal"
                        visible={this.state.visible}
                        title="添加表数据" onOk={this.handleOk} onCancel={this.handleCancel}
                          footer={[
                            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返 回</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={e => this.setNewUser(e)}>提 交</Button>
                          ]}>
                        <Form vertical>
                          <FormItem label="登录名">
                            {getFieldDecorator('name', {
                              initialValue: this.state.name || '',
                              rules: [{ required: true, message: 'Please input the title of collection!' }],
                            })(
                              <Input type="text"/>
                            )}
                          </FormItem>
                          <FormItem label="用户姓名">
                            {getFieldDecorator('nickName', {
                              initialValue: this.state.nickName || '',
                              rules: [{ required: true, message: 'Please input the title of collection!' }],
                            })(
                              <Input type="text"/>
                            )}
                          </FormItem>                          
                          
                        </Form>
                </Modal>

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
          dataSource={userManagement.data}
          loading={userManagement.fetching}
          pagination={pagination_}
          onChange={
            (paginations) => {
              this.handleTableChange(paginations);
            }
          }
        />
      </Card>
      <Modal
          visible={visible}
          title="新增客户信息"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form vertical>
            <FormItem label="登录名">
              {getFieldDecorator('name', {
                initialValue:''|| '',
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="用户名">
              {getFieldDecorator('nickName', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="备注">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </FormItem>
          </Form>
        </Modal>
    </div>
    );
  }
}

UserManagement.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  tags: PropTypes.object,
  userManagement: PropTypes.object,
  getRowId: PropTypes.func,

};


const mapDispatchToProps = {
  query: param => postUserManagement(param),
  getRowId: name => getRowID(name),
  updateRolePiss: param => setNewUser(param),
};

const mapStateTopProps = state => ({
    userManagement: state.userManagement,
  tags: state.tags,
});

UserManagement = Form.create()(UserManagement);

export default connect(mapStateTopProps, mapDispatchToProps)(UserManagement);

