/**
 * 会员余额组件
 * @author yangyunlong
 */
import React from 'react';
import Page from '../UI/page/App';
import SelectSearch from '../../Elem/SelectSearch';
import './App.css';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.state = {count:0,sum:0,pageCount:1,page:1,data:[],limit:10,cardNumber:null,mobile:null};
        this.query = this.query.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.redirect = this.redirect.bind(this);
        this.onSearchRequest = this.onSearchRequest.bind(this);
    }

    componentDidMount() {this.query()}

    handlePage(page) {this.query(page)}

    query(page, mobile, cardNumber) {
        page = ( tool.isSet(page) ? page : this.state.page );
        mobile = ( 'undefined' !== typeof mobile ? mobile : this.state.mobile);
        cardNumber = ( 'undefined' !== typeof cardNumber ? cardNumber : this.state.cardNumber);
        api.post(
            'member_balance',
            {
                token:this.props.token,
                page:page,
                limit:this.state.limit,
                card_number:cardNumber,
                mobile:mobile
            },
            (response, verify) => {
                if (verify) {
                    let result = response.data.result;
                    this.setState({
                        sum:result.sum,
                        count:result.count,
                        pageCount:result.page_count,
                        data:result.record,
                        cardNumber:cardNumber,
                        mobile:mobile,
                        page:page
                    });
                } else {
                    alert(response.data.msg);
                }
            }
        );
    }
    redirect(e) {
        this.props.changeView({view:'member_detail', param:e.target.dataset.number});
    }
    onSearchRequest(value, selected) {
        if ('手机号' === selected) {
            this.query(0, value, null);
        } else if ('会员卡号' === selected) {
            this.query(0, null, value);
        }
    }

    render () {
        let html = this.state.data.map( (obj, index) =>
                <tr key={obj.umobile + '_' + index} className='m-text-c'>
                    <td>{obj.umobile}</td>
                    <td>{obj.cmaster}</td>
                    <td>{obj.cname}</td>
                    <td>{obj.cbalance}</td>
                    <td>{obj.ctime}</td>
                    <td className='e-blue e-pointer' data-number={obj.umobile} onClick={this.redirect}>查看详情</td>
                </tr>
            );
        return (
            <div className='member-balance'>
                <div className='member-balance-top'>
                    <div className='left'>
                        累计会员数：<span>{this.state.count}</span>
                        累计会员金额：<span>&yen;{this.state.sum}</span>
                        <span className='e-blue'>下载</span>
                    </div>
                    <div className='right'>
                        <SelectSearch option={['手机号','会员卡号']} callback={this.onSearchRequest}/>
                    </div>
                </div>
                <div className='e-box'>
                    <table className='e-table border'>
                        <thead><tr><th>会员手机号</th><th>姓名</th><th>会员类型</th><th>余额</th><th>办理时间</th><th>操作</th></tr></thead>
                        <tbody>{html}</tbody>
                    </table>
                </div>
                <Page count={this.state.pageCount} current={this.state.page} callback={this.handlePage}/>
            </div>
        );
    }
}