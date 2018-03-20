/**
 * 业绩统计组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Checkbox from '../UI/checkbox/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {start:'', end:''};
    }
    componentDidMount() {
        laydate.render({
            elem:this.input,
            //value:'1980-01-01',
            min:'2016-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value => this.setState({start:value}))
        });
        laydate.render({
            elem:this.input2,
            //value:'1980-01-01',
            min:'2016-01-01',max:0,
            btns: ['now', 'confirm'],
            theme:'#ff6e42',
            done:(value => this.setState({end:value}))
        });
    }
    render() {
        return (
            <div>
                <Crumb data={[{key:0,value:'业绩统计'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div>
                        操作者:&nbsp;<select><option>test1</option><option>test2</option><option>test3</option></select>
                        &emsp;
                        时间:&nbsp;
                        <input type='text' className='m-text-c m-small m-input-small' value={this.state.start} ref={input => this.input = input} readOnly placeholder='开始日期'/>
                        &nbsp;--&nbsp;
                        <input type='text' className='m-text-c m-small m-input-small' value={this.state.end} ref={input => this.input2 = input} readOnly placeholder='结束日期'/>
                    </div>
                    <div className='m-box'>
                        <table className='m-table'>
                            <thead><tr className='m-text-c bd-lightgrey m-bg-white'>
                                <th>工序名称</th><th>操作者姓名/编号</th><th>处理件数</th><th>返流次数</th>
                            </tr></thead>
                            <tbody>
                                <tr className='m-text-c bd-lightgrey'><td>收件</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>入厂</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>清洗</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>烘干</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>熨烫</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>质检</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>上挂</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>出厂</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>取衣</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>返流审核</td><td></td><td></td><td></td></tr>
                                <tr className='m-text-c bd-lightgrey'><td>会员管理</td><td></td><td></td><td></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}