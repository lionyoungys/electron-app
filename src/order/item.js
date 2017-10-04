/**
 * 添加项目组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs, {Tabs} from '../static/UI';
class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {choose:0,tabs:[],data:[],items:[]};
        this.crumbs = [{text:'订单处理',key:0,e:'order'},{text:'添加项目',key:1}];    //面包屑参数
        //选项卡参数
        this.tabs = [];
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {    //获取项目列表
        let token = this.props.token,
            orderId = this.props.param;
        axios.post(api.U('getItems'),api.data({token:token,orderid:orderId}))
        .then((response) => {
            let result = response.data.data,
                len = result.length;
            var tempTabs = [],tempData = [];
            for (var i = 0;i < len;++i) {
                tempTabs.push({key:i,text:result[i].type_name});
                tempData.push(result[i].type);
            }
            this.setState({tabs:tempTabs,data:tempData});
            console.log(result);
        });
    }
    handleClick(e) {
        this.setState({choose:e.target.dataset.key});
    }
    render() {
        let props = this.props,
            state = this.state,
            wordStyle = {height:'42px',lineHeight:'42px',minWidth:'106px',width:'auto'};
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callbackParent={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between'>
                        <Tabs tabs={state.tabs} choose={state.choose} callbackParent={this.handleClick}/>
                        <div className='ui-box-between'>
                            <div style={wordStyle}>
                                已选择&nbsp;<span className='ui-red'>1</span>&nbsp;件
                            </div>
                            <input type='button' value='下一步，工艺加价' className='ui-btn ui-btn-tab'/>
                        </div>
                    </div>
                    <section className='ui-content'>
                        <table className='ui-table'>
                            <thead><tr className='ui-tr-h ui-fieldset'>
                                <td>名称</td><td>所属分类</td><td>价格</td><td>件数</td>
                            </tr></thead>
                            <tbody className='ui-fieldset'>

                            </tbody>
                        </table>
                    </section>
                </section>
            </div>
        );
    }
}
export default Item;