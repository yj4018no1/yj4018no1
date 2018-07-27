import {Button, Modal, Progress} from 'antd';
import React, {Component, PropTypes} from 'react';
import {query} from 'store/fetch';

class ExportButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      percent: 0,
      count: 0,
      generation: 0,
    };
  }

  beforeExport = () => {
    this.setState({
      loading: true,
      percent: 0,
    }, this.getExportProgress)
  };

  getExportProgress = () => {
    const getExportState = () => {
      return query(progressUrl, this.paramsToString(params)).then((data) => {
        switch (data.state) {
          case 'success':
            this.setState({
              percent: 100,
              loading: false,
            });
            this.renderURL();
            break;
          case 'start':
          case 'running':
            let count = data.count || 1;
            let generation = data.generation || 0;
            const percent = Math.floor((generation / count ) * 100);
            this.setState({
              count,
              generation,
              percent,
            });
            if (this.state.loading) {
              setTimeout(getExportState, 5000);
            }
            break;
          case 'fail':
            break;
        }
      })
    };

    const {progressUrl, params} = this.props;
    getExportState();
  };

  paramsToString = (params) => {
    let query = '';
    const paramsJSON = JSON.stringify(params, (key, value) => {
      if (value) {
        return value;
      }
    });
    try {
      query = JSON.parse(paramsJSON);
    } catch (error) {
      query = {};
    }
    return Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
  };

  renderURL() {
    const {url} = this.props;
    const exportURL = `${url}?${this.paramsToString(this.props.params)}`;
    window.open(exportURL);
  }

  render() {
    const {loading, percent, count, generation} = this.state;
    return (
      <div style={{display: "inline-block"}}>
        <Modal title="正在导出"
               visible={loading}
               maskClosable={false}
               footer={null}
               onCancel={() => {
                 this.setState({loading: false})
               }}
        >
          <div className="clearfix" style={{margin: "0 auto", width: 400, height: 150}}>
            <div style={{float: 'left'}}>
              <Progress type="circle" percent={percent}/>
            </div>
            <div style={{float: 'left', marginLeft: 40, marginTop: 40, fontWeight: 500}}>
              <p style={{marginBottom: 20}}>预计导出:{count}条</p>
              <p>已导出:{generation}条</p>
            </div>
          </div>
        </Modal>
        <Button
          type="primary"
          icon="download"
          onClick={this.beforeExport}
          className="margin-right-10"
          loading={this.state.loading}
        >
          导 出
        </Button>
      </div>
    );
  }
}

ExportButton.propTypes = {
  params: PropTypes.object,
  url: PropTypes.string,
  progressUrl: PropTypes.string,
};


export default ExportButton;


