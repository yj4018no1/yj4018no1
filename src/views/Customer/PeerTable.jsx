import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { queryPeer } from './containers';

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
    key: 'custCode',
    title: '经销商编码',
    dataIndex: 'custCode',
  }, {
    key: 'custName',
    title: '经销商名称',
    dataIndex: 'custName',
  }, {
    key: 'customerFlag',
    title: '同级理货商',
    dataIndex: 'customerFlag',
  }, {
    key: 'pgName',
    title: '产品组',
    dataIndex: 'pgName',
  },
];

class PeerTable extends Component {
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
      type: 1,
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
    const { peer } = customers;
    const pagination = {
      showTotal: total => `一共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
      total: peer.total || 0,
    };
    return (
      <Table
        columns={columns}
        pagination={pagination}
        loading={peer.fetching}
        dataSource={peer.data}
        onChange={
          (paginations) => {
            this.handleTableChange(paginations);
          }
        }
      />
    );
  }
}

PeerTable.propTypes = {
  id: PropTypes.any,
  customers: PropTypes.object,
  query: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => queryPeer(param),
};
const mapStateTopProps = state => ({
  customers: state.customer,
});

export default connect(mapStateTopProps, mapDispatchToProps)(PeerTable);
