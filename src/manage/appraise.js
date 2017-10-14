/**
 * 用户评价组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Starts} from '../static/UI';

class Appraise extends Component {
    constructor(props) {
        super(props);
        this.state = {list:[]};
    }

    componentDidMount() {

    }

    render() {
        let props = this.props;
        return (
            <div>
                <Crumbs crumbs={[{text:'用户评价',key:0}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-appraise-box'>
                        <div className='ui-appraise-row'>
                            <div>
                                <span>2323232</span>
                                &emsp;<Starts number='5' lighter='3.7'/>&emsp;
                                <span className='ui-red'>5分</span>
                            </div>
                            <input type='button' value='回复' className='ui-btn ui-btn-cancel ui-btn-middle'/>
                        </div>
                        <div className='ui-appraise-row2'>2017-06-24 10:14</div>
                        <div className='ui-appraise-row3'>
                            fdfdfdffdfdfdffdfd
                        </div>
                        <div className='ui-appraise-row4'>
                            <span className='ui-default'>商家回复：</span>对方的负担风地方
                        </div>
                        <div className='ui-appraise-row5'>
                            <div className='ui-appraise-textarea'>
                                <span>商家回复：</span>
                                <textarea maxLength='50'></textarea>
                                <em className='ui-textarea-postfix'>0/50</em>
                            </div>
                            <input type='button' value='确认' className='ui-btn ui-btn-confirm ui-btn-large'/>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Appraise;