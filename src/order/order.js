/**
 * 订单处理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs,Search} from '../static/UI';
class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {choose:1};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        this.setState({choose:e.target.dataset.key});
    }
    handleSearch(e) {
        console.log(e.target.dataset.word);
    }
    render() {
        let state = this.state,
            tabs = [
                {key:1,text:'待处理'},
                {key:2,text:'待收件'},
                {key:3,text:'待清洗'},
                {key:4,text:'清洗中'},
                {key:5,text:'待送达'}
            ];
        return (
            <div>
                <Crumbs list={[{text:'订单处理',key:1}]} callbackParent={this.props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <Tabs tabs={tabs} choose={state.choose} callbackParent={this.handleClick}/>
                        <Search placeholder='请输入订单号' callbackParent={this.handleSearch}/>
                    </div>
                </section>
            </div>
        );
    }
}

export default Order;