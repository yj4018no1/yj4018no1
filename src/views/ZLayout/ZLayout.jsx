import React from 'react';
import { browserHistory, Link } from "react-router";
import { connect } from 'react-redux';
import './ZLayout.scss'


class ZLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;
        
        return (
            children ? ( <div style={ { height: 100+'%' } }> {children} </div>)
                : (
                <div className="firstpage">
                    <div>
                        <Link to='/ZFirst'>加载中...</Link>
                    </div>
                </div>)
        )
    };

    // componentDidMount(){
    //     browserHistory.push("/ZFirst");
    // }
}


export default connect(null, null)(ZLayout)