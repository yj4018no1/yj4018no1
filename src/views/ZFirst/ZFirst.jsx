import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Table, Row, Col, Button, Card, Select, Icon, Modal, Transfer, notification } from 'antd';
import { handleQueryData } from './containers';

// static styles
import "styles/css/base.css";
import "styles/css/style.css";
import "styles/css/iconfont.css";
import "styles/css/purebox.css";
import "styles/css/quickLinks.css";
import "styles/css/color.css";

import { ZHeader } from "./ZHeader";
import { ZNav } from "./ZNav";

//创建的实体类
class ZFirst extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("ZFirst.componentWillMount");
        let _t = this.props.handleQueryData();
        console.log(_t);
    }

    handleFunc(m) {
        console.log("handleFunc: " + m);
    }

    render() {
        console.log("ZFirst.render", this.props);
        const headerProps = {
            ...this.props.zfirstreducer.headerData,
            handleFunc: this.handleFunc
        }
        return (
            <div className="home_visual_body festival_home" style={{ height: 100 + '%' }}>
                <ZHeader {...headerProps} />
                <ZNav />

            </div>
        );
    }
}

ZFirst.propTypes = {
};


const mapDispatchToProps = {
    handleQueryData: (param) => handleQueryData(param),
};

const mapStateTopProps = state => ({
    zfirstreducer: state.zfirstreducer,
});

ZFirst = Form.create()(ZFirst);

export default connect(mapStateTopProps, mapDispatchToProps)(ZFirst);

