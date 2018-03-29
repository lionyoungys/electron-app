/**
 * 新增散客会员组件
 * @author yangyunlong
 */
import React from 'react';
import Radio from '../UI/radio/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sex:1,name:'',birthday:'1980-01-01'};
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        laydate.render({
            elem:this.input,
            value:'1980-01-01',
            min:'1920-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {this.setState({birthday:value})}
        });        
    }

    submit() {
        if ('' == this.state.name) return;
        axios.post(
            api.U('register'),
            api.D({
                token:this.props.token,                
                uname:this.state.name,
                sex:this.state.sex,
                umobile:this.props.param.number,
                birthday:this.state.birthday,
                reg_from:4
            })
        )
        .then((response) => {
            if (api.V(response.data)) {
                this.props.changeView({view:'offline_add_item', param:response.data.uid});
            } else {
                alert(response.data.msg);
            }
        })
    }

    render() {
        let state = this.state;
        return (
            <div>
                <div className='register-title'>此用户不是会员，请填写以下信息</div>
                <div className='register'>
                    <div>
                        <span>姓&emsp;&emsp;名:</span>
                        <input type='text' className='m-input' maxLength='4' value={state.name} onChange={e => this.setState({name:e.target.value})}/>
                    </div>
                    <div>
                        <span>性&emsp;&emsp;别:</span>
                        <span>
                            <Radio checked={1 == state.sex} onClick={() => this.setState({sex:1})}>男</Radio>
                            &emsp;&emsp;
                            <Radio checked={2 == state.sex} onClick={() => this.setState({sex:2})}>女</Radio>
                        </span>
                    </div>
                    <div>
                        <span>手&nbsp;&nbsp;机&nbsp;&nbsp;号:</span><span>{this.props.param.number}</span>
                    </div>
                    <div>
                        <span>会员生日:</span>
                        <input type='text' className='m-input' readOnly ref={(input) => {this.input = input}}/>
                    </div>
                </div>
                <div style={{textAlign:'center',marginTop:'40px'}}>
                    <input type='button' value='收衣下单' className='m-btn m-btn-confirm m-btn-large' onClick={this.submit}/>
                </div>
            </div>
        );
    }
}
