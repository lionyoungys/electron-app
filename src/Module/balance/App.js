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

    render() {
        let props = this.props,
            state = this.state;
        let html = state.record.map((obj, index) =>
            <div className='row' key={index}>
                <span className='ui-finance-prefix'>{1 == obj.state ? '入账' : '出账'}</span>
                {
                    1 == obj.state ?
                    (
                        <span>
                        明细：<span className='ui-finance-small-word'>营收</span>{obj.total}-
                        <span className='ui-finance-small-word'>平台服务费</span>{obj.mch_get}
                        </span>
                    ) 
                    : 
                    (
                        <span>
                            明细：<span className='ui-finance-small-word'>平台打款</span>
                            {obj.sum}
                        </span>
                    )
                }
                <span>{obj.time}</span>
                {
                    1 == obj.state ? 
                    (<span style={{color:'red'}}>+&yen;{obj.sum}</span>) 
                    : 
                    (<span style={{color:'green'}}>-&yen;{obj.sum}</span>)
                }
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
                    </div>
                </div>
            </div>
        );
    }
}