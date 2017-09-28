import React, {Component} from 'react';
import ReactDOM from 'react-dom';

//宽180px 高30px 提示框 param:text=提示信息    
class Notice extends Component {
    constructor(props) {super(props);this.top = 'undefined' === typeof this.props.top ? 0 : this.props.top;}
    render() {
        let style = {
            color:'rgb(255,255,255)',background:'black',borderRadius:'3px',fontSize:'16px',
            height:'30px',lineHeight:'30px',width:'180px',textAlign:'center',
            display:this.props.display,overflow:'hidden',
            position:'fixed',left:'calc((100% - 180px) / 2)',top:this.top
        };
        return (<div style={style}>{this.props.text}</div>);
    }
}

export {Notice};