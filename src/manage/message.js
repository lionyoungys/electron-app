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
    }

    componentDidMount() {
        
    }

    render () {
        let props = this.props;
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <section className='ui-container'>

                </section>
            </div>
        );
    }
}

export default Message;