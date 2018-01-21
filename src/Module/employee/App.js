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
        this.state = {
            employee:[],
            checked:[],
            name:'',
            number:'',
            passwd:'',
            show:false,
            isAdd:true,
            employeeId:null,
            editorShow:false,
            index:0
        };
        this.query = this.query.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.handleEditor = this.handleEditor.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {this.query()}
    query() {
        axios.post(api.U('employee_list'),api.D({token:this.props.token}))
        .then((response) => {
            api.V(response.data) && this.setState({employee:response.data.result});
        });
    }

    handleCheck(value, checked) {
        let index = value.inArray(this.state.checked);
        if (checked) {
            -1 !== index && this.state.checked.splice(index, 1);
        } else {
            -1 === index && this.state.checked.push(value);
        }
        this.setState({checked:this.state.checked});
    }

    onConfirm() {
        if (this.state.isAdd) {
            if (
                '' != this.state.name
                &&
                this.state.number.length == 11
                &&
                '' != this.state.passwd
                &&
                this.state.checked.length > 0
            ) {
                axios.post(
                    api.U('auth'),
                    api.D({
                        token:this.props.token,
                        name:this.state.name,
                        phone:this.state.number,
                        password:this.state.passwd,
                        auth:JSON.stringify(this.state.checked)
                    })
                )
                .then(response => {
                    if (api.V(response.data) ) {
                        this.query();
                        this.setState({show:false,name:'',number:'',passwd:'',checked:[]});
                    }
                });
            }
        } else {
            if (
                '' != this.state.name
                &&
                this.state.number.length == 11
                &&
                this.state.checked.length > 0
            ) {
                axios.post(
                    api.U('employee_upd'),
                    api.D({
                        token:this.props.token,
                        staff_id:this.state.employeeId,
                        name:this.state.name,
                        phone:this.state.number,
                        password:this.state.passwd,
                        auth:JSON.stringify(this.state.checked)
                    })
                )
                .then(response => {
                    if (api.V(response.data)) {
                        this.query();
                        this.setState({show:false,name:'',number:'',passwd:'',checked:[]});
                    }
                });
            }
        }
    }

    handleEditor(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('employee_upd'),api.D({token:this.props.token,staff_id:id}))
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                let auth = null;
                try {
                    auth = JSON.parse(result.data.auth);
                } catch (e) {
                    auth = [];
                }
                if (auth.constructor != Array) auth = [];
                this.setState({employeeId:id,name:result.data.aname,number:result.data.account,checked:auth,show:true,isAdd:false});
            }
            console.log(response.data);
        });
    }

    handleDelete(e) {
        let id = e.target.dataset.id;
        axios.post(api.U('employee_del'), api.D({token:this.props.token,staff_id:id}))
        .then(response => {
            api.V(response.data) && this.query();
        });
    }



    render () {
        let html = this.state.employee.map((obj) => 
                <tr key={obj.id} className='m-text-c'>
                    <td>{obj.aname}</td>
                    <td>{obj.account}</td>
                    <td>{null}</td>
                    <td>
                        <input type='button' value='编辑' className='m-btn editor' onClick={this.handleEditor} data-id={obj.id}/>
                        &emsp;
                        <input 
                            type='button' 
                            value='删除' 
                            className='m-btn editor'
                            onClick={this.handleDelete}
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
                        <button type='button' className='m-btn confirm middle' onClick={() => this.setState({show:true,isAdd:true})}>+添加员工</button>
                    </div>
                    <div className='m-box'>
                        <table className='m-table tr-b'>
                            <thead><tr className='m-bg-white'><th>姓名</th><th>手机号</th><th>权限</th><th>编辑</th></tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div>
                </div>
                <AddEmployee
                    show={this.state.show}
                    checked={this.state.checked}
                    name={this.state.name}
                    onNameChange={e => this.setState({name:e.target.value})}
                    number={this.state.number}
                    onNumberChange={e => !isNaN(e.target.value) && this.setState({number:e.target.value})}
                    passwd={this.state.passwd}
                    onPasswdChange={e => this.setState({passwd:e.target.value})}
                    token={this.props.token}
                    onClose={() => this.setState({show:false,checked:[],name:'',number:'',passwd:''})}
                    handleCheck={this.handleCheck}
                    onConfirm={this.onConfirm}
                />
            </div>
        );
    }
}


class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {auth:[]};
    }
    componentDidMount() {
        axios.post(api.U('auth'),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({auth:response.data.result});
        });
    }
    
    render() {
        if (!this.props.show) return null;
        let auth = this.state.auth.map(obj =>
            <Checkbox
                key={obj.module}
                value={obj.module}
                checked={-1 !== obj.module.inArray(this.props.checked)}
                onClick={this.props.handleCheck}
            >{obj.module_name}</Checkbox>
        );
        return (
            <div className='m-layer-bg'>
                <div className='add-employee'>
                    <i className='m-close' onClick={this.props.onClose}></i>
                    <div className='m-bg-linear'><span className='m-add-employee'>添加员工</span></div>
                    <div className='row'>
                        <label>姓名：</label>
                        <input type='text' value={this.props.name} onChange={this.props.onNameChange}/>
                    </div>
                    <div className='row'>
                        <label>手机号：</label>
                        <input type='text' value={this.props.number} onChange={this.props.onNumberChange}/>
                    </div>
                    <div className='row'>
                        <label>密码：</label>
                        <input type='password' value={this.props.passwd} onChange={this.props.onPasswdChange}/>
                    </div>
                    <div className='row auth'>
                        <label>权限设置：</label>
                        <div>{auth}</div>
                    </div>
                    <div style={{textAlign:'center'}}>
                        <button type='button' className='m-btn gradient lightblue middle' onClick={this.props.onConfirm}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}
