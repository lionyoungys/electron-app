/**
 * 用户评价组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Starts,MyChart} from '../static/UI';

export default class Operate extends Component {
    constructor(props) {
        super(props);
        this.input = null;
        this.state = {
            total:'0',previousTotal:'0',
            currentProfit:'0',previousProfit:'0',profitInterest:'0',
            currentOrder:'0',previousOrder:'0',orderInterest:'0',
            currentCancel:'0',previousCancel:'0',cancelInterest:'0',
            day:[],currentData:[],previousData:[]
        };
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        //laydate plugin init
        laydate.render({
            elem:this.input,
            type:'month',
            value:new Date(),
            min:'2016-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {}
        });
        this.getData();
    }

    getData(date) {
        if (!func.isSet(date)) date = '';
        axios.post(
            api.U('operate'),
            api.data({token:this.props.token,date:date})
        )
        .then((respones) => {
            let result = respones.data.data;
            this.setState({
                total:result.sum,
                previousTotal:result.psum,
                currentProfit:result.now.sum,
                currentOrder:result.now.all,
                currentCancel:result.now.cancel,
                previousProfit:result.previous.sum,
                previousOrder:result.previous.all,
                previousCancel:result.previous.cancel,
                profitInterest:result.proportion.sum,
                orderInterest:result.proportion.all,
                cancelInterest:result.proportion.cancel,
                day:result.day,
                currentData:result.now_sum,
                previousData:result.previous_sum,
            });
            console.log(result);
        });
    }

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs crumbs={[{text:'经营分析',key:0}]} callback={props.changeView}/>
                <div className='ui-container'>
                    <div style={{paddingLeft:'70px'}}>
                        <input 
                            type='text' 
                            className='ui-input ui-text-center' 
                            readOnly
                            ref={(input) => {this.input = input}}
                        />
                    </div>
                    <div className='ui-content' style={{paddingLeft:'30px'}}>
                        截至目前营业额：{state.total}&emsp;&emsp;上月同期营业额：{state.previousTotal}
                    </div>
                    <div className='ui-content' style={{paddingLeft:'30px'}}>
                        <MyChart xAxis={state.day} current={state.currentData} previous={state.previousData}/>
                    </div>
                    <div style={{padding:'60px 0 0 30px',width:'630px'}}>
                        <div className='ui-row'>
                            <div>&emsp;&emsp;&emsp;&emsp;</div>
                            <div>本月</div>
                            <div>上月</div>
                            <div>涨幅</div>
                        </div>
                        <div className='ui-row'>
                            <div>营业额：</div>
                            <div>{state.currentProfit}</div>
                            <div>{state.previousProfit}</div>
                            <div style={{color:(state.profitInterest > 0 ? 'red' : '#0bb1a7')}}>
                                {(state.profitInterest > 0 ? '+' : '') + state.profitInterest}%
                            </div>
                        </div>
                        <div className='ui-row'>
                            <div>订单数：</div>
                            <div>{state.currentOrder}</div>
                            <div>{state.previousOrder}</div>
                            <div style={{color:(state.orderInterest > 0 ? 'red' : '#0bb1a7')}}>
                                {(state.orderInterest > 0 ? '+' : '') + state.orderInterest}%
                            </div>
                        </div>
                        <div className='ui-row'>
                            <div>取消单：</div>
                            <div>{state.currentCancel}</div>
                            <div>{state.previousCancel}</div>
                            <div style={{color:(state.cancelInterest > 0 ? 'red' : '#0bb1a7')}}>
                                {(state.cancelInterest > 0 ? '+' : '') + state.cancelInterest}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}