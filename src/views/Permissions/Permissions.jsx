import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, Card, Modal, Transfer, notification } from 'antd';
import { getRoles, getPermissionsByID, setRolePermissions } from './containers';

class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      roleId: 0,
      targetKeys: [],
    };
    this.showModal = this.showModal.bind(this);
  }
  componentDidMount() {
    this.props.get();
  }
  setRolePermissions() {
    const { targetKeys, roleId } = this.state;
    const { userManager } = this.props;
    const permissionIds = [];
    userManager.permissions
    .forEach(item => targetKeys.includes(item.key) && permissionIds.push(`${item.id}`));
    console.log('targetKeys', targetKeys);
    this.props.updateRolePiss({
      permissionIds,
      roleId: `${roleId}`,
    }).then((res) => {
      if (res) {
        notification.success({
          message: '操作成功',
          description: '用户权限修改成功!',
        });
        this.handleCancel();
      }
    });
  }
  showModal(e, id) {
    e.preventDefault();
    const { userManager, getRolePermission } = this.props;
    getRolePermission(id).then((res) => {
      if (res) {
        const targetKeys = [];
        if (res.permissionIds.length) {
          userManager.permissions
          .forEach(item => res.permissionIds.includes(`${item.id}`) && targetKeys.push(item.key));
        }
        this.setState({
          visible: true,
          roleId: id,
          targetKeys,
        });
      }
    });
  }

  handleChange(targetKeys) {
    this.setState({ targetKeys });
  }
  handleCancel() {
    this.setState({
      visible: false,
      targetKeys: [],
    });
  }
  render() {
    const COLUMNS = [{
      key: 'roleID',
      title: '角色编码',
      dataIndex: 'key',
    }, {
      key: 'roleDes',
      title: '描述',
      dataIndex: 'description',
    }, {
      key: 'operation',
      title: '操 作',
      dataIndex: '',
      render: item => (<a onClick={e => this.showModal(e, item.id)} href>编 辑</a>),
    }];
    const { userManager } = this.props;
    const { targetKeys, visible } = this.state;
    return (
      <Card>
        <Modal
          title="角色权限管理" visible={visible}
          width={750}
          onOk={() => this.setRolePermissions()} onCancel={() => this.handleCancel()}
          okText="确 认" cancelText="取 消"
        >
          <Transfer
            showSearch
            filterOption={(inputValue, option) => option.description.indexOf(inputValue) > -1}
            dataSource={userManager.permissions}
            titles={['全部权限', '已有权限']}
            listStyle={{
              width: 335,
              height: 300,
            }}
            onChange={keys => this.handleChange(keys)}
            targetKeys={targetKeys}
            render={item => item.description}
          />
        </Modal>
        <Table
          columns={COLUMNS}
          dataSource={userManager.bvsRoles}
          loading={userManager.fetching}
        />
      </Card>
    );
  }
}

Permissions.propTypes = {
  userManager: PropTypes.object,
  get: PropTypes.func,
  getRolePermission: PropTypes.func,
  updateRolePiss: PropTypes.func,
};

const mapDispatchToProps = {
  get: () => getRoles(),
  getRolePermission: id => getPermissionsByID(id),
  updateRolePiss: param => setRolePermissions(param),
};

const mapStateTopProps = state => ({
  userManager: state.permissions,
});

export default connect(mapStateTopProps, mapDispatchToProps)(Permissions);
