/**
 * 线下工艺加价组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';

export default class OfflineCraft extends Component{
    constructor(props) {
        super(props);
        this.params = this.props.param.paramToObject();
        console.log(this.params);
        this.id = this.params.id;
        this.state = {total:0,amount:0,count:0,service:0,items:[],show:false,tempId:null};
        this.crumbs = [
            {key:0,text:'收衣',e:'take'},
            {text:'添加项目',key:1,e:'item',param:this.props.param},
            {text:'工艺加价',key:2}
        ];
        this.done = this.done.bind(this);
        this.editor = this.editor.bind(this);
    }


    componentDidMount() {
        let props = this.props;
        axios.post(api.U('editorPrice'),api.data({token:props.token,id:this.id}))
        .then((response) => {
            let result = response.data.data;
            this.setState({
                total:result.total,
                amount:result.amount,
                count:result.total_num,
                service:result.fuwu,
                items:result.list
            });
            console.log(result);
        });
    }

    done() {
        let props = this.props;
        if ('undefined' !== typeof this.params.from && 'offline' == this.params.from) {
            props.changeView({element:'check',param:props.param});
        } else {
            axios.post(api.U('gotIt'),api.data({token:props.token,id:this.id}))
            .then((response) => {
                console.log(response.data);
                if (api.verify(response.data)) {
                    props.changeView({element:'order'});
                }
            });
        }
    }

    editor(e) {
        this.props.changeView({
            element:'offline_editor',
            param:{order_id:this.id,id:e.target.dataset.id}
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            style = {flexDirection:'row-reverse'},
            style2 = {paddingRight:'56px',fontSize:'16px'},
            html = state.items.map(obj => 
                <tr className='ui-tr-d' key={obj.id}>
                    <td>{obj.name}</td>
                    <td>{obj.clean_number}</td>
                    <td>{obj.price}</td>
                    <td>{obj.hedging}</td>
                    <td>{obj.hedging * 200}</td>
                    <td>{obj.special}</td>
                    <td>{obj.take_time}</td>
                    <td>{obj.special_comment}</td>
                    <td>
                        <input 
                            type='button' 
                            className='ui-btn ui-btn-editor' 
                            value='编辑' 
                            data-id={obj.id}
                            onClick={this.editor}
                        />
                    </td>
                </tr>
            );
        return (
            <div>
                <Crumbs crumbs={this.crumbs} callback={props.changeView}/>
                <div className='ui-container'>
                    <table className='ui-table-b'>
                        <thead><tr className='ui-tr-h'>
                            <th>名称</th>
                            <th>衣物编码</th>
                            <th>价格</th>
                            <th>保值金额</th>
                            <th>保值清洗费</th>
                            <th>特殊工艺加价</th>
                            <th>取衣时间</th>
                            <th>备注</th>
                            <th>操作</th>
                        </tr></thead>
                        <tbody>{html}</tbody>
                    </table>
                    <div className='ui-content' style={style}>
                        <div style={style2}>价格：<span className='ui-red'>{state.amount}</span></div>
                        <div style={style2}>共<span className='ui-red'>&nbsp;{state.count}&nbsp;</span>件</div>
                    </div>
                    <div className='ui-content' style={style}>
                        <div>
                            <input 
                                type='button' 
                                value='-/+' 
                                className='ui-btn ui-btn-tab' 
                                data-param={props.param} 
                                data-e='item'
                                onClick={props.changeView}
                            />
                            &emsp;
                            <input type='button' value='确认收件' className='ui-btn ui-btn-tab' onClick={this.done}/>
                        </div>
                        <div style={{lineHeight:'42px',paddingRight:'32px',fontSize:'20px'}}>
                            总额：<span className='ui-red'>&yen;{state.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}