/**
 * 员工管理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import Crumb from '../UI/crumb/App';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {employee:[],auth:[],show:false,editorShow:false,index:0};
        this.callback = this.callback.bind(this);    //弹窗回调函数
        this.deleteClerk = this.deleteClerk.bind(this);    //删除员工
        this.retStr = this.retStr.bind(this);
        this.editorCallback = this.editorCallback.bind(this);
        this.isShowEditor = this.isShowEditor.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('auth'),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({auth:response.data.result});
            console.log(response.data.result);
        });
        axios.post(api.U('employee_list'),api.D({token:this.props.token}))
        .then((response) => {
            api.V(response.data) && this.setState({employee:response.data.result});
        });
    }

    callback(isConfirm,obj) {
        if (isConfirm) {
            obj.token = this.props.token;
            axios.post(api.U('getAuth'),api.D(obj))
            .then((response) => {
                if (api.verify(response.data)) {
                    axios.post(api.U('clerkList'),api.D({token:this.props.token}))
                    .then((response) => {
                        let result = response.data.data;
                        this.setState({employee:result});
                        //console.log(result);
                    });
                }
            });
        }
        this.setState({show:false})
    }

    editorCallback(isConfirm) {
        if (isConfirm) {
            axios.post(api.U('clerkList'),api.D({token:this.props.token}))
            .then((response) => {
                let result = response.data.data;
                this.setState({employee:result});
                //console.log(result);
            });
        }
        this.setState({editorShow:false});
    }

    isShowEditor() {
        let state = this.state;
        if (state.editorShow) {
            return (
                <AddEmployee 
                    show={state.editorShow} 
                    auth={state.auth} 
                    callback={this.editorCallback}
                    id={state.employee[state.index].id}
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
            auth = this.state.auth,
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
        axios.post(api.U('deleteClerk'),api.D({token:this.props.token,id:id}))
        .then((response) => {
            if (api.verify(response.data)) {
                let index = id.inObjectArray(state.employee,'id');
                if (-1 !== index) {
                    state.employee.splice(index,1);
                    this.setState({employee:state.employee});
                }
            }
        });
    }

    render () {
        let html = this.state.employee.map((obj) => 
                <tr key={obj.id} className='m-text-c'>
                    <td>{obj.aname}</td>
                    <td>{obj.account}</td>
                    <td>{null}</td>
                    <td>
                        <input 
                            type='button'
                            value='编辑' 
                            className='m-btn editor'
                            onClick={() => this.setState({editorShow:true,index:index})}
                            data-id={obj.id}
                        />
                        &emsp;
                        <input 
                            type='button' 
                            value='删除' 
                            className='m-btn editor'
                            onClick={this.deleteClerk}
                            data-id={obj.id}
                        />
                    </td>
                </tr>
            );
        return (
            <div>
                <Crumb data={[{key:0,value:'员工管理'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div style={{textAlign:'right'}}>
                        <button type='button' className='m-btn confirm middle' onClick={() => this.setState({show:true})}>+添加员工</button>
                    </div>
                    <div className='m-box'>
                        <table className='m-table tr-b'>
                            <thead>
                                <tr className='m-bg-white'><th>姓名</th><th>手机号</th><th>权限</th><th>编辑</th></tr>
                            </thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
                <AddEmployee show={this.state.show} auth={this.state.auth} callback={this.callback}/>
                {this.isShowEditor()}
            </div>
        );
    }
}


class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {name:'',mobile:'',password:'',auth:[],checked:[]};
        this.handleClick = this.handleClick.bind(this);
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
    handleClick(value, checked) {
        if (checked) {
            let index = value.inArray(this.state.checked);
            this.state.checked.splice(index, 1);
        } else {
            this.state.checked.push(value);
        }
        this.setState({checked:this.state.checked});
    }

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
        if (!this.props.show) return null;
        let props = this.props,
            state = this.state;
        let auth = this.props.auth.map(obj =>
            <Checkbox
                key={obj.module}
                value={obj.module}
                checked={-1 !== obj.module.inArray(this.state.checked)}
                onClick={this.handleClick}
            >{obj.module_name}</Checkbox>
        );
        return (
            <div className='m-layer-bg'>
                <div className='add-employee'>
                    <i className='m-close' onClick={this.onClose}></i>
                    <div className='m-bg-linear'><span className='m-add-employee'>添加员工</span></div>
                    <div className='row'>
                        <label>姓名：</label>
                        <input type='text' value={this.state.name} onChange={e => this.setState({name:e.target.value})}/>
                    </div>
                    <div className='row'>
                        <label>手机号：</label>
                        <input type='text' value={this.state.mobile} onChange={e =>{!isNaN(e.target.value) && this.setState({mobile:e.target.value})}}/>
                    </div>
                    <div className='row'>
                        <label>密码：</label>
                        <input type='password' value={this.state.password} onChange={e => this.setState({password:e.target.value})}/>
                    </div>
                    <div className='row auth'>
                        <label>权限设置：</label>
                        <div>{auth}</div>
                    </div>
                    <div style={{textAlign:'center'}}>
                        <button type='button' className='m-btn gradient lightblue middle' onClick={this.onConfirm}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}
