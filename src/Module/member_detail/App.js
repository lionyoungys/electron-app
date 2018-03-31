/**
 * 会员详情组件
 * @author yangyunlong
 */
import React from 'react';

export default class extends React.Component{
    constructor(props) {
        super(props);
        this.state = {data:{recode:[]}};
    }

    componentDidMount() {
        api.post('member_detail', {token:this.props.token,umobile:this.props.param}, (response, verify) => {
            verify && this.setState({data:response.data.result})
        })
    }

    render() {
        let data = this.state.data;
        let html = data.recode.map(obj =>
                <div className='ui-md-row' key={obj.log_time}>
                    <div>
                        <span>{2 == obj.type ? '会员充值' : '会员洗衣消费'}</span>
                        <span>{obj.log_time}</span>
                    </div>
                    <div>{2 == obj.type ? '' : '-'}&yen;{obj.amount}</div>
                </div>
            );
        return (
            <div>
                <section className='ui-md-box'>
                    <div><span>姓名：</span><span>{data.uname}</span></div>
                    <div><span>性别：</span><span>{1 == data.sex ? '男' : '女'}</span></div>
                    <div><span>会员类型：</span><span>{data.cname}</span></div>
                    <div><span>手机号：</span><span>{data.umobile}</span></div>
                    <div><span>会员余额：</span><span className='ui-red'>&yen;{data.cbalance}</span></div>
                    <div><span>会员折扣：</span><span>{data.cdiscount}</span></div>
                    <div><span>会员生日：</span><span>{data.birthday}</span></div>
                    <div><span>办理时间：</span><span>{data.ctime}</span></div>
                    <div><span>会员地址：</span><span>{data.addr}</span></div>
                    <div><span>备注：</span><span>{data.remark}</span></div>
                </section>
                <div className='ui-md-partition'>余额明细</div>
                {html}
            </div>
        );
    }
}