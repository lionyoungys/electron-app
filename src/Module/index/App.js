/**
 * 后台首页界面组件
 * @author yangyunlong
 */

import React from 'react';
import './App.css';
const list = [
    {key:0,value:'收件',view:'take'},
    {key:1,value:'入厂',view:'in_factory'},
    {key:2,value:'清洗',view:'clean'},
    {key:3,value:'烘干',view:'dry'},
    {key:4,value:'熨烫',view:'ironing'},
    {key:5,value:'质检',view:'check'},
    {key:6,value:'上挂',view:'put_on'},
    {key:7,value:'出厂',view:'out_of_factory'},
    {key:8,value:'取衣',view:'take_off'},
    {key:9,value:'返流审核',view:null},
    {key:10,value:'新建会员',view:null},
    {key:11,value:'会员充值',view:null},
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
                    key={list[i].key}
                    data-view={list[i].view}
                >{list[i].value}</div>
            );
        }

        for (let i = topLen;i < len;++i) {
            bottom.push(
                <div 
                    onClick={this.props.changeView}
                    key={list[i].key}
                    data-key={list[i].key}
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
