/**
 * 消息通知组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../api';
import Crumbs from '../static/UI';

class Message extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'消息通知'}];
        this.state = {data:[],isShow:false, choose:[]};
        this.onDeleteRequest = this.onDeleteRequest.bind(this);
        this.chooseAll = this.chooseAll.bind(this);
        this.choose = this.choose.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('getMessageList'),api.D({token:this.props.token,uid:this.props.uid}))
        .then(response => {
            this.setState({data:response.data.data});
            console.log(response.data);
        });
    }

    onDeleteRequest() {
        let choose = this.state.choose,
            len = choose.length;
        if (len > 0) {
            for (let i = 0;i < len;++i) {
                axios.post(
                    api.U('handleMessage'),
                    api.D({token:this.props.token,uid:this.props.uid,state:2,messageid:choose[i]})
                )
            }
            axios.post(api.U('getMessageList'),api.D({token:this.props.token,uid:this.props.uid}))
            .then(response => {
                this.setState({data:response.data.data});
                console.log(response.data);
            });
        }
    }

    chooseAll(e) {
        let data = this.state.data,
            choose = [],
            len = data.length;
        for (let i = 0;i < len;++i) {
            choose.push(data[i].id);
        }
        this.setState({choose:choose});
        e.target.classList.add('ui-checked');
    }

    choose(e) {
        let id = e.target.dataset.id,
            index = id.inArray(this.state.choose);
        if (-1 === index) {
            this.state.choose.push(id);
        } else {
            this.state.choose.splice(index, 1);
        }
        this.setState({choose:this.state.choose});
        console.log(this.state.choose);
    }

    render () {
        let props = this.props,
            state = this.state,
            html = state.data.map(obj => 
                <div className='ui-msg-box' key={obj.id}>
                    <span 
                        data-id={obj.id}
                        className={'ui-checkbox' + (-1 != obj.id.inArray(state.choose) ? ' ui-checked' : '')} 
                        style={{display:(state.isShow ? 'inline-block' : 'none')}}
                        onClick={this.choose}
                    ></span>
                    <div>{Number(obj.time).dateFormat('day')}</div>
                    <div>
                        <div className='ui-msg-box-title'>
                            {obj.title}&emsp;
                            <span className='ui-msg-box-time'>{Number(obj.time).dateFormat()}</span>
                        </div>
                        <div className='ui-msg-box-info'>{obj.content}</div>
                    </div>
                </div>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <div></div>
                        <div>
                            <div style={{display:(!state.isShow ? 'inline-block' : 'none')}}>
                                <input type='button' value='编辑' onClick={() => this.setState({isShow:true})} className='ui-btn ui-btn-cancel'/>
                            </div>
                            <div style={{display:(state.isShow ? 'inline-block' : 'none')}}>
                                已选择<span className='ui-red'>{state.choose.length}</span>个
                                &emsp;
                                <span className='ui-checkbox' onClick={this.chooseAll}>全选</span>
                                &emsp;
                                <input type='button' value='删除' className='ui-btn ui-btn-cancel' onClick={this.onDeleteRequest}/>
                                &emsp;
                                <input type='button' value='完成' className='ui-btn ui-btn-cancel' onClick={() => this.setState({isShow:false})}/>
                            </div>
                        </div>
                    </div>
                    {html}
                </section>
            </div>
        );
    }
}

export default Message;