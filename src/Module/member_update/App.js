/**
 * 会员信息修改组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Radio from '../UI/radio/App';
import Sms from '../UI/sms/App';
import './App.css';

export default class extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:{uname:'',sex:1,umobile:'',birthday:'',addr:'',remark:'',is_company:'0',cdiscount:''},
            show:false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSendRequest = this.onSendRequest.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.callback = this.callback.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('member_upd'),api.D({token:this.props.token,number:this.props.param}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result});
            console.log(response.data.result);
        });
        laydate.render({
            elem:this.input,
            min:'1980-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {
                this.state.data.birthday = value;
                this.setState({data:this.state.data})
            }
        });
    }
    handleClick(value, checked) {
        if (!checked) {
            this.state.data.sex = value;
            this.setState({data:this.state.data});
        }
    }
    handleChange(e) {
        this.state.data[e.target.dataset.key] = e.target.value;
        this.setState({data:this.state.data});
    }
    onSendRequest() {
        axios.post(api.U('member_sms'),api.D({token:this.props.token,uid:this.state.data.id}))
        .then(response => {});
    }
    handleConfirm() {
        let data = this.state.data;
        if (data.umobile.match(/^1\d{10}$/) === null) return;
        if ('' == data.uname) return;
        if (isNaN(data.cdiscount) || data.cdiscount > 10 || data.cdiscount <= 0) return;
        this.setState({show:true});
    }
    callback(smsCode) {
        let data = this.state.data,
            obj = {
                token:this.props.token,
                uid:data.id,
                umobile:data.umobile,
                uname:data.uname,
                sms_code:smsCode,
                remark:data.remark,
                addr:data.addr
            };
        if (1 == data.is_company) {
            obj.cdiscount = data.cdiscount;
        } else {
            obj.sex = data.sex;
            obj.birthday = data.birthday;
        }
        axios.post(api.U('member_submit'),api.D(obj))
        .then(response => {
            console.log(response.data);
        });
        this.setState({show:false});
    }

    render() {
        return (
            <div>
               <div className='m-container'>
                    <table className='m-table'>
                        <tbody className='member-update'>
                            <tr className='bd-lightgrey'>
                                <td>{0 == this.state.data.is_company ? '姓名' : '企业名称'}</td>
                                <td><input type='text' value={this.state.data.uname} data-key='uname' onChange={this.handleChange}/></td>
                            </tr>
                            {
                                0 == this.state.data.is_company ?
                                (
                                    <tr className='bd-lightgrey'>
                                        <td>性别</td>
                                        <td>
                                            <Radio value='1' checked={1 == this.state.data.sex} onClick={this.handleClick}>男</Radio>
                                            &emsp;&emsp;
                                            <Radio value='2' checked={2 == this.state.data.sex} onClick={this.handleClick}>女</Radio>
                                        </td>
                                    </tr>
                                )
                                : 
                                null
                            }
                            <tr className='bd-lightgrey'>
                                <td>手机号</td>
                                <td><input type='text' value={this.state.data.umobile} data-key='umobile' onChange={this.handleChange}/></td>
                            </tr>
                            {
                                0 == this.state.data.is_company ?
                                null
                                : 
                                (
                                    <tr className='bd-lightgrey'>
                                        <td>会员折扣</td>
                                        <td><input type='text' value={this.state.data.cdiscount} data-key='cdiscount' onChange={this.handleChange}/>&nbsp;&nbsp;折</td>
                                    </tr>
                                )
                            }
                            {
                                0 == this.state.data.is_company ?
                                (
                                    <tr className='bd-lightgrey'>
                                        <td>会员生日</td>
                                        <td><input type='text' ref={input => this.input = input} readOnly value={this.state.data.birthday} data-key='birthday' onChange={this.handleChange}/></td>
                                    </tr>
                                )
                                : 
                                null
                            }
                            <tr className='bd-lightgrey'>
                                <td>地址</td>
                                <td><input type='text' style={{width:'100%'}} value={this.state.data.addr} data-key='addr' onChange={this.handleChange}/></td>
                            </tr>
                            <tr className='bd-lightgrey'>
                                <td>备注</td>
                                <td><input type='text' style={{width:'100%'}} value={this.state.data.remark} data-key='remark' onChange={this.handleChange}/></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type='button' style={{marginTop:'20px'}} className='m-btn middle confirm' onClick={this.handleConfirm}>确定</button>
                </div>
                <Sms
                    show={this.state.show}
                    onClose={() => this.setState({show:false})}
                    number={this.props.param}
                    onSendRequest={this.onSendRequest}
                    callback={this.callback}
                />
            </div>
        );
    }
}

