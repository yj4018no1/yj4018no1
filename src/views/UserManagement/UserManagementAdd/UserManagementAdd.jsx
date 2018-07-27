import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Table, Row, Col, Button, Card, Select, Icon, Popover, Tree, Spin, Checkbox, notification ,Modal} from 'antd';
import { queryCompanies, getBranch } from 'store/tags';
import { queryUserManagementAdd, findAreaTree, findRoleData, queryUserIdsData, saveUserInfo } from './containers';
import { withRouter, browserHistory } from 'react-router';
import moment from 'moment';

//From表单
const FormItem = Form.Item;
//下拉框使用
const Option = Select.Option;
//树的引入
const TreeNode = Tree.TreeNode;
//多选框的引入
const CheckboxGroup = Checkbox.Group;
//Modal信息框引入
const confirm = Modal.confirm;

const PAGE = {
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  
};

class UserManagementAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleId: 0,
      targetKeys: [],
      pagination: {
        ...PAGE,
      },
      disabled: true,
      expand: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      checkedBox:[],
      checkfalg:false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.changeState = this.changeState.bind(this);
    this.toggle = this.toggle.bind(this);
    this.renderRoleNodes = this.renderRoleNodes.bind(this);
    this.renderInitRole = this.renderInitRole.bind(this);
    this.changeRoleList = this.changeRoleList.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
  }

  handleReset(e) {
    e.preventDefault();
    this.setState({ 
      disabled: true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      checkfalg: true,
      checkedBox:[],
     });
    //this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, saveUserInfo } = this.props;
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
          roleList: this.state.checkedBox,
          departmentList : this.state.checkedKeys,
          id: this.props.location.state.userId,
        };
        saveUserInfo(values).then((msg) => {
          if (msg && msg.success == true) {
            notification.success({
              message: '操作成功',
              description: '编辑用户权限成功!',
            });
            browserHistory.goBack();
          }else{
            notification.error({
              message: '操作失败',
              description: '编辑用户权限失败!',
            });
          }
        });
      }     
    });
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

  inputClear = () => {
    const { form } = this.props;
    this.setState({ disabled: false });
    form.setFieldsValue({ branchCode: undefined });
    form.setFieldsValue({ buCode: undefined });
  }
  
  //用于树、多选框的生命周期(初始化数据)
  componentWillMount (){    
    const {findAreaResource,findRoleResource,queryUserIdsResource,location} = this.props;
    // 获取用户ID
    const userId = location.state.userId;     
    // 加载资源
    findAreaResource();
    findRoleResource();
    // 赋值
    queryUserIdsResource(userId).then( () => {
      const {userInfo, roleList, departmentList } = this.props.userManagementAdd.initAllData;
      // 赋值表单
      userInfo.status = userInfo.status.toString();
      this.props.form.setFieldsValue(userInfo);
      //表单时间赋值格式化
      this.props.form.setFieldsValue({gmtCreate: moment(this.props.userManagementAdd.initAllData.userInfo.gmtCreate).format('YYYY-MM-DD')});
      this.props.form.setFieldsValue({gmtModified: moment(this.props.userManagementAdd.initAllData.userInfo.gmtModified).format('YYYY-MM-DD')});
      this.props.form.setFieldsValue({lastLoginTime: moment(this.props.userManagementAdd.initAllData.userInfo.lastLoginTime).format('YYYY-MM-DD')});
      this.props.form.setFieldsValue({gmtModified: moment(this.props.userManagementAdd.initAllData.userInfo.gmtModified).format('YYYY-MM-DD')});
      // 赋复选框和列表
      this.setState({
        checkedKeys: departmentList,
        expandedKeys: departmentList,
        checkedBox: roleList,
        checkfalg: true,
      });

    });
  }

  //树控件所用-start
  onExpand = (expandedKeys) => {
    console.log('展开/收起节点时触发', arguments);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    console.log('点击复选框触发', checkedKeys);
    this.setState({ checkedKeys });
  }
  onSelect = (selectedKeys, info) => {
    console.log('点击节点触发', info);
    this.setState({ selectedKeys });
  }
  renderTreeNodes = (areaTreeData) => {
    return areaTreeData.map((item) => {
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
  //树控件所用-end

  // 角色复选框循环加载赋值-start
  renderRoleNodes = () => {    
    const roleOptions = [];
    const {roleData} = this.props.userManagementAdd;
    roleData.forEach((item)=>{
      let roleList = {label: item.name, value: item.id};
      roleOptions.push(roleList);
    });
    return roleOptions;
  }
  //角色复选框循环加载赋值-end

  // 1角色复选框循环加载赋值-start
  renderInitRole = () => {    
    const initRoleOptions = [];
    const {roleList} = this.props.userManagementAdd.initAllData;
    const {departmentList} = this.props.userManagementAdd.initAllData;
    const {userManagementAdd, form } = this.props;
    if(roleList){
      roleList.forEach((item)=>{
        let roleList = {item};
        initRoleOptions.push(roleList);
      });
    }
  }
  //1角色复选框循环加载赋值-end

  //点击多选框的赋值
  changeRoleList(value) {
    console.log(`value ${value}`);
    this.setState({checkedBox:value});
  };

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
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { userManagementAdd, form, tags } = this.props;
    const { pagination, expand } = this.state;
    const { current, pageSize } = pagination;
    const { branchs, companies } = tags;
    const { getFieldDecorator } = form;
    const pagination_ = {
      total: userManagementAdd.total || 0,
      showTotal: total => `一共 ${total} 条`,
      pageSize,
      current,
      showQuickJumper: true,
      showSizeChanger: true,
    };
    
    //状态下拉使用函数
    function handleChange(value) {
      console.log(`selected ${value}`);
    };

   
    return (
      <div>
        <Card loading={false}>
          <Form horizontal onSubmit={this.handleSubmit}>
              <Row type="flex" justify="start">
                <Col  span={10} > 
                  <FormItem
                    label="登录名"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('name')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>
                <Col  span={10} >
                  <FormItem
                    label="用户姓名"
                    {...formItemLayout}
                    
                  >
                    {getFieldDecorator('nickName')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>                              
              </Row>
              <Row type="flex">
                <Col span={10} >
                  <FormItem
                    label="邮箱"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('email')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>
                <Col span={10}>
                <FormItem
                    label="状态"
                    {...formItemLayout}
                  >
                  {getFieldDecorator('status')( 
                  <Select onChange={handleChange}>
                    <Option value="1">启用</Option>
                    <Option value="0">禁用</Option>
                  </Select>,
                  )}                 
                  </FormItem>

                </Col>      
              </Row>
              <Row type="flex">
                <Col span={10} >
                  <FormItem
                    label="创建者"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('createBy')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>
                <Col span={10} >
                  <FormItem
                    label="创建时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('gmtCreate')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>      
              </Row>
              <Row type="flex">
                <Col span={10} >
                  <FormItem
                    label="最后修改者"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('lastModifiedBy')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>
                <Col span={10} >
                  <FormItem
                    label="最后修改时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('gmtModified')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>      
              </Row>
              <Row type="flex">
                <Col span={10} >
                  <FormItem
                    label="上次登录IP"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('lastLoginIp')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>
                <Col span={10} >
                  <FormItem
                    label="上次登录时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('gmtModified')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>      
              </Row>
              <Row type="flex">
              <label/>
                <Col span={10} >
                  <FormItem
                    label="上次登录失败时间"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('lastLoginTime')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>
                <Col span={10} >
                  <FormItem
                    label="登录失败次数"
                    {...formItemLayout}
                  >
                    {getFieldDecorator('loginAttemptTimes')(
                      <Input type="text" disabled = {true}/>,
                    )}
                  </FormItem>
                </Col>      
              </Row>
              <Row>
                <div>用户角色:</div>
              </Row>
              <Row>
                {this.state.checkfalg ?
                  <CheckboxGroup 
                  options={this.renderRoleNodes(userManagementAdd.roleData)} 
                  onChange={this.changeRoleList} 
                  value={this.state.checkedBox} />
                : <Spin size="small" tip="Loading..."/>} 
              </Row>
              <Row>
                <div>用户区域:</div>
              </Row>
              <Row>
              {userManagementAdd.areaTreeData.length ? 
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
                  {this.renderTreeNodes(userManagementAdd.areaTreeData)}
                </Tree>
                : <Spin size="small" tip="Loading..."/> }
              </Row>    
              <Row>
                <Col span={2} offset={10}><Button onClick={this.handleReset}>清 空</Button></Col>
                <Col span={6}><Button type="primary" htmlType="submit" loading={userManagementAdd.fetching}>保 存</Button></Col>
                <Col ><Button type='default' onClick={this.showConfirm}>返回</Button></Col>
             </Row> 
          </Form>          
        </Card>
      </div>
    );
  }
}
UserManagementAdd.propTypes = {
  form: PropTypes.object,
  query: PropTypes.func,
  userManagementAdd: PropTypes.object,
  tags: PropTypes.object,
  findAreaResource: PropTypes.func,
  findRoleResource: PropTypes.func,
  queryUserIdsResource: PropTypes.func,
  saveUserInfo: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => queryUserManagementAdd(param),
  findAreaResource: ()=> findAreaTree(),  
  findRoleResource: ()=> findRoleData(),
  queryUserIdsResource: userId=>queryUserIdsData(userId),
  saveUserInfo: param => saveUserInfo(param),
};

const mapStateTopProps = state => ({
    userManagementAdd: state.userManagementAdd,
    tags: state.tags,
});

UserManagementAdd = Form.create()(UserManagementAdd);

export default connect(mapStateTopProps, mapDispatchToProps)(UserManagementAdd);

