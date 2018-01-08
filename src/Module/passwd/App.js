/**
 * 修改密码弹窗组件
 * @author yangyunlong
 */
const {ipcRenderer} = window.require('electron');
import React from 'react';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {oldPasswd:'', newPasswd:'', passwdAgain:''};
        this.submit = this.submit.bind(this);
    }
    submit() {
        let state = this.state,
            props = this.props;
        if (
            '' === state.newPasswd 
            || 
            '' === state.oldPasswd 
            || 
            '' === state.passwdAgain
        ) return;
        if (state.newPasswd !== state.passwdAgain) return;
        axios.post(
            api.U('passwd'),
            api.D({
                token:props.token,                
                new:state.newPasswd,
                old:state.oldPasswd
            })
        )
        .then(response => {
            if (api.V(response.data)) {
                ipcRenderer.send('toggle-login','passwd');
            }else{
            	alert('修改失败重新填写密码');
            }
        });
    }

    render() {
        if (!this.props.show) return null;
        let state = this.state;
        return (
            <section className='m-layer-bg'>
                <div className='passwd'>
                    <em className='passwd-cancel' onClick={this.props.onCancelRequest}></em>
                    <div style={{paddingTop:'101px'}}>
                        <div style={{paddingBottom:'18px'}}>
                            <label className='passwd-label'>原密码：</label>
                            <input 
                                type='password' 
                                className='passwd-input' 
                                value={state.oldPasswd}
                                onChange={e => this.setState({oldPasswd:e.target.value})}
                            />
                        </div>
                        <div style={{paddingBottom:'18px'}}>
                            <label className='passwd-label'>新密码：</label>
                            <input 
                                type='password' 
                                className='passwd-input' 
                                value={state.newPasswd}
                                onChange={e => this.setState({newPasswd:e.target.value})}
                            />
                        </div>
                        <div>
                            <label className='passwd-label'>确认密码：</label>
                            <input 
                                type='password' 
                                className='passwd-input' 
                                value={state.passwdAgain}
                                onChange={e => this.setState({passwdAgain:e.target.value})}
                            />
                        </div>
                        <div style={{paddingBottom:'26px'}}>
                            <label className='passwd-label' style={{height:'25px'}}></label>
                            <span 
                                style={{fontSize:'16px',color:'#fd4242'}}
                            >(密码为6～18位字母、数字组合)</span>
                        </div>
                        <div>
                            <label className='passwd-label'></label>
                            <input type='button' className='passwd-btn' onClick={this.submit}/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}