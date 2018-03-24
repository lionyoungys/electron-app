/**
 * demo界面组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './main.css';
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windows:{},    //窗口列表 
            current:null,    //当前展示窗口
        };
        this.toggleView = this.toggleView.bind(this);
    }

    toggleView(obj) {
        if (obj.route === this.state.current) return;
        if ('undefined' === typeof this.state.windows[obj.route]) {
            this.state.windows[obj.route] = router[obj.route];
            this.state.windows[obj.route].params = obj.params
            this.setState({windows:this.state.windows, current:obj.route});
        }
        console.log(this.state.windows);
    }

    render() {
        return (
            <div id='main'>
                <Top/>
                <div id='tab'></div>
                <div className='main-window'></div>
            </div>
        );
    }
}


class Top extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='top'>
                <div className='top-left'>速洗达商家管理系统</div>
                <div className='top-right'>
                    <div><div className='minimize'></div></div>
                    <div><div className='maxmize'></div></div>
                    <div><div className='closed'></div></div>
                </div>
            </div>
        );
    }
}




ReactDOM.render(<Main/>,document.getElementById('root'));