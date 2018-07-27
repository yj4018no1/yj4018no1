import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Table, Row, Col, Button, Card, Select, Icon, Modal, Transfer, notification} from 'antd';
import { postZtest, getRowID, setNewUser } from './containers';
import { Link } from 'react-router';
import moment from 'moment';



//创建的实体类
class Ztest extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  render() {
    return (
      <div>
        1<br />
        2<br />
        3<br />
        4<br />
        { console.log("test") }
        test.test.test.test.test.test.test.test.test.test.test
      </div>
    );
  }
}

Ztest.propTypes = {
};


const mapDispatchToProps = {
};

const mapStateTopProps = state => ({
  tags: state.tags,
});

Ztest = Form.create()(Ztest);

export default connect(mapStateTopProps, mapDispatchToProps)(Ztest);

