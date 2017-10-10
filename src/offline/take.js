/**
 * 线下收衣组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Search} from '../static/UI';

class Take extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',mobile:'',time:'',orders:[],
            platformCard:'',platformLevel:'',platformBalance:'',
            merchantCard:'',merchantLevel:'',merchantBalance:''
        };
        this.crumbs = [{key:0,text:'收衣'}];
        this.search = this.search.bind(this);
    }
    search(word) {
        let props = this.props,
            reg = /^(\d|\w)+$/;
        if (word.match(reg) !== null) {
            axios.post(api.U('getUserInfo'), api.data({token:props.token,number:word}))
            .then((response) => {
                let result = response.data;
                console.log(result);
                if (api.verify(result)) {
                    let data = result.data;
                    this.setState({
                        name:data.username,mobile:data.mobile,time:data.join_time,orders:data.orders,
                        platformCard:data.platform_card.card_number,
                        platformLevel:1 == data.platform_card.card_type ? '金牌会员卡' : '钻石会员卡',
                        platformBalance:data.platform_card.card_sum,
                        merchantCard:data.card_number,merchantLevel:data.card_name,
                        merchantBalance:data.balance
                    });
                }
            });
        }
        console.log(word);
    }

    render () {
        let props = this.props,
            state = this.state,
            orders = state.orders.map((obj) =>
                <div className='ui-take-order-row' key={obj}>{obj}</div>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <div style={{textAlign:'center',paddingTop:'42px'}}>
                    <Search placeholder='请输入手机号／会员卡号' callback={this.search}/>
                </div>
                <div style={{color:'#fd592d',fontSize:'22px',textAlign:'center',paddingTop:'47px'}}>
                    请核对以下会员信息，确认无误后收衣下单
                </div>
                <div className='ui-take-info-container'>
                    <div className='ui-take-info-box'>
                        <div className='ui-take-info-title'>客户信息:</div>
                        <div className='ui-take-info-row'>客户姓名:{state.name}</div>
                        <div className='ui-take-info-row'>手机号:{state.mobile}</div>
                        <div className='ui-take-info-row'>上次到店:{state.time}</div>
                        <div className='ui-take-info-row ui-take-info-orders'>
                            <div>未取订单:</div><div>{orders}</div>
                        </div>
                    </div>
                    <div className='ui-take-info-box'>
                        <div className='ui-take-info-title'>会员卡信息:</div>
                        <div className='ui-take-info-row'>会员卡号:{state.platformCard}</div>
                        <div className='ui-take-info-row'>会员类型:{state.platformLevel}</div>
                        <div className='ui-take-info-row'>会员卡余额:&yen;{'' == state.platformBalance ? 0 : state.platformBalance}</div>
                    </div>
                    <div className='ui-take-info-box'>
                        <div className='ui-take-info-title'>专店会员卡信息:</div>
                        <div className='ui-take-info-row'>会员卡号:{state.merchantCard}</div>
                        <div className='ui-take-info-row'>会员类型:{state.merchantLevel}</div>
                        <div className='ui-take-info-row'>会员卡余额:&yen;{'' == state.merchantBalance ? 0 : state.merchantBalance}</div>
                    </div>
                </div>
                <div style={{paddingTop:'58px',textAlign:'center'}}>
                    <input type='button' value='收衣下单' className='ui-btn ui-btn-confirm ui-btn-large'/>
                </div>
            </div>
        );
    }
}

export default Take;