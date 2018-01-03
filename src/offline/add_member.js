/**
 * 新增会员组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class AddMember extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'收衣',e:'take'},{key:1,text:'散客信息'}];
        this.params = this.props.param.paramToObject();
        this.mobile = this.params.mobile;
        this.state = {ucode:'',sex:'女',name:'',birthday:'1980-01-01'};
        this.toggleRadio = this.toggleRadio.bind(this);
        this.handleChange  = this.handleChange.bind(this);
        this.done = this.done.bind(this);
    }
    componentDidMount() {
        //laydate plugin init
        laydate.render({
            elem:this.dateNode,
            value:'1980-01-01',
            min:'1980-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value) => {this.setState({birthday:value})}
        });        
    }
    
    //生成一个会员
    toggleRadio(e) {this.setState({sex:e.target.innerText});}
    handleChange(e) {this.setState({name:e.target.value});}
    done() {
        let state = this.state,
            props = this.props;
        if ('' == state.name || this.mobile.length != 11) return;
        axios.post(
            api.U('addNewMember'),
            api.data({
                token:props.token,                
                uname:state.name,
                sex:state.sex,
                umobile:this.mobile,
                birthday:state.birthday,
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
                props.changeView({element:'item'})
                //props.changeView({element:'item',param:'id=' + orderId + '&from=offline'})
            }
        )

    }

    render() {
        let props = this.props,
            state = this.state;
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <div style={{color:'#fd592d',fontSize:'22px',textAlign:'center',paddingTop:'40px'}}>
                    此用户不是会员，请填写以下信息
                </div>
                <div style={{paddingTop:'40px',width:'401px',margin:'auto'}}>
                    <div className='ui-box-between ui-add-member-row'>
                        <span>姓名:</span>
                        <input 
                            type='text' 
                            className='ui-input ui-text-right' 
                            maxLength='4' 
                            value={state.name}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='ui-box-between ui-add-member-row'>
                        <span>性别:</span>
                        <span>
                            <em 
                                className={'ui-radio' + ('女' == state.sex ? ' ui-radio-checked' : '')}
                                onClick={this.toggleRadio}
                            >女</em>
                            &emsp;&emsp;
                            <em 
                                className={'ui-radio' + ('男' == state.sex ? ' ui-radio-checked' : '')}
                                onClick={this.toggleRadio}
                            >男</em>
                        </span>
                    </div>
                    <div className='ui-box-between ui-add-member-row'>
                        <span>手机号:</span><span>{this.mobile}</span>
                    </div>
                    <div className='ui-box-between ui-add-member-row'>
                        <span>会员生日:</span>
                        <input 
                            type='text' 
                            className='ui-input ui-text-center' 
                            readOnly
                            ref={(input) => {this.dateNode = input}}
                        />
                    </div>
                    <div style={{paddingTop:'80px',textAlign:'center'}}>
                        <input 
                            type='button' 
                            value='收衣下单' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={this.done}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AddMember;