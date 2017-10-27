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
        this.state = {clerks:[],show:false,deleteShow:false,tempId:null};
        this.callback = this.callback.bind(this);    //弹窗回调函数
        this.deleteCallback = this.deleteCallback.bind(this);    //删除成员回调
    }

    componentDidMount() {
        axios.post(api.U('clerkList'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({clerks:result});
            console.log(result);
        });
    }

    callback(isConfirm) {
        if (isConfirm) {
            axios.post(api.U('clerkList'),api.data({token:this.props.token}))
            .then((response) => {
                let result = response.data.data;
                this.setState({clerks:result});
                console.log(result);
            });
        }
        this.setState({show:false})
    }
    deleteCallback(isConfirm) {
        if (isConfirm) {

        }
        this.setState({deleteShow:false});
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.clerks.map((obj) => 
                <tr className='ui-tr-d' key={obj.id}>
                    <td>{obj.nickname}</td>
                    <td>{obj.username}</td>
                    <td>
                        <input 
                            type='button' 
                            value='删除' 
                            className='ui-btn ui-btn-editor'
                            onClick={() => this.setState({deleteShow:true})}
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
        this.state = {text:''}
    }

    render () {
        let props = this.props,
            state = this.state;
        if (!props.show) return null;
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
                            onChange={(e) => {this.setState({text:e.target.value})}}
                        />
                        <input type='button' className='ui-teamwork-confirm'/>
                        <div className='ui-teamwork-searcher'>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
                            <div className='ui-teamwork-searcher-item'>dfdfdfdfdfdfdf</div>
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
                    <input type='button' className='ui-teamwork-confirm'/>
                </div>
            </section>
        );
    }
}