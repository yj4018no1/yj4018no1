import React, { Component, PropTypes } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import DealerTab from './DealerTab';
import GoodsTab from './GoodsTab';
import { getBillGoods } from './containers';

const TabPane = Tabs.TabPane;

class BillStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '1',
      code: '',
    };
    this.change = this.change.bind(this);
  }

  // tab切换
  change(activeKey) {
    this.setState({ activeKey });
  }
  // 查看第二个tab页的内容
  handlerTabChange(activeKey, code = '') {
    const { queryGoods } = this.props;
    queryGoods({ dealerCode: code });
    this.setState({ activeKey, code });
  }

  render() {
    const { activeKey, code } = this.state;
    return (
      <Tabs activeKey={activeKey} onChange={this.change} >
        <TabPane tab="经销商汇总" key="1">
          <DealerTab changeTab={(key, item) => this.handlerTabChange(key, item)} />
        </TabPane>
        <TabPane tab="经销商产品汇总" key="2">
          <GoodsTab code={code} />
        </TabPane>
      </Tabs>
    );
  }
}

BillStatistics.propTypes = {
  queryGoods: PropTypes.func,
};

const mapDispatchToProps = {
  queryGoods: param => getBillGoods(param),
};

export default connect(null, mapDispatchToProps)(BillStatistics);

