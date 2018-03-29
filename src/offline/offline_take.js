/**
 * 线下取衣组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import {Search,CheckboxAlert} from '../static/UI';

export default class OfflineTake extends Component{
    constructor(props) {
        super(props);
        this.state = {data:[],isShow:false,showData:[],tempId:null,history:''};
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.retStatus = this.retStatus.bind(this);
        this.onTakeRequest = this.onTakeRequest.bind(this);
        this.onConfirmTakeRequest = this.onConfirmTakeRequest.bind(this);
        this.onTakePayRequest = this.onTakePayRequest.bind(this);
    }

    onSearchRequest(word) {
        axios.post(api.U('offlineTake'), api.D({token:this.props.token, number:word}))
        .then(response => {
            this.setState({data:response.data.data,history:word});
            console.log(response.data.data);
        });
    }

    onTakePayRequest(e) {
        let dataset = e.target.dataset;
        if (1 != dataset.state) {
            axios.post(api.U('takePay'),api.D({token:this.props.token,order_id:dataset.id}))
            .then(response => {
                console.log(response.data);
                this.props.changeView({element:'pay',param:'from=take&id='+dataset.id});
            });
        }
    }

    onTakeRequest(e) {
        let id = e.target.dataset.id,tempArr = [],tempObj,
            index = id.inObjectArray(this.state.data, 'id'),
            len = this.state.data[index].items.length;
        if (len > 0) {
            for (let i = 0;i < len;++i) {
                tempObj = this.state.data[index].items[i];
                if (2 == tempObj.status) {
                    tempArr.push({key:tempObj.item_id,text:tempObj.name});
                }
            }
            if (tempArr.length > 0) {
                this.setState({isShow:true,showData:tempArr,tempId:this.state.data[index].id});
            }
        }
    }

    onConfirmTakeRequest(list) {
        console.log(list);
        let len = list.length;
        if (len > 0) {
            let tempArr = [];
            for (let i = 0;i < len;++i) {
                tempArr.push(list[i].key);
            }
            axios.post(
                api.U('offlineTakeRequest'),
                api.D({
                    token:this.props.token,
                    order_id:this.state.tempId,
                    type:'one',
                    json_data:JSON.stringify(tempArr)
                })
            )
            .then(response => {
                if (api.verify(response.data)) {
                    axios.post(api.U('offlineTake'), api.D({token:this.props.token, number:this.state.history}))
                    .then(response => {
                        this.setState({data:response.data.data,isShow:false,showData:[]});
                        console.log(response.data.data);
                    });
                }
            });
        }
    }

    getStatus(code) {
        switch(code) {
            case '0':return '已收衣';
            case '1':return '清洗中';
            case '2':return <span style={{color:'red'}}>已上挂</span>;
            case '3':return '已取走';
        }
    }
    retNames(array) {
        let ret = null;
        if (array.length > 0) {
            ret = array.map(obj => 
                <div key={obj.item_id}>{obj.name}</div>
            );
        }
        return ret;
    }
    retStatus(array) {
        let ret = null;
        if (array.length > 0) {
            ret = array.map(obj => 
                <div key={obj.item_id}>{this.getStatus(obj.status)}</div>
            );
        }
        return ret;
    }
    retNumber(array) {
        let ret = null;
        if (array.length > 0) {
            ret = array.map(obj => 
                <div key={obj.item_id}>{obj.put_number}</div>
            );
        }
        return ret;
    }

    render() {
        const noPadding = {padding:'0'};
        let props = this.props,
            state = this.state,
            html = state.data.map(obj =>
                <tr className='ui-tr-d' key={obj.id}>
                    <td>{obj.ordersn}</td>
                    <td className='ui-ot-items-box' style={noPadding}>{this.retNames(obj.items)}</td>
                    <td className='ui-ot-items-box' style={noPadding}>{this.retStatus(obj.items)}</td>
                    <td className='ui-ot-items-box' style={noPadding}>{this.retNumber(obj.items)}</td>
                    <td>件数：{obj.items_count}<br/>总额：&yen;{obj.total_amount}</td>
                    <td>姓名：{obj.username}<br/>手机号：{obj.mobile}</td>
                    <td>{obj.update_time}</td>
                    <td>
                    {
                        1 == obj.pay_state ? 
                        <span style={{color:'#ccc'}}>已支付</span>
                         : 
                        <span style={{color:'red'}}>未支付</span>
                    }
                    </td>
                    <td>
                        <input 
                            type='button' 
                            value='单件取衣' 
                            className='ui-btn ui-btn-confirm' 
                            data-id={obj.id}
                            onClick={this.onTakeRequest}
                        />
                        <div style={{height:'10px'}}></div>
                        <input 
                            type='button' 
                            value='取衣付款' 
                            className='ui-btn ui-btn-confirm'
                            data-state={obj.pay_state}
                            data-id={obj.id}
                            onClick={this.onTakePayRequest}
                        />
                    </td>
                </tr> 
            
            );
            
        return (
            <div>
                <section className='ui-container'>
                    <div className='ui-box-between' style={{paddingBottom:'16px'}}>
                        <div></div>
                        <Search placeholder='请输入客户手机号' callback={this.onSearchRequest}/>
                    </div>
                    <table className='ui-table-b' style={{fontSize:'14px'}}>
                        <thead><tr className='ui-tr-h'>
                            <th>订单号</th><th>项目</th><th>状态</th>
                            <th>挂号</th><th>件数/价格</th><th>姓名/手机号</th>
                            <th>时间</th><th>支付状态</th><th>操作</th>
                        </tr></thead>
                        <tbody>{html}</tbody>
                    </table>
                </section>
                <CheckboxAlert 
                    show={state.isShow} 
                    checkboxs={state.showData}
                    title='单件取衣'
                    button='确认'
                    detail='true'
                    onClose={() => this.setState({isShow:false,showData:[]})}
                    callback={this.onConfirmTakeRequest}
                />
            </div>
        );
    }
}