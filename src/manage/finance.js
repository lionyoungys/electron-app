/**
 * 财务对账组件
 * @author yangyunlong
 */
import React, {Component} from 'react';


class Finance extends Component {
    constructor(props) {
        super(props);
        this.state = {bank:'',cardNumber:'',balance:0,record:[],choose:0};
        this.changeTab = this.changeTab.bind(this);
    }

    componentDidMount() {
        let props = this.props;
        axios.post(api.U('finance'),api.data({token:props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({bank:result.from_bank,cardNumber:result.card_number,balance:result.remainder});
            console.log(result);
        });
        axios.post(api.U('financeRecord'),api.data({token:props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({record:result});
            console.log(result);
        });
    }

    changeTab(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('financeRecord'),api.data({token:this.props.token,state:id}))
        .then((response) => {
            let result = response.data.data;
            this.setState({record:result});
        });
        this.setState({choose:id});
    }

    render() {
        let props = this.props,
            state = this.state;
        const style = {
                  minHeight:'47px',lineHeight:'47px',fontSize:'16px',
                  background:'#f5f5f5',padding:'0 20px',display:'inline-block'
              },
              style2 = {color:'#09b1b0'};
        let html = state.record.map((obj, index) =>
            <div className='ui-row' key={index}>
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
        return (
            <div>
                <section className='ui-container'>
                    <header style={{textAlign:'center'}}>
                        <div style={style}>
                            每月初会将上月营业额打款至
                            <span style={style2}>{state.bank + state.cardNumber}</span>
                            (我们会在1&sim;2个工作日内进行处理,具体到账时间以银行到账时间为准)
                        </div>
                    </header>
                    <div className='ui-content'>
                        <div className='ui-finance-container'>
                            <div>
                                <nav 
                                    className={'ui-tab' + (0 == state.choose ? ' ui-tab-chosen' : '')}
                                    data-id='0'
                                    onClick={this.changeTab}
                                >全部</nav>
                                <nav 
                                    className={'ui-tab' + (1 == state.choose ? ' ui-tab-chosen' : '')}
                                    data-id='1'
                                    onClick={this.changeTab}
                                >收入</nav>
                                <nav 
                                    className={'ui-tab' + (3 == state.choose ? ' ui-tab-chosen' : '')}
                                    data-id='3'
                                    onClick={this.changeTab}
                                >支出</nav>
                            </div>
                            <div style={{fontSize:'18px'}}>
                                账户余额：
                                <span style={{fontSize:'30px',color:'#fd1603',}}>
                                    &yen;{state.balance}
                                </span>
                            </div>
                        </div>
                        {html}
                    </div>
                </section>
            </div>
        );
    }
}

export default Finance;