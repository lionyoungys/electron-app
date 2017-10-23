/**
 * 订单详情组件
 * @author yangyunlong
 */

import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.param.paramToObject();
        console.log(this.params);
    }

    componentDidMount() {
        axios.post(
            api.U('orderDetail'), 
            api.data({token:this.props.token,id:this.params.id})
        )
        .then((response) => {
            let result = response.data;
            console.log(result);
        });
    }

    render () {
        let props = this.props;
        return (
            <div>
                <Crumbs 
                    crumbs={[{key:0,text:'订单查询',e:'order_search'},{key:1,text:'订单详情'}]} 
                    callback={props.changeView}
                />
                <section className='ui-container'>
                    <div style={{borderBottom:'1px dashed #cccccc'}}>
                    sdfdfdf
                    </div>
                </section>
            </div>
        );
    }
}