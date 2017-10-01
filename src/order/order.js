/**
 * 订单处理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';

class Pending extends Component {
    constructor(props) {
        super(props);
        this.changeView = this.changeView.bind(this);
    }
    changeView(e) {this.props.changeView(e.target.dataset.element);}
    render() {
        return (
            <div>
                待处理
                <input type='button' value='test' data-element='index' onClick={this.changeView}/>
            </div>
        );
    }
}

export default Pending;