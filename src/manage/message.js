/**
 * 消息通知组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class Message extends Component {
    constructor(props) {
        super(props);
        this.crumbs = [{key:0,text:'消息通知'}];
        this.state = {data:[]};
    }

    componentDidMount() {
        axios.post(api.U('getMessageList'),api.D({token:this.props.token,uid:this.props.uid}))
        .then(response => {
            this.setState({data:response.data.data});
            console.log(response.data);
        });
    }

    render () {
        let props = this.props,
            html = this.state.data.map(obj => 
                <div className='ui-msg-box' key={obj.id}>
                    <div>{Number(obj.time).dateFormat('day')}</div>
                    <div>
                        <div className='ui-msg-box-title'>{obj.title}</div>
                        <div className='ui-msg-box-time'>{Number(obj.time).dateFormat()}</div>
                        <div className='ui-msg-box-info'>{obj.content}</div>
                    </div>
                </div>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <section className='ui-container'>{html}</section>
            </div>
        );
    }
}

export default Message;