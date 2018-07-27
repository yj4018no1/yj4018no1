import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Radio, Badge, Card } from 'antd';
import Echarts from 'components/Echarts';
import { getSession } from 'store/requireAuth';
import { queryHome } from 'store/home';
import './Home.scss';
import { initOptionLine, initOptionPie } from './options';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let isHome = false;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { query } = this.props;
    const perm = getSession('bvs').permissions;
    let homeArr = [];
    homeArr = perm.filter(item => (item === 'homepage'));
    if (homeArr.length) {
      isHome = true;
      query();
    } else {
      isHome = false;
    }
  }

  handleChange(e) {
    const value = e.target.value;
    if (value === 'year') {
      this.setState({
        year: true,
      });
    } else {
      this.setState({
        year: false,
      });
    }
  }

  render() {
    const { home } = this.props;
    const { stocks, yearsCounts, monthsCounts } = home;
    const { year } = this.state;
    const optionLineMonth = initOptionLine('line', monthsCounts);
    const optionLineYear = initOptionLine('line', yearsCounts);
    const optionPie = initOptionPie('pie', stocks);
    return (
      <Card>
        { (isHome && (<Row type="flex" justify="center" align="middle" className="ant-home-style">
          <Col span={12}>
            <RadioGroup onChange={this.handleChange} defaultValue="month">
              <RadioButton value="month">月度统计</RadioButton>
              <RadioButton value="year">年度统计</RadioButton>
            </RadioGroup>
          </Col>
          <Col span={12} className="text-right">
            <Badge status="error" text="进货总数量" />
            <Badge status="warning" text="销售总数量" />
            <Badge status="success" text="库存总数量" />
          </Col>
          <Col span={24}>
            <Echarts
              type="line"
              options={year ? optionLineYear : optionLineMonth}
              height="300px"
              isLoading={home.fetching}
            />
          </Col>
          <Col span={24} style={{ marginTop: 20 }}>
            <Echarts
              type="pie"
              options={optionPie}
              height="370px"
              isLoading={home.fetching}
            />
          </Col>
        </Row>)) || '亲爱的， 欢迎回来！'
        }
      </Card>
    );
  }
}

Home.propTypes = {
  home: PropTypes.object,
  query: PropTypes.func,
};

const mapStateTopProps = state => ({
  home: state.home,
});

const mapDispatchToProps = {
  query: () => queryHome(),
};

export default connect(mapStateTopProps, mapDispatchToProps)(Home);
