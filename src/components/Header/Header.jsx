import React, { PropTypes } from 'react';
import { Breadcrumb, Icon, Row, Col } from 'antd';
import './Header.scss';

const Header = props => (
  <div className="ant-layout-header">
    <Row type="flex" justify="center" align="middle">
      <Col xs={16} sm={16} md={20} lg={19}>
        <div className="ant-layout-breadcrumb">
          <Breadcrumb {...props} />
        </div>
      </Col>
      <Col xs={4} sm={4} md={2} lg={3} className="gastly-issuse">
        <a
          href="http://esp.haier.com/dispatcher?stamp=25643256&action=msg.create&state=step2&custom_prd_id=qq_TDP&msgcontent=&msg_class=10&comp=qq&project_no=TDP&main_typecode=10&outCreateFlag=0"
          rel="noopener noreferrer"
          target="_blank"
          title="问题反馈"
        >
          问题反馈
        </a>
        |
        <a
          href="http://esp.haier.com/dispatcher?action=logon&dis=10&portalFlag=1&state=success"
          rel="noopener noreferrer"
          target="_blank"
          title="问题查询"
        >
          问题查询
        </a>
      </Col>
      <Col xs={4} sm={4} md={2} lg={2}>
        <a className="ant-layout-header-logout" onClick={props.handleClick} href="">
          <span style={{ marginRight: 2 }}>退出 <Icon type="logout" /></span>
        </a>
      </Col>
    </Row>

  </div>
);
Header.propTypes = {
  handleClick: PropTypes.func,
};

export default Header;
