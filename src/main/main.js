import React, {Component} from 'react';
import ReactDOM from 'react-dom';
window.require('../static/api');
const token = localStorage.getItem('token');
class Base extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const baseStyle = {display:'flex',display:'-webkit-flex',flexDirection:'column',alignItems:'center'};
        const logo = {background:'url('+ this.props.logo +')',backgroundSize:'100% 100%'};
        return (
            <div style={baseStyle}>
                <div id="logo" style={logo}></div>
                <div id="name">{this.props.name}</div>
                <div id="state">{this.props.state}</div>
            </div>
        );
    }
}
axios.post(api.U('index'),api.data({token:token}))
.then((response)=>{
    var result = response.data.data;
    ReactDOM.render(
        <Base name={result.mname} state={result.state ? '营业中' : '暂停营业'} logo={api.host+result.circle_logo}/>,
        document.getElementById('base')
    );
});