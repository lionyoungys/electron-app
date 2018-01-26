/**
 * 后台首页界面组件
 * @author yangyunlong
 */

import React from 'react';
import './App.css';
const list = [
    {value:'收件',view:'take'},
    {value:'入厂',view:'in_factory'},
    {value:'清洗',view:'clean'},
    {value:'烘干',view:'offline_drying'},
    {value:'熨烫',view:'offline_ironing'},
    {value:'质检',view:'offline_check'},
    {value:'上挂',view:'registration'},
    {value:'出厂',view:'outfactory'},
    {value:'取衣',view:'offline_take'},
    {value:'返流审核',view:'back'},
    {value:'新建会员',view:'member'},
    {value:'会员充值',view:'member2'},
];



export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentData:[],previousData:[]};
    }

    render() {
        let len = list.length, topLen = len - 2, top = [], bottom = [];
        for (let i = 0;i < topLen;++i) {
            top.push(
                <div 
                    onClick={this.props.changeView}
                    key={list[i].view}
                    data-view={list[i].view}
                >{list[i].value}</div>
            );
        }

        for (let i = topLen;i < len;++i) {
            bottom.push(
                <div 
                    onClick={this.props.changeView}
                    key={list[i].view}
                    // className='disabled'
                    data-view={list[i].view}
                >{list[i].value}</div>
            );
        }

    	return (
    		<div>
                <div className='index'>{top}</div>
                <div className='index'></div>
	    		<div className='index'>{bottom}</div>
	        </div>
    	)
   }
}
