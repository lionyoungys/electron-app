/**
 * 新增企业会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import Radio from '../UI/radio/App';
import './App.css';

export default class extends Component{
    constructor(props) {
        super(props);
        this.state = {data:{uname:'',sex:1,umobile:'',birthday:'',addr:'',remark:'',is_company:'0',cdiscount:''}};
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
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
    handleConfirm() {

    }

    render() {
        return (
            <div>
                <Crumb data={[{key:0,value:'会员管理',view:'member'},{key:1,value:'会员信息变更'}]} callback={this.props.changeView}/>
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
                {/* <UpdateDiscount 
                    show={state.discountShow} 
                    onCancelRequest={() => this.setState({discountShow:false})}
                    onConfirmRequest={this.onUpdateDiscountRequest}
                /> */}
                {/* <UpdateMobile 
                    show={state.mobileShow}
                    token={props.token}
                    mobile={user.mobile_number}
                    onCancelRequest={() => this.setState({mobileShow:false})}
                    onConfirmRequest={this.onUpdateMobileRequest}
                /> */}
            </div>
        );
    }
}

class UpdateDiscount extends Component{
    constructor(props) {
        super(props);
        this.state = {discount:''};
    }

    render() {
        let props = this.props,
            state = this.state;

        if (!props.show) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-update-discount'>
                    <div className='ui-mm-layer-title'>
                        <em className='ui-mm-icon-discount'>变更会员折扣</em>
                        <em className='ui-close3' onClick={props.onCancelRequest}></em>
                    </div>
                    <div style={{textAlign:'center',padding:'33px 0 30px',fontSize:'18px',color:'#999'}}>请输入新折扣信息</div>
                    <div style={{textAlign:'center',lineHeight:'40px',fontSize:'18px',paddingBottom:'29px'}}>
                        <input 
                            type='text'
                            style={{width:'198px',height:'38px',border:'1px solid #e0e7eb'}}
                            value={state.discount}
                            onChange={e => this.setState({discount:e.target.value})}
                        />&nbsp;折
                    </div>
                    <div style={{textAlign:'center'}}>
                        <input
                            type='button' 
                            className='ui-teamwork-confirm'
                            onClick={() => {
                                if (!isNaN(state.discount) && state.discount > 0 && state.discount < 10) {
                                    props.onConfirmRequest(state.discount);
                                }
                            }}
                        />
                    </div>
                </div>
            </section>
        );
    }
}