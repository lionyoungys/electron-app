/**
 * 合作门店组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Notification} from '../static/UI';
import md5 from 'md5';

export default class Teamwork extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'合作门店'}];
        this.state = {list:[],show:false,deleteShow:false,tempId:null};
        this.callback = this.callback.bind(this);    //弹窗回调函数
        this.deleteCallback = this.deleteCallback.bind(this);    //删除成员回调
    }

    componentDidMount() {
        axios.post(api.U('teamwork'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({list:result});
            console.log(result);
        });
    }

    callback(isConfirm, id) {
        if (isConfirm) {
            axios.post(api.U('teamworkAdd'),api.data({token:this.props.token,accept_id:id}))
            .then((response) => {
                console.log(response);
                if (api.verify(response.data)) {
                    axios.post(api.U('teamwork'),api.data({token:this.props.token}))
                    .then((res) => {
                        let result = res.data.data;
                        this.setState({list:result});
                        console.log(result);
                    });
                }
            });
        }
        this.setState({show:false})
    }
    deleteCallback(isConfirm) {
        if (isConfirm) {
            axios.post(api.U('teamworkDelete'),api.D({token:this.props.token,ids:this.state.tempId}))
            .then(response => {
                if (api.verify(response.data)) {
                    axios.post(api.U('teamwork'),api.data({token:this.props.token}))
                    .then((res) => {
                        let result = res.data.data;
                        this.setState({list:result});
                        console.log(result);
                    });
                }
            });
        }
        this.setState({deleteShow:false});
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.list.map((obj) => 
                <tr className='ui-tr-d' key={obj.id}>
                    <td>{obj.id}</td>
                    <td>{obj.mname}</td>
                    <td>
                        <input 
                            type='button' 
                            value='删除' 
                            className='ui-btn ui-btn-editor'
                            onClick={() => this.setState({deleteShow:true,tempId:obj.id})}
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
                            value='+添加合作门店' 
                            className='ui-btn ui-btn-confirm ui-btn-large'
                            onClick={() => this.setState({show:true})}
                        />
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table'>
                            <thead className='ui-fieldset'>
                                <tr className='ui-tr-h'><th>门店编号</th><th>名称</th><th>编辑</th></tr>
                            </thead>
                            <tbody className='ui-fieldset'>{html}</tbody>
                        </table>
                    </div>
                </section>
                <AddMember show={state.show} callback={this.callback} token={props.token}/>
                <DeleteMember show={state.deleteShow} callback={this.deleteCallback} token={props.token} id={state.tempId}/>
            </div>
        );
    }
}

class AddMember extends Component {
    constructor(props) {
        super(props);
        this.state = {text:'',list:[],id:null}
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onConfirmRequest = this.onConfirmRequest.bind(this);
    }

    onSearchRequest(e) {
        let value = e.target.value;
        this.setState({text:value,id:null});
        axios.post(
            api.U('teamworkSearch'),
            api.D({token:this.props.token,info:value})
        )
        .then(response => {
            console.log(response.data);
            this.setState({list:response.data.data});
        });
    }

    handleClick(e) {
        let dataset = e.target.dataset;
        this.setState({text:dataset.text,id:dataset.id});
    }

    onConfirmRequest() {
        if (null !== this.state.id) {
            this.props.callback(true, this.state.id);
        }
    }

    render () {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        let html = state.list.map(obj => 
            <div 
                className='ui-teamwork-searcher-item' 
                key={obj.id} 
                data-id={obj.id}
                data-text={obj.mname}
                onClick={this.handleClick}
            >{obj.mname}</div>
        );
        return (
            <section className='ui-teamwork-add'>
                <div className='ui-teamwork-title'>
                    <div className='ui-teamwork-prefix'>&nbsp;新增合作门店</div>
                    <em className='ui-close2' onClick={() => props.callback(false)}></em>
                </div>
                <div className='ui-teamwork-add-box'>
                    <div className='ui-teamwork-input-area'>
                        <input 
                            className='ui-teamwork-input' 
                            placeholder='请输入合作门店名称' 
                            value={state.text}
                            onChange={this.onSearchRequest}
                        />
                        <input type='button' className='ui-teamwork-confirm' onClick={this.onConfirmRequest}/>
                        <div className='ui-teamwork-searcher'>
                            {html}
                        </div> 
                    </div>
                </div>
            </section>
        );
    }
}

class DeleteMember extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
        console.log(props);
        return (
            <section className='ui-teamwork-delete'>
                <div className='ui-teamwork-title'>
                    <div className='ui-teamwork-prefix2'>&nbsp;删除</div>
                    <em className='ui-close2' onClick={() => props.callback(false)}></em>
                </div>
                <div style={{textAlign:'center',margin:'50px 0',fontSize:'18px'}}>您确定要删除吗？</div>
                <div className='ui-teamwork-btn-area'>
                    <input type='button' className='ui-teamwork-cancel' onClick={() => props.callback(false)}/>
                    <div style={{width:'35.5px',height:'1px'}}></div>
                    <input type='button' className='ui-teamwork-confirm' onClick={() => props.callback(true)}/>
                </div>
            </section>
        );
    }
}