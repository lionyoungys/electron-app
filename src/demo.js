/**
 * demo界面组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './tool';
import './demo.css';
class Exam extends Component {
    constructor(props) {super(props)}
    render() {return <div><h1>this is exam</h1></div>}
}
class Test extends Component {
    constructor(props) {super(props)}
    render() {return <div><h1>this is test</h1></div>}
}
class Quiz extends Component {
    constructor(props) {super(props)}
    render() {
        return (
            <div>
                <h1>this is quiz</h1>
            </div>
        );
    }
}
const router = {
    exam:{title:'考试', view:Exam},
    test:{title:'测验', view:Test},
    quiz:{title:'课堂测试', view:Quiz}
};
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
        // let tabs = this.state.tabs.map((obj, index) =>
        //             <div key={obj.id} data-index={index}>{obj.title}<i></i></div>
        //         ),
        //     windows = this.state.windows.map( (obj, index) => 
        //         <div style={{display:this.state.index}}></div>
        //     );
        let tabs = [],
            windows = [];
        for (var k in this.state.windows) {
            console.log(k);
        }

        return (
            <div id='main'>
                <Header toggleView={this.toggleView}/>
                <div id='tab'></div>
                <div className='main-window'></div>
            </div>
        );
    }
}

//头部组件
class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='header'>
                <div onClick={() => this.props.toggleView({route:'exam'})}>exam</div>
                <div onClick={() => this.props.toggleView({route:'test'})}>test</div>
                <div onClick={() => this.props.toggleView({route:'quiz'})}>quiz</div>
            </div>
        );
    }
}




ReactDOM.render(<Main/>,document.getElementById('root'));