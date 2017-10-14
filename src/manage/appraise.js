/**
 * 用户评价组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class Appraise extends Component {
    constructor(props) {super(props);}

    render() {
        let props = this.props;
        return (
            <div>
                <Crumbs crumbs={[{text:'用户评价',key:0}]} callback={props.changeView}/>
            </div>
        );
    }
}

export default Appraise;