import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {  Form, Input, Table, Row, Col, Button, Card, Select, Icon, notification, Tree, Modal } from 'antd';
import { findResource, createRole, findById } from './containers';
import { withRouter, browserHistory } from 'react-router'

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

// 分页
const PAGE = {
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
};
// 加载数列表
const TreeNode = Tree.TreeNode;
class AddRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        ...PAGE,
      },
      disabled: true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      isNewRecord: true,
      id: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.changeState = this.changeState.bind(this);
    this.handleBranchFocus = this.handleBranchFocus.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
  }

  componentWillMount (){
    const { location,resource,findById } = this.props;  
    // 如果编辑的话查询数据
    if(location.query.isNewRecord === "false"){
      // 赋值路由传值
      this.setState({
        isNewRecord: location.query.isNewRecord,
        id: location.query.id,
      });
      // 执行完findById后能获取到数据
      findById(location.query).then(
        () => { 
          const {addRole, form } = this.props;
          form.setFieldsValue(addRole.bvsRole);
          this.setState({
            checkedKeys: addRole.checkTree,
            expandedKeys: addRole.checkTree,
          });}
      );
      }
    // 调用树资源方法
    resource();
  }

  handleReset(e) {
    e.preventDefault();
    this.setState({  
      disabled: true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [], });
  
    this.state = {
      pagination: {
        ...PAGE,
      },
      disabled: true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      isNewRecord: true,
      id: null,
    };
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, createRole } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }else{
        const fieldsValues = form.getFieldsValue();
        const values = {
          ...fieldsValues,
          pageNo: PAGE.current,
          pageSize: PAGE.pageSize,
          pagingFlag : 0,
          checkedKeys: this.state.checkedKeys,
          isNewRecord: this.state.isNewRecord,
          id: this.state.id,
        };
        this.props.createRole(values).then((msg) => {
          if (msg && msg.success == true) {
            notification.success({
              message: '操作成功',
              description: `${values.isNewRecord == true ? '新增' : '编辑'}角色成功!`,
            });
            browserHistory.goBack();
          }else{
            notification.error({
              message: '操作失败',
              description: `${values.isNewRecord == true ? '新增' : '编辑'}角色失败!`,
            });
          }
        });
      }     
    });
    this.setState({
      pagination: {
        ...PAGE,
      },
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

  inputClear = () => {
    const { form } = this.props;
    this.setState({ disabled: false });
    form.setFieldsValue({ branchCode: undefined });
    form.setFieldsValue({ buCode: undefined });
  }

  // 展开树事件
  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  // 勾选树事件
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  // 选择树事件
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  // 数据加载事件
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  // 返回提示
  showConfirm() {
    confirm({
      content: ' 您的内容未保存，是否确定离开？',
      onOk: () => {
        browserHistory.goBack();
      },
      onCancle() {}
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { addRole, form } = this.props;
    const { pagination } = this.state;
    const { current, pageSize } = pagination;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Row gutter={16}>
          <Col>
            <Card loading={false}>
              <Form horizontal onSubmit={this.handleSubmit}>
                  <Row gutter={16}>
                    {/* <Col sm={6}> */}
                      <FormItem {...formItemLayout} label={'角色名：'}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, whitespace: true, message: '角色名不能为空' }],
                        })(<Input type='text' placeholder='请输入角色名' />)}
                      </FormItem>

                      <FormItem {...formItemLayout} label={'描述：'}>
                        {getFieldDecorator('description', {
                          rules: [{ required: true, whitespace: true, message: '描述不能为空' }],
                        })(<Input type='textarea' rows="5" placeholder='请输入描述' />)}
                      </FormItem>
                    {/* </Col> */}
                  </Row>
                  <Row>
                    {addRole.treeDate.length ? 
                      <Tree
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                        >
                        {this.renderTreeNodes(addRole.treeDate)}
                      </Tree>
                    : 'loading tree'}
                  </Row>
                  <Row>
                    <Col
                      span={12}
                      offset={12}
                      className="text-right"
                    >
                      <Button className="margin-right-10" onClick={this.handleReset}>清 空</Button>
                      <Button className="margin-right-10" type="primary" htmlType="submit" loading={addRole.fetching}>保 存</Button>
                      <Button type='default' onClick={this.showConfirm}>返回</Button>
                    </Col>
                  </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
AddRole.propTypes = {
  form: PropTypes.object,
  createRole: PropTypes.func,
  addRole: PropTypes.object,
  queryBranch: PropTypes.func,
  queryCompany: PropTypes.func,
  resource: PropTypes.func,
  findById: PropTypes.func,
};

const mapDispatchToProps = {
  createRole: param => createRole(param),
  resource: () => findResource(),
  findById: param => findById(param),
};

const mapStateTopProps = state => ({
  addRole: state.addRole,
});

AddRole = Form.create()(AddRole);

export default connect(mapStateTopProps, mapDispatchToProps)(AddRole);

