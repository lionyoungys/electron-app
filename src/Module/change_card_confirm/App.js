/**
 * 换卡二次确认界面组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{}, requestData:{}};
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
                this.state.requestData.birthday = value;
                this.setState({requestData:this.state.requestData})
            })
        });
        api.post('member_card_detail', {token:this.props.token,id:this.props.param}, (response, verify) => {
            if (verify) {
                let result = response.data.result,
                    requestData = tool.getObjectByValue(result);
                if ('未知' == requestData.birthday) requestData.birthday = '1980-01-01';
                this.setState({data:result, requestData:requestData});
            } else {
                alert(response.data.msg);
            }
        })
    }

    handleSubmit() {
        let data = this.state.requestData;
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
                if (verify) {
                    alert('换卡成功');
                } else {
                    alert(response.data.msg);
                }
            }
        );
    }

    render() {
        let data = this.state.data,
            requestData = this.state.requestData;
        return (
            <div className='change-card-confirm'>
                <div>
                    <div>老卡</div>
                    <table className='change-card-table'><tbody>
                        <tr><td>姓名</td><td>{data.cmaster}</td></tr>
                        <tr><td>手机</td><td>{data.umobile}</td></tr>
                        <tr><td>卡号</td><td>{data.recharge_number}</td></tr>
                        <tr><td>性别</td><td>{data.sex}</td></tr>
                        <tr><td>生日</td><td>{data.birthday}</td></tr>
                        <tr><td>卡类型</td><td>{data.cname}</td></tr>
                        <tr><td>余额</td><td>{data.cbalance}</td></tr>
                        <tr><td>折扣</td><td>{data.cdiscount}</td></tr>
                        <tr><td>未取衣物</td><td>{data.order_count}</td></tr>
                    </tbody></table>
                </div>
                <div></div>
                <div>
                    <div>新卡</div>
                    <table className='change-card-table'><tbody>
                        <tr>
                            <td>姓名</td>
                            <td>
                                <input
                                    type='text'
                                    value={requestData.cmaster}
                                    onChange={e => {this.state.requestData.cmaster = e.target.value;this.setState({requestData:this.state.requestData})}}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>手机</td>
                            <td>
                                <input
                                    type='text'
                                    value={requestData.umobile}
                                    onChange={e => {
                                        let value = e.target.value;
                                        if (isNaN(value)) return;
                                        this.state.requestData.umobile = value;
                                        this.setState({requestData:this.state.requestData})}
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
                                    value={requestData.sex}
                                    onChange={e => {this.state.requestData.sex = e.target.value;this.setState({requestData:this.state.requestData})}}
                                />
                            </td>
                        </tr>
                        <tr><td>生日</td><td><input type='text' value={requestData.birthday} ref={input => this.input = input} readOnly/></td></tr>
                        <tr><td>会员类型</td><td>{requestData.cname}</td></tr>
                        <tr><td>初始余额</td><td>{requestData.other}</td></tr>
                        <tr>
                            <td>老卡余额转入</td>
                            <td>
                                <input
                                    type='text'
                                    value={requestData.cbalance}
                                    onChange={e => {
                                        let value = e.target.value;
                                        if (isNaN(value)) return;
                                        this.state.requestData.cbalance = value;
                                        this.setState({requestData:this.state.requestData})}
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>折扣</td>
                            <td>
                                <input type='text' value={requestData.cdiscount} onChange={e => {
                                    let value = e.target.value;
                                    if (isNaN(value) || value > 10 || value.toString().length > 4) return;
                                    this.state.requestData.cdiscount = value;
                                    this.setState({requestData:this.state.requestData});
                                    }
                                }/>
                            </td>
                        </tr>
                        <tr><td>未取衣物</td><td>{requestData.order_count}</td></tr>
                        </tbody></table>
                </div>
                <div>
                    <div>
                        <span style={{fontSize:'14px'}}>
                            换卡后余额：
                            <span style={{color:'red',fontSize:'16px'}}>&yen;{Math.floor(requestData.cbalance * 100 + requestData.other * 100) / 100}</span>
                        </span>
                        &emsp;&emsp;&emsp;
                        <button type='button' className='e-btn cancel' data-view='change_card' onClick={this.props.changeView}>取消</button>
                        &emsp;
                        <button type='button' className='e-btn confirm' onClick={this.handleSubmit}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}