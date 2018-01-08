/**
 * 新增散客会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import Radio from '../UI/radio/App';
import './App.css';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {sex:1,name:'',birthday:'1980-01-01'};
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        laydate.render({
            elem:this.input,
            value:'1980-01-01',
            min:'1980-01-01',max:0,
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
        	console.log(response);
            let result = response.data;
            
//          if (api.verify(result)) {
//              let user = result.user;
//              axios.post(api.U('createOrder'),api.data({token:props.token,uid:user}))
//              .then((res) => {
//                  let orderId = res.data.data.order_id;
//                 
//              });
                //this.props.changeView({element:'item'})
                //props.changeView({element:'item',param:'id=' + orderId + '&from=offline'})
            }
        )

    }

    render() {
        let state = this.state;
        return (
            <div>
                <Crumb data={[{key:0,value:'收衣',view:'take'},{key:1,value:'散客信息'}]} callback={this.props.changeView}/>
                <div className='register-title'>此用户不是会员，请填写以下信息</div>
                <div className='register'>
                    <div>
                        <span>姓&emsp;&emsp;名:</span>
                        <input type='text' className='m-input' maxLength='4' value={state.name} onChange={e => this.setState({name:e.target.value})}/>
                    </div>
                    <div>
                        <span>性&emsp;&emsp;别:</span>
                        <span>
                            <Radio boolean={1 == state.sex} onClick={() => this.setState({sex:1})}>男</Radio>
                            &emsp;&emsp;
                            <Radio boolean={2 == state.sex} onClick={() => this.setState({sex:2})}>女</Radio>
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
