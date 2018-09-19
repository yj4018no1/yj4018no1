import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Table, Row, Col, Button, Card, Select, Icon, Modal, Transfer, notification } from 'antd';
import * as containers from './containers';

// static styles
import "styles/css/base.css";
import "styles/css/style.css";
import "styles/css/iconfont.css";
import "styles/css/purebox.css";
import "styles/css/quickLinks.css";
import "styles/css/color.css";
import "./ZFirst.scss"

import { ZHeader } from "./ZHeader";
import { ZNav } from "./ZNav";
import { ZHomeIndex } from "./ZHomeIndex";

//创建的实体类
class ZFirst extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("ZFirst.componentWillMount");
        this.props.handleQueryData();
        this.props.handleQueryDataNav();
    }

    handleFunc(m) {
        console.log("handleFunc: " + m);
    }

    render() {
        console.log("ZFirst.render", this.props);
        const headerProps = {
            headerData: this.props.zfirstreducer.headerData,
            handleFunc: this.handleFunc,
            
        }
        const navProps = {
            nav: this.props.zfirstreducer.nav,
            onMouseNav: this.props.onMouseNav,
            // onMouseNav: containers.onMouseNav.bind(this),
        }
        console.log("navProps", navProps);
        return (
            <div className="home_visual_body festival_home" style={{ height: 100 + '%' }}>
                <ZHeader {...headerProps} />
                { navProps.nav ? <ZNav { ...navProps } /> : null }
                <ZHomeIndex {...headerProps} />

            </div>
        );
    }
}

ZFirst.propTypes = {
};


const mapDispatchToProps = {
    handleQueryData: (param) => containers.handleQueryData(param),
    handleQueryDataNav: (param) => containers.handleQueryDataNav(param),
    onMouseNav: (nav, id, selected) => containers.onMouseNav(nav, id, selected),
};

const mapStateTopProps = state => ({
    zfirstreducer: state.zfirstreducer,
});

ZFirst = Form.create()(ZFirst);

export default connect(mapStateTopProps, mapDispatchToProps)(ZFirst);

