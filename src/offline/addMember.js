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
        this.state = {ucode:'',sex:'女',name:''};
        this.toggleRadio = this.toggleRadio.bind(this);
        this.handleChange  = this.handleChange.bind(this);
        this.toggleDate = this.toggleDate.bind(this);
    }
    componentDidMount() {
        axios.post(api.U('getNewUcode'),api.data({token:this.props.token}))
        .then((response) => {
            this.setState({ucode:response.data.data.ucode});
        });
    }

    toggleRadio(e) {this.setState({sex:e.target.innerText});}
    handleChange(e) {this.setState({name:e.target.value});}
    toggleDate(e) {
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
                        <span>编号:</span><span>{state.ucode}</span>
                    </div>
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
                            value='1980-01-01' 
                            className='ui-input ui-text-center' 
                            readOnly
                            onClick={this.toggleDate}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AddMember;