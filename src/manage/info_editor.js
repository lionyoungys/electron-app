/**
 * 门店信息组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

class InfoEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',mname:'',address:'',image:'',phoneNumber:'',
            serviceRange:0,serviceAmount:0,piece:0,reduceAmount:0,
            cards:[]
        };
        this.changePhoneNumber = this.changePhoneNumber.bind(this);    //修改电话
        this.changeRange = this.changeRange.bind(this);    //修改服务范围
        this.changeServiceAmount = this.changeServiceAmount.bind(this)    //上门服务费
        this.changePiece = this.changePiece.bind(this);    //满减数
        this.changeReduceAmount = this.changeReduceAmount.bind(this);    //满减金额
    }

    componentDidMount() {
        axios.post(api.U('merchantInfo'),api.data({token:this.props.token}))
        .then((response) => {
            let result = response.data.data;
            this.setState({
                id:result.id,
                mname:result.mname,
                address:result.address,
                image:result.qrcode,
                phoneNumber:result.phone,
                serviceRange:result.round,
                serviceAmount:result.fuwu_amount,
                piece:result.fuwu_num,
                reduceAmount:result.fuwu_total,
                cards:result.cards
            });
            console.log(result);
        });
    }

    changePhoneNumber(e) {this.setState({phoneNumber:e.target.value})}
    changeRange(e) {this.setState({serviceRange:e.target.value})}
    changeServiceAmount(e) {this.setState({serviceAmount:e.target.value})}
    changePiece(e) {this.setState({piece:e.target.value})}
    changeReduceAmount(e) {this.setState({reduceAmount:e.target.value})}

    render() {
        let state = this.state,
            style = {paddingTop:'26px'},
            html = state.cards.map((obj) =>
                <p className='ui-info-card-row' key={obj.id} data-id={obj.id}>
                    <span>{obj.card_name}</span>
                    <span>{10 == obj.discount ? '无折扣' : (obj.discount + '折')}</span>
                    <span>充值{obj.price}元</span>
                </p>
            );
        return (
            <div>
                <Crumbs 
                    crumbs={[{text:'门店信息',key:0,e:'info'},{text:'修改信息',key:1}]} 
                    callback={this.props.changeView}
                />
                <div className='ui-container'>
                    <div className='ui-info-row'>
                        <div>门店电话：</div>
                        <input 
                            type='text'
                            className='ui-input3' 
                            value={state.phoneNumber} 
                            onChange={this.changePhoneNumber}
                        />
                    </div>
                    <div className='ui-info-row' style={style}>
                        <div>服务范围：</div>
                        <input 
                            type='text'
                            className='ui-input2 ui-text-font16'
                            value={state.serviceRange}
                            onChange={this.changeRange}
                        />km
                    </div>
                    <div className='ui-info-row' style={style}>
                        <div>上门服务费：</div>
                        <div style={{paddingBottom:'40px'}}>
                            <p>
                                上门服务费：
                                <input 
                                    type='text'
                                    className='ui-input2 ui-text-font16'
                                    value={state.serviceAmount}
                                    onChange={this.changeServiceAmount}
                                />元
                            </p>
                            <p style={style}>
                                满减数：
                                <input 
                                    type='text'
                                    className='ui-input2 ui-text-font16'
                                    value={state.piece}
                                    onChange={this.changePiece}
                                />件
                            </p>
                            <p style={style}>
                                满减金额：
                                <input 
                                    type='text'
                                    className='ui-input2 ui-text-font16'
                                    value={state.reduceAmount}
                                    onChange={this.changeReduceAmount}
                                />元
                            </p>
                        </div>
                    </div>
                    <div className='ui-info-row' style={{paddingBottom:'32px'}}>
                        <div>专店会员卡：</div><div>{html}</div>
                    </div>
                    <div className='ui-info-row'>
                        <div></div>
                        <input 
                            type='button' 
                            value='确认' 
                            className='ui-btn-tab' 
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoEditor;