/**
 * 主界面弹出层组件组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React, {Component} from 'react';
import './static/api';
import './static/UI.css';
export class FeedBack extends Component {
    constructor(props) {
        super(props);
        this.state = {content:'',len:0};
        this.changeContent = this.changeContent.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    changeContent(e) {
        let value = e.target.value;
        this.setState({content:value,len:value.length});
    }
    onConfirm() {
        axios.post(api.U('feedback'),api.data({token:this.props.token,content:this.state.content}))
        .then((response) => {
            if (api.verify(response.data)) {
                this.setState({content:'',len:0});
                this.props.onCancelRequest();
            }
        });
    }

    render() {
        if (!this.props.show) return null;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-feedback'>
                    <div className='ui-feedback-bg'></div>
                    <div className='ui-feedback-inputer'>
                        <textarea 
                            placeholder='意见反馈需小于100字' 
                            maxLength='100' 
                            value={this.state.content}
                            onChange={this.changeContent}
                        ></textarea>
                        <em 
                            className='ui-textarea-postfix' 
                            style={{right:'24px',bottom:'30px'}}
                        >{this.state.len}/100</em>
                    </div>
                    <div className='ui-feedback-btn-area'>
                        <input 
                            type='button' 
                            value='取消' 
                            className='ui-btn ui-btn-cancel ui-btn-large'
                            onClick={this.props.onCancelRequest}
                        />
                        &emsp;&emsp;&emsp;&emsp;
                        <input 
                            type='button' 
                            value='确认' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.onConfirm}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

export class UpdatePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {newPassword:'',confirmPassword:'',oldPassword:''};
        this.changeConfirmPassword = this.changeConfirmPassword.bind(this);
        this.changeNewPassword = this.changeNewPassword.bind(this);
        this.changeOldPassword = this.changeOldPassword.bind(this);
        this.submit = this.submit.bind(this);
    }
    changeNewPassword(e) {this.setState({newPassword:e.target.value});}
    changeConfirmPassword(e) {this.setState({confirmPassword:e.target.value});}
    changeOldPassword(e) {this.setState({oldPassword:e.target.value});}
    submit() {
        let state = this.state,
            props = this.props;
        if (
            '' === state.newPassword 
            || 
            '' === state.oldPassword 
            || 
            '' === state.confirmPassword
        ) return;
        if (state.newPassword !== state.confirmPassword) return;
        axios.post(
            api.U('updatePassword'),
            api.data({
                token:props.token,
                uid:props.uid,
                new_password:state.newPassword,
                old_password:state.oldPassword
            })
        )
        .then((response) => {
            console.log(response.data);
            if (api.verify(response.data)) {
                ipcRenderer.send('toggle-login','update');
            }
        });
    }

    render() {
        if (!this.props.show) return null;
        let state = this.state;
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-password'>
                    <em className='ui-password-close' onClick={this.props.onCancelRequest}></em>
                    <div style={{paddingTop:'101px'}}>
                        <div style={{paddingBottom:'18px'}}>
                            <label className='ui-password-label'>原密码：</label>
                            <input 
                                type='password' 
                                className='ui-password-input' 
                                value={state.oldPassword}
                                onChange={this.changeOldPassword}
                            />
                        </div>
                        <div style={{paddingBottom:'18px'}}>
                            <label className='ui-password-label'>新密码：</label>
                            <input 
                                type='password' 
                                className='ui-password-input' 
                                value={state.newPassword}
                                onChange={this.changeNewPassword}
                            />
                        </div>
                        <div>
                            <label className='ui-password-label'>确认密码：</label>
                            <input 
                                type='password' 
                                className='ui-password-input' 
                                value={state.confirmPassword}
                                onChange={this.changeConfirmPassword}
                            />
                        </div>
                        <div style={{paddingBottom:'26px'}}>
                            <label className='ui-password-label' style={{height:'25px'}}></label>
                            <span 
                                style={{fontSize:'16px',color:'#fd4242'}}
                            >(密码为6～18位字母、数字组合)</span>
                        </div>
                        <div>
                            <label className='ui-password-label'></label>
                            <input type='button' className='ui-password-btn' onClick={this.submit}/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}