/**
 * 门店信息组件
 * @author yangyunlong
 */
import React, {Component} from 'react';


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
        this.changeCardPrice = this.changeCardPrice.bind(this);    //修改会员卡金额
        this.changeCardDiscount = this.changeCardDiscount.bind(this);    //修改会员卡折扣
        this.confirm = this.confirm.bind(this);    //确认操作
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
    changeCardPrice(e) {
        let state = this.state,
            id = e.target.dataset.id,
            value = e.target.value;
        let index = id.inObjectArray(state.cards,'id');
        state.cards[index].price = value;
        this.setState({cards:this.state.cards});
    }
    changeCardDiscount(e) {
        let state = this.state,
            id = e.target.dataset.id,
            value = e.target.value;
        let index = id.inObjectArray(state.cards,'id');
        state.cards[index].discount = value;
        this.setState({cards:this.state.cards});
    }
    confirm() {
        let props = this.props,
            state = this.state;
        axios.post(
            api.U('updMerchantCard'),
            api.data({
                token:props.token,
                json_data:JSON.stringify(state.cards)
            })
        )
        .then((response) => {
            let result = response.data;
            if (api.verify(result)) {
                axios.post(
                    api.U('updMerchantInfo'),
                    api.data({
                        token:props.token,
                        phone:state.phoneNumber,
                        round:state.serviceRange,
                        fuwu_amount:state.serviceAmount,
                        fuwu_num:state.piece,
                        fuwu_total:state.reduceAmount
                    })
                )
                .then((res) => {
                    if (api.verify(res.data)) {
                        props.changeView({element:'info'});
                    } else {
                        //错误提醒
                        console.log(res.data);
                    }
                });
            } else {
                //错误提醒
                console.log(result);
            }

        });
    }

    render() {
        let state = this.state,
            style = {paddingTop:'26px'},
            html = state.cards.map((obj) =>
                <p className='ui-info-card-row' key={obj.id} style={{width:'500px'}}>
                    <span>{obj.card_name}</span>
                    <span>
                        {
                            10 == obj.discount ? 
                            '无折扣' 
                            : 
                            (
                                <span>
                                    <input 
                                        type='text'
                                        className='ui-input2 ui-text-font16'
                                        value={obj.discount}
                                        onChange={this.changeCardDiscount}
                                        data-id={obj.id}
                                    />&nbsp;折
                                </span>
                            )
                        }
                    </span>
                    <span>
                        充值
                        <input 
                            type='text'
                            className='ui-input2 ui-text-font16'
                            value={obj.price}
                            onChange={this.changeCardPrice}
                            data-id={obj.id}
                        />元
                    </span>
                </p>
            );
        return (
            <div>
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
                            onClick={this.confirm}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoEditor;