/**
 * 会员消费报表组件
 * @author yangyunlong
 */
import React from 'react';
import Page from '../UI/page/App';
import './App.css';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {count:0,sum:0,pageCount:1,page:1,data:[],limit:10};
        this.query = this.query.bind(this);
        this.handlePage = this.handlePage.bind(this);
    }

    componentDidMount() {this.query()}

    handlePage(page) {this.setState({page:page});this.query(page);}

    query(page) {
        axios.post(
            api.U('member_balance'),
            api.D({
                token:this.props.token,
                page:( tool.isSet(page) ? page : this.state.page ),
                limit:this.state.limit
            })
        )
        .then(response => {
            let result = response.data.result;
            this.setState({sum:result.sum,count:result.count,pageCount:result.page_count,data:result.record});
        });
    }

    render () {
        let html = this.state.data.map(obj =>
                <tr key={obj.umobile} className='m-text-c'>
                    <td>{obj.umobile}</td>
                    <td>{obj.uname}</td>
                    <td>{obj.cname}</td>
                    <td>{obj.cbalance}</td>
                    <td>{obj.ctime}</td>
                    <td className='m-blue m-text-c'>查看详情</td>
                </tr>
            );
        return (
            <div>
                <div className='m-container'>
                    <div className='m-box'>
                        累计会员数：<span style={{fontSize:'22px'}}>{this.state.count}</span>
                        &emsp;&emsp;
                        累计会员金额：<span style={{fontSize:'22px'}}>&yen;{this.state.sum}</span>
                        &emsp;&emsp;&emsp;
                        <span className='m-blue'>下载</span>
                    </div>
                    <div className='m-box'>
                        <table className='m-table tr-b'>
                            <thead><tr className='m-bg-white'><th>会员手机号</th><th>姓名</th><th>会员类型</th><th>余额</th><th>办理时间</th><th>操作</th></tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                    <div className='m-box'><Page count={this.state.pageCount} current={this.state.page} callback={this.handlePage}/></div>
                </div>
            </div>
        );
    }
}