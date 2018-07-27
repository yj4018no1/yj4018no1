import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { querySender } from './containers';

const columns = [
  {
    key: 'branchName',
    title: '分中心',
    dataIndex: 'branchName',
  }, {
    key: 'buName',
    title: '小 微',
    dataIndex: 'buName',
  }, {
    key: 'receiverCode',
    title: '送达方编码',
    dataIndex: 'receiverCode',
  }, {
    key: 'receiverName',
    title: '送达方名称',
    dataIndex: 'receiverName',
  }, {
    key: 'storefront',
    title: '门店/仓库',
    dataIndex: 'storefront',
  }, {
    key: 'mgrCode',
    title: '管理客户编码',
    dataIndex: 'mgrCode',
  }, {
    key: 'mgrName',
    title: '管理客户名称',
    dataIndex: 'mgrName',
  }, {
    key: 'managerCode',
    title: '客户经理编码',
    dataIndex: 'managerCode',
  }, {
    key: 'managerName',
    title: '客户经理姓名',
    dataIndex: 'managerName',
  }, {
    key: 'isTC',
    title: '是否TC',
    dataIndex: 'isTC',
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

class SenderTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
    };
  }
    // 分页事件
  handleTableChange(paginations) {
    const { current, pageSize } = paginations;
    const { custCode } = this.state;
    const values = {
      custCode: this.props.id,
      current,
      pageSize,
    };
    this.setState({
      pagination: {
        current,
        pageSize,
      },
    });
    this.props.query(values);
  }
  render() {
    const { customers } = this.props;
    const { sender } = customers;
    const pagination = {
      showTotal: total => `一共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
      total: sender.total || 0,
    };
    return (
      <Table
        columns={columns}
        pagination={pagination}
        scroll={{ x: 1280 }}
        loading={sender.fetching}
        dataSource={sender.data}
        onChange={
          (paginations) => {
            this.handleTableChange(paginations);
          }
        }
      />
    );
  }
}

SenderTable.propTypes = {
  id: PropTypes.any,
  customers: PropTypes.object,
  query: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => querySender(param),
};
const mapStateTopProps = state => ({
  customers: state.customer,
});

export default connect(mapStateTopProps, mapDispatchToProps)(SenderTable);
