/**
 * 合作门店界面组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[],show:false};
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        this.query();
    }
    query() {
        axios.post(api.U('teamwork'), api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result,show:false});
        });
    }

    render() {
        let html = this.state.data.map(obj => 
            <tr className='bd-lightgrey' key={obj.accept_id}>
                <td><img src={obj.mlogo} className='teamwork-logo'/>&nbsp;&nbsp;{obj.mname}</td>
                <td>{obj.accept_id}</td>
                <td>{obj.phone_number}</td>
                <td>{obj.maddress}</td>
            </tr>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'合作门店'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='m-text-r' style={{position:'relative'}}>
                        <button className='m-btn confirm middle' type='button' onClick={() => this.setState({show:true})}>+ 新增合作门店</button>
                        <Query token={this.props.token} callback={this.query} show={this.state.show} onClose={() => this.setState({show:false})}/>
                    </div>
                    <div className='m-box'>
                        <table className='m-table m-text-c'>
                            <thead><tr className='bd-lightgrey m-bg-white'><th>名称</th><th>编号</th><th>手机号</th><th>地址</th></tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {value:'',data:[],checked:null}
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.callback = this.callback.bind(this);
    }

    handleChange(e) {
        let value = e.target.value;
        this.setState({value:value,checked:null});
        if (value.length < 1) return;
        axios.post(api.U('merchant_search'),api.D({token:this.props.token,keywords:value}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result});
            console.log(response.data.result);
        });
    }
    handleClick(e) {
        this.setState({value:this.state.data[e.target.dataset.index].mname,checked:e.target.dataset.id});
    }
    callback() {
        if (null !== this.state.checked) {
            axios.post(api.U('teamwork_add'),api.D({token:this.props.token,ids:this.state.checked}))
            .then(response => {
                if (api.V(response.data)) {
                    this.props.callback();
                } else {
                    alert(response.data.msg);
                }
            });
        }
    }

    render() {
        if (!this.props.show) return null;
        let html = this.state.data.map( (obj, index) => 
            <div key={obj.id} data-id={obj.id} data-index={index} onClick={this.handleClick}>{obj.mname}&nbsp;&nbsp;{obj.id}</div>
        );
        return (
            <div className='teamwork-query'>
                <i className="fa fa-times" onClick={this.props.onClose}></i>
                <div>新增合作门店</div>
                <div className='body'>
                    <div>
                        <input type='text' placeholder='请输入合作店铺名称/编号' value={this.state.value} onChange={this.handleChange}/>
                        <button className='m-btn confirm' type='button' onClick={this.callback}>确定</button>
                        <div className='query-result' style={{display:(this.state.data.length > 0 ? 'block' : 'none')}}>
                            {html}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}