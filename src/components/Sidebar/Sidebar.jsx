import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { Menu, Icon } from 'antd';
import logo from 'static/logo-light.png';
import avatar from './avatar.png';

const SubMenu = Menu.SubMenu;

const Sidebar = props => (
  <aside className="ant-layout-sider">
    <div className="ant-layout-sider-backdrop" />
    <div className="ant-layout-logo">
      <IndexLink to="/">
        <img src={logo} alt="终端数据分析平台-BVS" />
      </IndexLink>
      <Icon
        type={props.collapse ? 'menu-unfold' : 'menu-fold'}
        title="关 闭" onClick={props.onCollapseChange}
      />
    </div>
    <Menu
      mode={props.collapse ? 'vertical' : 'inline'}
      theme="dark"
      defaultSelectedKeys={['home']}
      selectedKeys={[props.selectedKeys]}
    >
      {props.user.menu.map((item) => {
        let component = null;
        if (item && item.children && item.children.length > 0) {
          component = (
            <SubMenu
              key={item.key}
              title={
                <span className="nav-text"><Icon type={item.icon} /><span>{item.name}</span></span>
              }
            >
              {item.children.map(itemChildren =>
                (<Menu.Item key={itemChildren.key}>
                  <Link to={itemChildren.url}>
                    <span className="nav-text">{itemChildren.name}</span>
                  </Link>
                </Menu.Item>),
              )}
            </SubMenu>
          );
        } else {
          component = (
            <Menu.Item key={item.key}>
              {item.key === 'home' ?
                <IndexLink to="/">
                  <Icon type={item.icon} /><span className="nav-text">{item.name}</span>
                </IndexLink> :
                <Link to={item.url}>
                  <Icon type={item.icon} /><span className="nav-text">{item.name}</span>
                </Link>
              }
            </Menu.Item>
          );
        }
        return component;
      })}
    </Menu>
    <div className="ant-layout-avatar">
      <img src={avatar} alt="海尔商业价值分析平台-BVS" />
      <span>{props.user ? props.user.displayName : ''}</span>
    </div>
  </aside>
);

Sidebar.propTypes = {
  onCollapseChange: PropTypes.func,
  collapse: PropTypes.bool,
  selectedKeys: PropTypes.string,
  user: PropTypes.object,
};

Sidebar.defaultProps = {
  collapse: false,
};

export default Sidebar;
