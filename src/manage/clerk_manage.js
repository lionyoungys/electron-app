/**
 * 员工管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Notification} from '../static/UI';
import md5 from 'md5';

export default class ClerkManage extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'员工管理'}];
        this.state = {clerks:[],show:false,editorShow:false,authList:[],index:0};
        this.callback = this.callback.bind(this);    //弹窗回调函数
        this.deleteClerk = this.deleteClerk.bind(this);    //删除员工
        this.retStr = this.retStr.bind(this);
        this.editorCallback = this.editorCallback.bind(this);
        this.isShowEditor = this.isShowEditor.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('getAuth'),api.data({token:this.props.token}))
        .then(response => {
            this.setState({authList:response.data.data});
            //console.log(this.state.authList);
        });
        axios.post(api.U('clerkList'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({clerks:result});
            console.log(result);
        });
    }

    callback(isConfirm,obj) {
        if (isConfirm) {
            obj.token = this.props.token;
            axios.post(api.U('getAuth'),api.D(obj))
            .then((response) => {
                if (api.verify(response.data)) {
                    axios.post(api.U('clerkList'),api.data({token:this.props.token}))
                    .then((response) => {
                        let result = response.data.data;
                        this.setState({clerks:result});
                        //console.log(result);
                    });
                }
            });
        }
        this.setState({show:false})
    }

    editorCallback(isConfirm) {
        if (isConfirm) {
            axios.post(api.U('clerkList'),api.data({token:this.props.token}))
            .then((response) => {
                let result = response.data.data;
                this.setState({clerks:result});
                //console.log(result);
            });
        }
        this.setState({editorShow:false});
    }

    isShowEditor() {
        let state = this.state;
        if (state.editorShow) {
            return (
                <AddClerk 
                    show={state.editorShow} 
                    authList={state.authList} 
                    callback={this.editorCallback}
                    id={state.clerks[state.index].id}
                    token={this.props.token}
                    type='editor'
                />
            );
        }
        return null;
    }
    retStr(value) {
        let arr = value.split(','),
            arrLen = arr.length,
            auth = this.state.authList,
            len = auth.length,
            retStr = [];
        for (let i = 0;i < len;++i) {
            for (let j = 0;j < arrLen;++j) {
                if (auth[i].num == arr[j]) retStr.push(auth[i].name);
            }
        }
        if (-1 != '100'.inArray(arr)) retStr.push('订单管理');
        return retStr.toString();
    }

    deleteClerk(e) {
        let id = e.target.dataset.id,
            state = this.state;
        axios.post(api.U('deleteClerk'),api.data({token:this.props.token,id:id}))
        .then((response) => {
            if (api.verify(response.data)) {
                let index = id.inObjectArray(state.clerks,'id');
                if (-1 !== index) {
                    state.clerks.splice(index,1);
                    this.setState({clerks:state.clerks});
                }
            }
        });
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.clerks.map((obj,index) => 
                <tr className='ui-tr-d' key={obj.id}>
                    <td>{obj.nickname}</td>
                    <td>{obj.username}</td>
                    <td>{this.retStr(obj.quanli)}</td>
                    <td>
                        <input 
                            type='button' 
                            value='编辑' 
                            className='ui-btn ui-btn-editor'
                            onClick={() => this.setState({editorShow:true,index:index})}
                            data-id={obj.id}
                        />
                        &emsp;
                        <input 
                            type='button' 
                            value='删除' 
                            className='ui-btn ui-btn-editor'
                            onClick={this.deleteClerk}
                            data-id={obj.id}
                        />

                    </td>
                </tr>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-right'>
                        <input 
                            type='button' 
                            value='+添加员工' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={() => this.setState({show:true})}
                        />
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table'>
                            <thead className='ui-fieldset'>
                                <tr className='ui-tr-h'><th>姓名</th><th>手机号</th><th>权限</th><th>编辑</th></tr>
                            </thead>
                            <tbody className='ui-fieldset'>{html}</tbody>
                        </table>
                    </div>
                </section>
                <AddClerk show={state.show} authList={state.authList} callback={this.callback}/>
                {this.isShowEditor()}
            </div>
        );
    }
}


class AddClerk extends Component {
    constructor(props) {
        super(props);
        this.state = {name:'',mobile:'',password:'',auth:[]};
        this.onConfirm = this.onConfirm.bind(this);    //确认
        this.toggleChecked = this.toggleChecked.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    componentDidMount() {
        let props = this.props;
        if (func.isSet(props.type)) {
            axios.post(api.U('updateClerkInfo'),api.D({token:props.token,id:props.id}))
            .then(response => {
                let result = response.data.data.info;
                this.setState({name:result.nickname,mobile:result.username,auth:result.quanli.split(',')});
            });
        }
    }

    componentWillUnmount() {this.setState({name:'',mobile:'',password:'',auth:[]});}

    onConfirm() {
        let state = this.state;
        if (func.isSet(this.props.type)) {
            if (
                '' != state.name && 
                !isNaN(state.mobile) &&
                state.mobile.length == 11 &&
                state.auth.length > 0) {
            } {
                let data = {
                    id:this.props.id,
                    nickname:state.name,
                    username:state.mobile,
                    assess:state.auth.toString(),
                    token:this.props.token
                };
                if ('' != state.password) data.password = state.password;
                axios.post(api.U('updateClerkInfo'),api.D(data))
                .then(response => {
                    if (api.verify(response.data)) {
                        this.props.callback(true);
                    }
                });
            }
        } else {
            if (
                '' != state.name &&
                '' != state.password && 
                !isNaN(state.mobile) &&
                state.mobile.length == 11 &&
                state.auth.length > 0
            ) {
                this.props.callback(true, {
                    nickname:state.name,
                    username:state.mobile,
                    password:state.password,
                    assess:state.auth.toString()
                });
                this.setState({name:'',mobile:'',password:'',auth:[]});
            }
        }
    }
    onClose() {
        this.setState({name:'',mobile:'',password:'',auth:[]});
        this.props.callback(false);
    }

    toggleChecked(e) {
        let index = e.target.dataset.index,
            auth = this.state.auth,
            i = index.inArray(auth);
        if (-1 === i) {
            auth.push(index);
        } else {
            auth.splice(i, 1);
        }
        this.setState({auth:auth});
    }
    
    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        let auths = props.authList.map(obj => 
                 <span 
                     key={obj.num} 
                     data-index={obj.num} 
                     className={'ui-checkbox3' + (-1 !== obj.num.inArray(state.auth) ? ' ui-checked3' : '')} 
                     onClick={this.toggleChecked}
                 >{obj.name}</span>  
            );
        auths.push(
            <span 
                key='100' 
                data-index='100' 
                className={'ui-checkbox3' + (-1 !== '100'.inArray(state.auth) ? ' ui-checked3' : '')} 
                onClick={this.toggleChecked}
            >订单管理</span>
        );
        return (
            <section className='ui-fixed-bg'>
                <div className='ui-clerk-box'>
                    <div className='ui-clerk-box-header'>
                        <span>添加员工</span>
                        <em className='ui-close3' onClick={this.onClose}></em>
                    </div>
                    <div className='ui-clerk-box-body'>
                        <div className='ui-clerk-box-row'>
                            <span>姓名：</span>
                            <input 
                                type='text' 
                                value={state.name} 
                                onChange={e => this.setState({name:e.target.value})}
                            />
                        </div>
                        <div className='ui-clerk-box-row'>
                            <span>手机号：</span>
                            <input 
                                type='text' 
                                value={state.mobile}
                                onChange={e =>{if (!isNaN(e.target.value)) this.setState({mobile:e.target.value})}}
                            />
                        </div>
                        <div className='ui-clerk-box-row'>
                            <span>密码：</span>
                            <input 
                                type='password' 
                                value={state.password} 
                                onChange={e => this.setState({password:e.target.value})}
                            />
                        </div>
                        <div className='ui-clerk-box-row' style={{paddingTop:'16px'}}>
                            <span style={{height:'24px',lineHeight:'24px'}}>权限设置：</span>
                            <div className='auth'>{auths}</div>
                        </div>
                        <div className='ui-clerk-box-row' style={{marginTop:'-6px'}}>
                            <span></span><input type='button' className='ui-teamwork-confirm' onClick={this.onConfirm}/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
