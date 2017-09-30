/**
 * 主页右侧界面组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
window.require('../static/api');
const token = localStorage.getItem(token);

class Business extends Component {
    constructor(props) {super(props);}
    componentDidMount() {
        axios.post(api.U('index'),api.data({token:token}))
        .then((response) => {
            let result = response.data.data;
            console.log(result);
        });
    }
    render() {
        return (<div></div>);
    }
}

ReactDOM.render(<Business/>,document.getElementById('business'));