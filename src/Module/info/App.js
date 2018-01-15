/**
 * 门店信息界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.post(api.U('info'), api.D({token:this.props.token}))
        .then(response => {
            console.log(response.data);
        });
    }
    render() {
        return (
            <div>
                <Crumb data={[{key:0,value:'门店信息'}]} callback={this.props.callback}/>
                <div className='m-container'>
                    <table className='info'>
                        <tbody>
                            <tr><td>门店编号</td><td></td></tr>
                            <tr><td>门店名称</td><td></td></tr>
                            <tr><td>门店地址</td><td></td></tr>
                            <tr><td>门店电话</td><td></td></tr>
                            <tr><td>服务范围</td><td></td></tr>
                            <tr><td>门店模块</td><td></td></tr>
                            <tr><td>商家信息</td><td></td></tr>
                            <tr><td>上门服务费</td><td></td></tr>
                            <tr><td>专店会员卡</td><td></td></tr>
                        </tbody>
                    </table>
                    <button className='m-btn middle confirm'>编辑</button>
                </div>
            </div>
        );
    }
}