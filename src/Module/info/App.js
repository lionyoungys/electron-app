/**
 * 门店信息界面组件
 * @author yangyunlong
 */

import React from 'react';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allModule:[],
            merchant:{},
            module:[],
            isEditor:false,
            infoUpdate:false,
            moduleUpdate:false
        };
        this.adapter = this.adapter.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleModuleChange = this.handleModuleChange.bind(this);
        this.turnStatus = this.turnStatus.bind(this);
    }
    componentDidMount() {
        api.post('info', {token:this.props.token}, (response, verify) => {
            if (verify) {
                this.setState({
                    allModule:response.data.all_module,
                    merchant:response.data.result.merchant,
                    module:response.data.result.module
                });
            } else {
                alert(response.data.msg);
            }
        });
    }
    turnStatus() {
        let open = 10 == this.state.merchant.mstatus ? 0 : 1;
        api.post('toggle', {token:this.props.token,open:open}, (response, verify) => {
            if (verify) {
                this.state.merchant.mstatus = open ? 10 : 11;
                this.setState({merchant:this.state.merchant});
            } else {
                ui.msg(response.data.msg);
            }
        });
    }

    handleClick() {
        this.setState({isEditor:false});
        if (this.state.infoUpdate) {
            let info = this.state.merchant;
            info.token = this.props.token;
            api.post('info_update', info, (response, verify) => {
                this.setState({infoUpdate:false});
                if (!verify) alert(response.data.msg);
            });
        }
        if (this.state.moduleUpdate) {
            let modules = [];
            this.state.module.map(obj => modules.push(obj.module));
            api.post('module_update', {token:this.props.token,modules:JSON.stringify(modules)}, (response, verify) => {
                this.setState({moduleUpdate:false});
                if (!verify) alert(response.data.msg);
            });
        }
    }

    handleChange(e) {
        if (e.target.value.length <= 120) {
            this.state.merchant[e.target.dataset.key] = e.target.value;
            this.setState({merchant:this.state.merchant,infoUpdate:true});
        }
    }

    handleModuleChange(value, checked) {
        let index = null;
        if (checked) {
            index = value.inObjectArray(this.state.module, 'module');
            -1 !== index && this.state.module.splice(index, 1);
        } else {
            index = value.inObjectArray(this.state.allModule, 'module');
            -1 !== index && this.state.module.push(this.state.allModule[index]);
        }
        this.setState({module:this.state.module,moduleUpdate:true});
    }

    adapter() {
        let data = {
            number:this.state.merchant.phone_number,
            range:this.state.merchant.mrange,
            desc:this.state.merchant.mdesc,
            freight:this.state.merchant.freight_price,
            freeNum:this.state.merchant.freight_free_num,
            freeAmount:this.state.merchant.freight_free_amount
        };
        let module = [];
        this.state.module.map(obj => module.push(obj.module_name));
        data.module = module.length > 0 ? module.toString() : <span>&emsp;</span>;
        if (this.state.isEditor) {
            data.number = (<input type='text' value={this.state.merchant.phone_number} data-key='phone_number' onChange={this.handleChange}/>);
            data.range = (<span><input type='text' value={this.state.merchant.mrange} data-key='mrange' onChange={this.handleChange}/>&nbsp;km</span>);
            data.freight = (<input type='text' value={this.state.merchant.freight_price} data-key='freight_price' onChange={this.handleChange}/>);
            data.freeNum = (<input type='text' value={this.state.merchant.freight_free_num} data-key='freight_free_num' onChange={this.handleChange}/>);
            data.freeAmount = (<input type='text' value={this.state.merchant.freight_free_amount} data-key='freight_free_amount' onChange={this.handleChange}/>);
            data.desc = (
                <div>
                    <textarea value={this.state.merchant.mdesc} data-key='mdesc' onChange={this.handleChange} maxLength='120'></textarea>
                    <i className='m-counter'>{this.state.merchant.mdesc.length}/120</i>
                </div>
            );
           data.module = this.state.allModule.map(obj =>
                <Checkbox
                    key={obj.module}
                    checked={-1 !== obj.module.inObjectArray(this.state.module, 'module')}
                    value={obj.module}
                    onClick={this.handleModuleChange}
                >{obj.module_name}&emsp;&emsp;</Checkbox>
            );
        }
        return data;
    }
    render() {
            let data = this.adapter();
        return (
            <div>
                <div className='m-container'>
                    <table className='info'>
                        <tbody>
                            <tr>
                                <td className='first'>营业状态</td>
                                <td className='last'>
                                    {
                                        10 == this.state.merchant.mstatus
                                        ?
                                        <span className='e-open' onClick={this.turnStatus}>营业中</span>
                                        :
                                        <span className='e-shut' onClick={this.turnStatus}>休息中</span>
                                    }
                                </td>
                            </tr>
                            <tr><td className='first'>门店编号</td><td className='last'>{this.state.merchant.id}</td></tr>
                            <tr><td className='first'>门店名称</td><td className='last'>{this.state.merchant.mname}</td></tr>
                            <tr><td className='first'>门店地址</td><td className='last'>{this.state.merchant.maddress}</td></tr>
                            <tr><td className='first'>门店电话</td><td className='last'>{data.number}</td></tr>
                            <tr><td className='first'>服务范围</td><td className='last'>{data.range}</td></tr>
                            <tr><td className='first'>门店模块</td><td className='last'>{data.module}</td></tr>
                            <tr><td className='first'>商家信息</td><td className='last'>{data.desc}</td></tr>
                            <tr>
                                <td className='first' rowSpan="3">上门服务费</td>
                                <td className='last'>上门服务费：{data.freight} 元</td>
                            </tr>
                            <tr><td className='last'>满减件数&emsp;：{data.freeNum} 件</td></tr>
                            <tr><td className='last'>满减金额&emsp;：{data.freeAmount} 元</td></tr>
                        </tbody>
                    </table>
                    {
                        this.state.isEditor ?
                        <button className='m-btn middle confirm' onClick={this.handleClick}>确认修改</button>
                        :
                        <button className='m-btn middle confirm' onClick={() => {'undefined' !== typeof this.state.merchant.mdesc && this.setState({isEditor:true})}}>编辑</button>
                    }
                    
                </div>
            </div>
        );
    }
}