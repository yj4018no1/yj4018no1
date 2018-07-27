import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getSession, logoutAction } from 'store/requireAuth';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import classnames from 'classnames';

import 'styles/index.scss';

class CoreLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
    this.logout = this.logout.bind(this);
  }
  // componentWillMount() {
  //   const shadow = document.getElementById('embed_haier_a_001');
  //   if (getSession('bvs')) {
  //     if (shadow) {
  //       shadow.style.visibility = 'visible';
  //     }
  //   }
  // }
  onCollapseChange() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  logout(e) {
    e.preventDefault();
    logoutAction();
  }

  render() {
    const collapse = this.state.collapse;
    const cacheUser = getSession('bvs') || { menu: [] };
    const { children, location, user, ...rest } = this.props;
    const sidebarClass = classnames('ant-layout-aside', { 'ant-layout-aside-collapse ant-layout-aside': collapse });
    return (
      <div className={sidebarClass}>
        <Sidebar
          selectedKeys={location.pathname.split('/')[1]}
          collapse={collapse}
          user={user.data || cacheUser}
          onCollapseChange={() => {
            this.onCollapseChange();
          }}
        />
        <div className="ant-layout-main">
          <Header handleClick={this.logout} {...rest} />
          <div className="ant-layout-container">
            <div className="ant-layout-content">
              {children || '加载中...'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = state => ({
  location: state.location,
  user: state.user || {},
});

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  user: PropTypes.object,
  logOut: PropTypes.func,
};

export default connect(mapStateTopProps, null)(CoreLayout);
