/**
 * 商品添加界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
    }

    componentDidMount() {
        
    }
    render() {
        return (
            <div>
                <Crumb data={[{key:0,value:'商品管理',view:'goods'},{key:1,value:'商品添加'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div style={{textAlign:'right'}}>
                        <button type='button' className='m-btn m-btn-middle m-btn-confirm'>确定</button>
                    </div>
                    <div className='m-box'>
                        
                    </div>
                </div>
            </div>
        );
    }
}