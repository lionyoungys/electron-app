/**
 * 卡券中心界面组件
 * @author yangyunlong
 */

import React from 'react';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.state = {
            data:[],
            count:null,
            date:tool.currentDate('yearmonth'),
            amount:null,
            start_date:null,
            end_date:null,
            make:'coupon',
            show:false
        };
        this.make = this.make.bind(this);
        this.query = this.query.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
        laydate.render({
            elem:this.input,
            min:'1980-01-01',
            max:0,
            type:'month',
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {
                this.setState({date:value});
                this.query();
            }
        });
        this.query();
    }

    make(e) {this.setState({make:e.target.dataset.make,show:true})}
    query() {
        axios.post(api.U('coupon'),api.D({token:this.props.token,date:this.state.date}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result,
                    len = result.length,
                    tempLen = 0,
                    tempData = [];
                for (let i = 0;i < len;++i) {
                    tempLen = result[i].records.length;
                    for (let j = 0;j < tempLen;++j) {
                        tempData.push(result[i].records[j]);
                    }
                }
                this.setState({data:tempData});
            }
        });
    }

    redirect(e) {
        let data = e.target.dataset;
        this.props.changeView({view:'coupon_detail',param:{type:data.type,id:data.id}});
    }

    render() {
        let html = this.state.data.map(obj => 
            <tr className='m-text-c bd-lightgrey' key={obj.id}>
                <td>{obj.make_time}</td>
                <td>{1 == obj.type ? '充值卡' : '优惠券'}</td>
                <td>{obj.make_value}</td>
                <td>{obj.used_count}/{obj.make_count}</td>
                <td>
                    <button
                        type='button'
                        className='m-btn m-btn-editor'
                        data-type={obj.type}
                        data-id={obj.id}
                        onClick={this.redirect}
                    >查看详情</button>
                </td>
            </tr>
        );
        return (
            <div>
                <div className='m-container coupon'>
                    <div>
                        <span onClick={this.make} data-make='coupon'></span>
                        <span onClick={this.make} data-make='card'></span>
                    </div>
                    <div>
                        <span>卡券查询</span>
                        <span ref={input => this.input = input} className='m-select-postfix'>{this.state.date}&emsp;&emsp;</span>
                    </div>
                    <table className='m-table'>
                        <thead><tr className='m-text-c bd-lightgrey m-bg-white'><th>制作日期</th><th>类型</th><th>面值</th><th>张数</th><th>操作</th></tr></thead>
                        <tbody>{html}</tbody>
                    </table>
                </div>
                <CouponLayer
                    show={this.state.show}
                    token={this.props.token}
                    make={this.state.make}
                    changeView={this.props.changeView}
                    onCloseRequest={() => this.setState({show:false})}
                />
            </div>
        );
    }
}

class CouponLayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count:'',amount:'',start:tool.currentDate('date'),end:tool.currentDate('date')}
        this.submit = this.submit.bind(this);
        this.onCloseRequest = this.onCloseRequest.bind(this);
    }
    componentDidMount() {
        laydate.render({
            elem:this.input,
            value:this.state.start,
            min:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {this.setState({start:value})}
        });
        laydate.render({
            elem:this.input2,
            value:this.state.end,
            min:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {this.setState({end:value})}
        });
    }
    onCloseRequest() {
        this.setState({count:'',amount:'',start:tool.currentDate('date'),end:tool.currentDate('date')});
        this.props.onCloseRequest();
    }

    submit() {
        let count = this.state.count,
            amount = this.state.amount;
        if (isNaN(count) || isNaN(amount) || (count * 1) > 100) return;
        axios.post(
            api.U( ('coupon' == this.props.make ? 'coupon_make' : 'recharge_make') ),
            api.D({token:this.props.token,count:count,value:amount,start_time:this.state.start,end_time:this.state.end})
        )
        .then(response => {
            api.V(response.data) && this.props.changeView({
                view:'coupon_detail',
                param:{type:('coupon' == this.props.make ? 0 : 1),result:response.data.result}
            });
        });
    }
    render() {
        return (
            <div className='m-layer-bg' style={{display:(this.props.show ? 'block' : 'none')}}>
                <div className='coupon-layer'>
                <i className='fa fa-times-circle close' onClick={this.onCloseRequest}></i>
                    <div>
                        <label htmlFor='coupon_count'>制作张数:</label>
                        <input
                            type='text' 
                            id='coupon_count' 
                            value={this.state.count} 
                            placeholder='单次最大100张'
                            maxLength='3'
                            onChange={e => this.setState({count:e.target.value})}
                        />&nbsp;&nbsp;&nbsp;张
                    </div>
                    <div>
                        <label htmlFor='coupon_amount'>金额:</label>
                        <input
                            type='text'
                            id='coupon_amount'
                            value={this.state.amount} 
                            onChange={e => this.setState({amount:e.target.value})}
                        />&nbsp;&nbsp;&nbsp;元
                    </div>
                    <div>
                        <label>开始使用日期:</label>
                        <input ref={input1 => this.input = input1} readOnly type='text'/>
                    </div>
                    <div>
                        <label>结束使用日期:</label>
                        <input ref={input2 => this.input2 = input2} readOnly type='text'/>
                    </div>
                    <div><button type='button' className='m-btn m-btn-middle m-btn-confirm' onClick={this.submit}>一键生成</button></div>
                </div>
            </div>
        );
    }
}