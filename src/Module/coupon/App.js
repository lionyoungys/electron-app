/**
 * 卡券中心界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[],count:null,date:tool.currentDate('yearmonth'),amount:null,start_date:null,end_date:null,make:'coupon',show:false};
        this.make = this.make.bind(this);
        this.query = this.query.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {
        laydate.render({
            elem:this.input,
            value:this.state.date,
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
                <Crumb data={[{key:0,value:'卡券中心'}]} callback={this.props.changeView}/>
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
                        <thead><tr className='m-text-c bd-lightgrey m-bg-white'><th>制作日期</th><th>类型</th><th>张数</th><th>操作</th></tr></thead>
                        <tbody>{html}</tbody>
                    </table>
                </div>
            </div>
        );
    }
}