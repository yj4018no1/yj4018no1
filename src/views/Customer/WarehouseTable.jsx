import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import { queryWarehouse } from './containers';

const filter = {
  1: '自建仓库',
  0: '门店',
};
const types = {
  0: '正品',
  1: '样品',
  2: '不良品',
  3: '礼品',
  4: '礼品',
  5: '活动',
};

const columns = [
  {
    key: 'entityCode',
    title: '自建编码',
    dataIndex: 'entityCode',
  }, {
    key: 'entityName',
    title: '自建名称',
    dataIndex: 'entityName',
  }, {
    key: 'entityType',
    title: '门店/仓库',
    dataIndex: 'entityType',
    render: record => filter[record],
  }, {
    key: 'warehouseType',
    title: '仓库类型',
    dataIndex: 'warehouseType',
    render: record => types[record],
  }, {
    key: 'mdmShcode',
    title: '已挂送方编码',
    dataIndex: 'mdmShcode',
  },
];

class WarehouseTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
    };
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log('ware-nextProps', this.props.id, '-', nextProps.id);
  //   if (this.props.id && this.props.id !== nextProps.id) {
  //     this.setState({ custCode: nextProps.id });
  //     this.props.query({ custCode: nextProps.id });
  //   }
  // }
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
    // const { pagination } = this.state;
    const { customers } = this.props;
    const { warehouse } = customers;
    const pagination = {
      showTotal: total => `一共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
      total: warehouse.total || 0,
    };
    return (
      <Table
        columns={columns}
        pagination={pagination}
        loading={warehouse.fetching}
        dataSource={warehouse.data}
        onChange={
          (paginations) => {
            this.handleTableChange(paginations);
          }
        }
      />
    );
  }
}

WarehouseTable.propTypes = {
  id: PropTypes.any,
  customers: PropTypes.object,
  query: PropTypes.func,
};

const mapDispatchToProps = {
  query: param => queryWarehouse(param),
};
const mapStateTopProps = state => ({
  customers: state.customer,
});

export default connect(mapStateTopProps, mapDispatchToProps)(WarehouseTable);
