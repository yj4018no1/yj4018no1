import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Icon, Input, Button, Checkbox, Affix } from 'antd';
import logImage from 'static/logo-light.png';
import { loginAction, pointAction } from './containers';
import './Login.scss';

const FormItem = Form.Item;

// 判断ie9
const ie9 = document.documentMode === 9;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  componentWillMount() {
    const { singleLogin, location } = this.props;
    const url = location.query && location.query.url;
    singleLogin(url);
  }
  handleLogin(e) {
    e.preventDefault();
    const { form, login, location } = this.props;
    const url = location.query && location.query.url;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      login(values, url);
    });
  }
  render() {
    const { showLogin } = this.state;
    const { getFieldDecorator } = this.props.form;
    // <div className="shadow-mark" />login-form-pos
    //直接使用导致布局出现问题 改为将外层再套一层div
    //<Col span="8" className="floatele">
    // <div >v1.0.1803091</div>
    //</Col>
    return (
      showLogin ? ( <div className="login-layout" type="flex" justify="space-around" align="middle">
      <div className="floatele">v1.0.1807161</div>
      <Row className="login-row" type="flex" justify="space-around" align="middle">
        <Col span="8" className={ie9 && 'ie910'}>
          <p className="login-log"><img src={logImage} alt="终端数据分析平台" /></p>
          <p className="login-name">终端数据分析平台TDP</p>
          <Form onSubmit={this.handleLogin} className="login-form-defined">
            <div className="login-fields">
              <h3 className="text-center">登 录</h3>
              <FormItem>
                {getFieldDecorator('nickname', {
                  rules: [{ required: true, message: '用户名不能为空' }],
                })(
                  <Input
                    addonBefore={<Icon type="user" />}
                    type="text"
                    className="defined-form-input"
                    placeholder="请填写用户名"
                  />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '密码不能为空' }],
                })(
                  <Input
                    addonBefore={<Icon type="lock" />}
                    type="password"
                    className="defined-form-input"
                    placeholder="请填写密码"
                  />)}
              </FormItem>
              <FormItem className="login-form-tool hide">
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox> 记住密码</Checkbox>)}
                <a className="login-form-forgot pull-right">忘记密码</a>
              </FormItem>
            </div>
            <Button type="primary" htmlType="submit" className="login-form-button">
              立即登录
            </Button>
          </Form>
        </Col>
      </Row></div>) : null);
  }
}
Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.func,
  singleLogin: PropTypes.func,
};
const mapDispatchToProps = {
  login: (param, url) => loginAction(param, url),
  singleLogin: url => pointAction(url),
};

Login = Form.create()(Login);
export default connect(null, mapDispatchToProps)(Login);
