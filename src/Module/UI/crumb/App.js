/**
 * 面包屑组件
 * @author yangyunlong
 */
import React from 'react';
import './App.css';
//面包屑导航栏 data = [{view:跳转的视图组件,value:文字显示,key:索引key,param:携带参数}] callback=回调操作
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {employee:'', employeeID:'', checked:'', show:false, allEmployees:[]};
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    componentDidMount() {
        if (!tool.isSet(this.props.token)) return;
        axios.post(
            api.U('employee_handle'),
            api.D({token:this.props.token, moduleid:this.props.param.moduleid})
        )
        .then(response => {
            if (api.V(response.data)) {
                let result = response.data.result;
                this.setState({allEmployees:result.staff,employee:result.info.uname,employeeID:result.info.uid,checked:result.info.uid});
            } else {
                alert(response.data.msg);
            }
        });
    }

    handleConfirm(obj) {
        if ('' != obj.id) {
            this.setState({employeeID:obj.id,employee:obj.name,show:false});
            '' !== obj.token && this.props.callback({token:obj.token});
        }
    }

    render() {
        let props = this.props,
            list = props.data.map((obj) => 
                <div key={obj.key}>
                    <i>&gt;</i>
                    <span onClick={() => props.callback({view:obj.view, param:obj.param})}>{obj.value}</span>
                </div>
            );
        return (
            <nav className="ui-crumb">
                位置&nbsp;:
                <span onClick={() => props.callback({view:'index'})}>首页</span>{list}
                <div className='ui-employee' style={{display:tool.isSet(this.props.token) ? 'block' : 'none'}}>
                    操作员:{this.state.employee}({this.state.employeeID})
                    <span className='ui-toggle' onClick={() => this.setState({show:true})}>更改</span>
                    <Team
                        show={this.state.show}
                        data={this.state.allEmployees}
                        employee={this.state.employee}
                        employeeID={this.state.employeeID}
                        checked={this.state.checked}
                        onClose={() => this.setState({show:false})}
                        toggleChecked={value => {this.setState({checked:value})}}
                        onConfirm={this.handleConfirm}
                    />
                </div>
            </nav>
        );
    }
}

class Team extends React.Component {
    constructor(props) {
        super(props);
        this.state = {employee:'', employeeID:'', token:''};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        let data = e.target.dataset;
        this.props.toggleChecked(data.id);
        this.setState({employee:data.name,employeeID:data.id, token:data.token});
    }
    render() {
        if (!this.props.show) return null;
        let html = this.props.data.map(obj =>
            <div
                key={obj.id}
                data-id={obj.id}
                data-name={obj.aname}
                data-token={obj.token}
                className={this.props.checked == obj.id ? 'checked' : null}
                onClick={this.handleClick}
            >{obj.aname}</div>
        );
        return (
            <div className='clean-team' style={{zIndex:10}}>
                <div>将改为:{
                        `${'' == this.state.employee ? this.props.employee : this.state.employee}
                        (${'' == this.state.employeeID ? this.props.employeeID : this.state.employeeID})`
                    }
                </div>
                <div>{html}</div>
                <div>
                    <button type='button' className='m-btn cancel' onClick={this.props.onClose}>取消</button>
                    &emsp;&emsp;
                    <button
                        type='button' 
                        className='m-btn confirm' 
                        onClick={() => this.props.onConfirm({name:this.state.employee,id:this.state.employeeID,token:this.state.token})}
                    >确认</button>
                </div>
            </div>
        );
    }
}