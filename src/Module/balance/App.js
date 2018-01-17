/**
 * 财务对账组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bank:'',account:'',balance:0,record:[],checked:'all'};
        this.tab = [{value:'全部',key:'all'},{value:'收入',key:'income'},{value:'支出',key:'expend'}];
        this.changeTab = this.changeTab.bind(this);
    }


    componentDidMount() {
        axios.post(api.U('balance'),api.D({token:this.props.token}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                this.setState({balance:result.balance,bank:result.bank,account:result.account,record:result.record});
                console.log(response.data);
            }
        });
    }

    changeTab(e) {
        let key = e.target.dataset.key;
        axios.post(api.U('balance'),api.D({token:this.props.token,type:key}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                this.setState({record:result.record,balance:result.balance,checked:key});
            }
        });
    }
    adapter(obj) {
        obj.type *= 1;
        switch (obj.type)
        {
            case 0:
                return (<span className='detail'>明细：<span className='word'>营收</span>{obj.amount}-<span className='word'>平台服务费</span>{obj.platform_gain}</span>);
            case 1:
                return (<span className='detail'>明细：<span className='word'>返现</span>{obj.real_amount}</span>);
            case 2:
                return (<span className='detail'>明细：<span className='word'>专店卡充值</span>{obj.real_amount}</span>);
            case 10:
                return (<span className='detail'>明细：<span className='word'>平台打款</span>{obj.real_amount}</span>);
        }
    }

    render() {
        let props = this.props,
            state = this.state;
        let html = state.record.map((obj, index) =>
            <div className='row' key={index}>
                <span><i className='prefix'></i>&emsp;{10 == obj.type ? '出账' : '入账'}</span>
                {this.adapter(obj)}
                <span>{obj.trade_time}</span>
                {10 == obj.type ? (<span className='m-green'>-&yen;{obj.real_amount}</span>) : (<span className='m-red'>+&yen;{obj.real_amount}</span>)}
            </div>
        );
        let tabs = this.tab.map(obj => 
            <span
                key={obj.key}
                data-key={obj.key}
                className={'m-tab' + (this.state.checked == obj.key ? ' checked': '')}
                onClick={this.changeTab}
            >{obj.value}</span>
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'财务对账'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='balance-title'>
                        账户余额结算周期为T+7，平台将通过银行打款结算至
                        <span>{this.state.bank + this.state.account}</span>
                        账户，每个账期内余额借款最低1000元起，不满1000元将累计至下一个账期结算
                    </div>
                    <div className='m-box balance'>
                        <div><div>{tabs}</div><div>账户余额：<span>&yen;{state.balance}</span></div></div>
                        {html}
                        <div className='m-blue'>下载</div>
                    </div>
                </div>
            </div>
        );
    }
}