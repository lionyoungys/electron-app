/**
 * 收件组件
 * @author yangyunlong
 */

import React from 'react';
import Search from '../UI/search/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id:'',name:'',mobile:'',time:'',orders:[],platform:{cbalance:'',cname:''},merchant:{cbalance:'',cname:''}};
        this.search = this.search.bind(this);
        this.nextStep = this.nextStep.bind(this);
    }
    search(value) {
        if (value.match(/^1\d{10}$/) !== null) {
            axios.post(api.U('member'), api.D({token:this.props.token,number:value}))
            .then(response => {
                let result = response.data.result;
                if (api.V(response.data)) {                    
                    this.setState({
                        id:result.id,
                        name:result.uname,
                        mobile:result.umobile,
                        time:result.last_time,
                        orders:result.orders,
                        platform:result.platform_card,
                        merchant:result.merchant_card                 
                    });
                } else {
                    this.props.changeView({view:'register',param:{number:value}});
                }
            });
        }        
    }
   nextStep() {'' !== this.state.id && this.props.changeView({view:'offline_add_item', param:this.state.id})}

    render () {
        let props = this.props,
            state = this.state,
            orders = state.orders.map((obj) => <div key={obj}>{obj}</div>);
        return (
            <div className='take'>
                <div><Search placeholder='请输入会员手机号' callback={this.search}/></div>
                <div>
                    <table>
                        
                    </table>
                </div>
                <div>
                    <input type='button' value='收衣下单' className='m-btn confirm large' onClick={this.nextStep}/>
                </div>
            </div>
        );
    }
}