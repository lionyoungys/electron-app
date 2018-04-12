/**
 * 换卡界面组件
 * @author yangyunlong
 */
import React from 'react';
import SelectSearch from '../../Elem/SelectSearch';
import './App.css';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[], show:false, tempData:{}, postData:{}};
        this.handleClick = this.handleClick.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        laydate.render({
            elem:this.input,
            value:'1980-01-01',
            min:'1950-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value => {
                this.postData.birthday = value;
                this.setState({postData:this.state.postData})
            })
        });
    }
    handleClick(e) {
        api.post('member_card_detail', {token:this.props.token,id:e.target.dataset.id}, (response, verify) => {
            let result = response.data.result;
            verify ? this.setState({show:true, tempData:result, postData:result}) : alert(response.data.msg);
        })
    }
    onSearch(value, selected) {
        if ('' === value) return;
        let type = '订单号/流水号' === selected ? 1 : ('会员卡号/充值卡号' === selected ? 2 : 3);
        api.post('member_cards', {token:this.props.token, type:type, number:value}, (response, verify) => {
            if (verify) {
                response.data.result.length > 0 && this.setState({data:response.data.result});
            } else {
                alert(response.data.msg);
            }
        })
    }
    handleSubmit() {
        let data = this.state.postData;
        api.post(
            'member_card_change', 
            {
                token:this.props.token,
                id:data.id,
                umobile:data.umobile,
                cmaster:data.cmaster,
                sex:( '男' == data.sex ? 1 : ('女' == data.sex ? 2 : 0) ),
                birthday:data.birthday,
                cbalance:( Math.floor(data.cbalance * 100 + data.other * 100) / 100 ),
                cdiscount:data.cdiscount
            },
            (response, verify) => {
                this.setState({show:false});
                if (verify) {
                    alert('操作成功');
                } else {
                    alert(response.data.msg);
                }
            }
        );
    }

    render() {
        let tempData = this.state.tempData,
            postData = this.state.postData,
            html = this.state.data.map(obj => 
            <tr key={obj.id}>
                <td>{obj.id}</td>
                <td>{obj.cmaster}</td>
                <td>{obj.umobile}</td>
                <td>{obj.recharge_number}</td>
                <td>{obj.sex}</td>
                <td>{obj.birthday}</td>
                <td>{obj.cname}</td>
                <td>{obj.cbalance}</td>
                <td>{obj.cdiscount}</td>
                <td>{obj.order_count}</td>
                <td>{0 == obj.use_type ? '未换卡' : '已换卡'}</td>
                <td>{0 == obj.use_type && <span className='e-blue e-pointer' data-id={obj.id} onClick={this.handleClick}>换卡</span>}</td>
            </tr>
        );
        return (
            <div className='e-box'>
                <p></p>
                <SelectSearch
                    option={['订单号/流水号', '会员卡号/充值卡号', '手机号']}
                    callback={this.onSearch}
                />
                <p></p>
                <hr/>
                <h1>已为您找到{this.state.data.length}条数据</h1>
                <table className='e-table border'>
                    <thead><tr>
                        <th>序号</th>
                        <th>姓名</th>
                        <th>手机</th>
                        <th>卡号</th>
                        <th>性别</th>
                        <th>生日</th>
                        <th>卡类型</th>
                        <th>金额</th>
                        <th>折扣</th>
                        <th>未取衣物</th>
                        <th>认领状态</th>
                        <th>操作</th>
                    </tr></thead>
                    <tbody>{html}</tbody>
                </table>
                <div className='change-card-toast' style={{display:(this.state.show ? null : 'none')}}>
                    <div>
                        <table className='e-table border'><tbody>
                            <tr><th colSpan='2'>老卡</th></tr>
                            <tr><td>姓名</td><td>{tempData.cmaster}</td></tr>
                            <tr><td>手机</td><td>{tempData.umobile}</td></tr>
                            <tr><td>卡号</td><td>{tempData.recharge_number}</td></tr>
                            <tr><td>性别</td><td>{tempData.sex}</td></tr>
                            <tr><td>生日</td><td>{tempData.birthday}</td></tr>
                            <tr><td>卡类型</td><td>{tempData.cname}</td></tr>
                            <tr><td>余额</td><td>{tempData.cbalance}</td></tr>
                            <tr><td>折扣</td><td>{tempData.cdiscount}</td></tr>
                            <tr><td>未取衣物</td><td>{tempData.order_count}</td></tr>
                        </tbody></table>
                        <div className='e-blue'>&gt;&gt;换卡后&gt;&gt;</div>
                        <table className='e-table border'><tbody>
                            <tr><th colSpan='2'>新卡</th></tr>
                            <tr>
                                <td>姓名</td>
                                <td>
                                    <input
                                        type='text'
                                        value={postData.cmaster}
                                        onChange={e => {this.state.postData.cmaster = e.target.value;this.setState({postData:this.state.postData})}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>手机</td>
                                <td>
                                    <input
                                        type='text'
                                        value={postData.umobile}
                                        onChange={e => {
                                            let value = e.target.value;
                                            if (isNaN(value)) return;
                                            this.state.postData.umobile = value;
                                            this.setState({postData:this.state.postData})}
                                        }
                                    />
                                </td>
                            </tr>
                            <tr><td className='e-grey'>卡号</td><td></td></tr>
                            <tr>
                                <td>性别</td>
                                <td>
                                    <input
                                        type='text'
                                        value={postData.sex}
                                        onChange={e => {this.state.postData.sex = e.target.value;this.setState({postData:this.state.postData})}}
                                    />
                                </td>
                            </tr>
                            <tr><td>生日</td><td><input type='text' value={postData.birthday} ref={input => this.input = input} readOnly/></td></tr>
                            <tr><td>会员类型</td><td>{postData.cname}</td></tr>
                            <tr><td>初始余额</td><td>{postData.other}</td></tr>
                            <tr>
                                <td>老卡余额转入</td>
                                <td>
                                    <input
                                        type='text'
                                        value={postData.cbalance}
                                        onChange={e => {
                                            let value = e.target.value;
                                            if (isNaN(value)) return;
                                            this.state.postData.cbalance = value;
                                            this.setState({postData:this.state.postData})}
                                        }
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>折扣</td>
                                <td>
                                    <input type='text' value={postData.cdiscount} onChange={e => {
                                            let value = e.target.value;
                                            if (isNaN(value) || value > 10 || value.toString().length > 4) return;
                                            this.state.postData.cdiscount = value;
                                            this.setState({postData:this.state.postData});
                                        }
                                    }/>
                                </td>
                            </tr>
                            <tr><td>未取衣物</td><td>{postData.order_count}</td></tr>
                        </tbody></table>
                    </div>
                    <div>
                        <h2>换卡后余额&yen;{Math.floor(postData.cbalance * 100 + postData.other * 100) / 100}</h2>
                        <div>
                            <button type='button' className='e-btn cancel' onClick={() => this.setState({show:false})}>取消</button>
                            &emsp;
                            <button type='button' className='e-btn confirm' onClick={this.handleSubmit}>确认</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}