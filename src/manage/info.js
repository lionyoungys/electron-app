/**
 * 门店信息组件
 * @author yangyunlong
 */
import React, {Component} from 'react';


class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',mname:'',address:'',image:'',phoneNumber:'',
            serviceRange:0,serviceAmount:0,piece:0,reduceAmount:0,
            cards:[]
        };
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


    render() {
        let state = this.state,
            html = state.cards.map((obj) =>
                <p className='ui-info-card-row' key={obj.id}>
                    <span>{obj.card_name}</span>
                    <span>{10 == obj.discount ? '无折扣' : (obj.discount + '折')}</span>
                    <span>充值{obj.price}元</span>
                </p>
            );
        return (
            <div>
                <div className='ui-container'>
                    <div className='ui-info-row'>
                        <div>门店编号：</div><div>{state.id}</div>
                    </div>
                    <div className='ui-info-row'>
                        <div>门店名称：</div><div>{state.mname}</div>
                    </div>
                    <div className='ui-info-row'>
                        <div>门店地址：</div><div>{state.address}</div>
                    </div>
                    <div className='ui-info-row'>
                        <div>门店电话：</div><div>{state.phoneNumber}</div>
                    </div>
                    <div className='ui-info-row'>
                        <div>服务范围：</div><div>{state.serviceRange}km</div>
                    </div>
                    <div className='ui-info-row'>
                        <div>上门服务费：</div>
                        <div style={{paddingBottom:'40px'}}>
                            <p>上门服务费：{state.serviceAmount}元</p>
                            <p>满减数：{state.piece}件</p>
                            <p>满减金额：{state.reduceAmount}元</p>
                        </div>
                    </div>
                    <div className='ui-info-row' style={{paddingBottom:'32px'}}>
                        <div>专店会员卡：</div><div>{html}</div>
                    </div>
                    <div className='ui-info-row'>
                        <div></div>
                        <input 
                            type='button' 
                            value='编辑' 
                            className='ui-btn-tab' 
                            onClick={this.props.changeView}
                            data-e='info_editor'
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Info;