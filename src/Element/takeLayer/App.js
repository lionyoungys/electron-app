/**
 * 添加项目弹窗组件
 * @author yerong.fan
 */
import React, {Component} from 'react';
import './App.css';
export default class extends Component {
	constructor(props) {
        super(props);                 
        this.colse = this.colse.bind(this);
    }
	
	colse(e) {			
		this.props.setState = ({isShow:false});		
	}
	render() {
		return (<div className="fixed-cloth"  style={{display:(this.props.show ? 'block' : 'none')}}><span onClick={this.colse}>{this.props.text }</span></div>);
	}
	
}

