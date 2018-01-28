/**
 * 门店信息界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allModule:[],
            merchant:{},
            module:[],
            mcards:[{card_name:null,discount:null,price:null},{card_name:null,discount:null,price:null}],
            isEditor:false,
            infoUpdate:false,
            cardUpdate:false,
            moduleUpdate:false
        };
        this.adapter = this.adapter.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCardChange = this.handleCardChange.bind(this);
        this.handleModuleChange = this.handleModuleChange.bind(this);
    }
    componentDidMount() {
        axios.post(api.U('info'), api.D({token:this.props.token}))
        .then(response => {
            if (api.V(response.data)) {
                this.setState({
                    allModule:response.data.all_module,
                    mcards:response.data.result.mcards,
                    merchant:response.data.result.merchant,
                    module:response.data.result.module
                });
            }
            console.log(response.data);
        });
    }

    handleClick() {
        this.setState({isEditor:false});
        if (this.state.infoUpdate) {
            let info = this.state.merchant;
            info.token = this.props.token;
            axios.post(api.U('info_update'), api.D(info))
            .then(response => {
                this.setState({infoUpdate:false});
            });
        }
        if (this.state.cardUpdate) {
            axios.post(api.U('cards_update'), api.D({token:this.props.token,cards:JSON.stringify(this.state.mcards)}))
            .then(response => {
                this.setState({cardUpdate:false});
            });
        }
        if (this.state.moduleUpdate) {
            let modules = [];
            this.state.module.map(obj => modules.push(obj.module));
            console.log(modules);
            axios.post(api.U('module_update'), api.D({token:this.props.token,modules:JSON.stringify(modules)}))
            .then(response => {
                this.setState({moduleUpdate:false});
            });
        }
    }

    handleChange(e) {
        if (e.target.value.length <= 120) {
            this.state.merchant[e.target.dataset.key] = e.target.value;
            this.setState({merchant:this.state.merchant,infoUpdate:true});
        }
    }

    handleCardChange(e) {
        this.state.mcards[e.target.dataset.index][e.target.dataset.key] = e.target.value;
        this.setState({mcards:this.state.mcards,cardUpdate:true});
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
            freeAmount:this.state.merchant.freight_free_amount,
            cards:[
                {
                    card_name:this.state.mcards[0].card_name,
                    discount:this.state.mcards[0].discount,
                    price:this.state.mcards[0].price
                },
                {
                    card_name:this.state.mcards[1].card_name,
                    discount:this.state.mcards[1].discount,
                    price:this.state.mcards[1].price
                }
            ]
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
            data.cards[0].discount = (<input type='text' className='input' data-index='0' data-key='discount' value={this.state.mcards[0].discount} onChange={this.handleCardChange}/>);
            data.cards[0].price = (<input type='text' className='input' data-index='0' data-key='price' value={this.state.mcards[0].price} onChange={this.handleCardChange}/>);;
            data.cards[1].discount = (<input type='text' className='input' data-index='1' data-key='discount' value={this.state.mcards[1].discount} onChange={this.handleCardChange}/>);;
            data.cards[1].price = (<input type='text' className='input' data-index='1' data-key='price' value={this.state.mcards[1].price} onChange={this.handleCardChange}/>);;
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
                <Crumb data={[{key:0,value:'门店信息'}]} callback={this.props.callback}/>
                <div className='m-container'>
                    <table className='info'>
                        <tbody>
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
                            <tr>
                                <td className='first' rowSpan="2">专店会员卡</td>
                                <td className='last'>{data.cards[0].card_name}：&nbsp;折扣：{data.cards[0].discount}折&emsp;充值：{data.cards[0].price}元</td>
                            </tr>
                            <tr><td className='last'>{data.cards[1].card_name}：&nbsp;折扣：{data.cards[1].discount}折&emsp;充值：{data.cards[1].price}元</td></tr>
                        </tbody>
                    </table>
                    {
                        this.state.isEditor ?
                        <button className='m-btn middle confirm' onClick={this.handleClick}>确认修改</button>
                        :
                        <button className='m-btn middle confirm' onClick={() => this.setState({isEditor:true})}>编辑</button>
                    }
                    
                </div>
            </div>
        );
    }
}