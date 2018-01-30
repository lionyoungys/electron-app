/**
 * 返流界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.id = this.props.param.id;
        this.from = this.props.param.state;
        this.crumb = [{key:1,value:'返流'}];
        if (50 == this.from) {
            this.crumb.unshift({key:0,value:'烘干',view:'dry'});
        } else if (51 == this.from) {
            this.crumb.unshift({key:0,value:'熨烫',view:'ironing'});
        } else if (52 == this.from) {
            this.crumb.unshift({key:0,value:'质检',view:'check'});
        }
    }

    render() {
        return (
            <div>
                <Crumb data={this.crumb} callback={this.props.changeView}/>
                <div className='m-container'>

                </div>
            </div>
        );
    }
}