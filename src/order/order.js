/**
 * 订单处理组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs,Search} from '../static/UI';
class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {choose:0,data:null};
        this.handleClick = this.handleClick.bind(this);
        this.tabs = [
            {key:0,text:'待处理'},
            {key:1,text:'待收件'},
            {key:2,text:'待清洗'},
            {key:3,text:'清洗中'},
            {key:4,text:'待送达'}
        ];
        this.theadsModel = [
            <tr className='ui-tr-h'>
                <td>订单号</td>
                <td>预约上门时间</td>
                <td>姓名</td>
                <td>电话</td>
                <td>地址</td>
                <td>时间</td>
                <td>处理</td>
            </tr>,
            <tr className='ui-tr-h'>
                <td>订单号</td>
                <td>项目</td>
                <td>工艺加价</td>
                <td>件数</td>
                <td>总价</td>
                <td>姓名／电话</td>
                <td>地址</td>
                <td>时间</td>
                <td>操作</td>
            </tr>
        ];
        this.theads = [
            this.theadsModel[0],
            this.theadsModel[0],
            this.theadsModel[1],
            this.theadsModel[1],
            this.theadsModel[1]
        ];
              

    }
    componentDidMount() {
        axios.post(api.U('orderHandle'),api.data({token:this.props.token,state:0}))
        .then((response) => {
            var result = response.data;
            console.log(result);
        });
    }
    handleClick(e) {
        this.setState({choose:e.target.dataset.key});
    }
    handleSearch(e) {
        console.log(e.target.dataset.word);
    }
    //待处理
    willDispose() {

    }
    //待收件
    willTake() {

    }
    //待清洗
    willClean() {

    }
    //清洗中
    cleaning() {

    }
    //待送达
    willDelivery() {
        
    }

    render() {
        let state = this.state;
        return (
            <div>
                <Crumbs crumbs={[{text:'订单处理',key:1}]} callbackParent={this.props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <Tabs tabs={this.tabs} choose={state.choose} callbackParent={this.handleClick}/>
                        <Search placeholder='请输入订单号' callbackParent={this.handleSearch}/>
                    </div>
                    <div className='ui-content'>
                        <table className='ui-table ui-table-b'>
                            <thead>{this.theads[state.choose]}</thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    }
}

export default Order;