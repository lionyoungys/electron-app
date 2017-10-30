/**
 * 线下送洗组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Search} from '../static/UI';

export default class OfflineClean extends Component{
    constructor(props) {
        super(props);
        this.state = {data:[],choose:[]}
        this.onSearchRequest = this.onSearchRequest.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('offlineClean'),api.data({token:this.props.token}))
        .then(response => {
            this.setState({data:response.data.data});
        });
    }

    onSearchRequest(word) {
        console.log(word);
    }
    render() {
        let props = this.props,
            state = this.state,
            html = state.data.map(obj => 
                <tr className='ui-fieldset ui-tr-d' key={obj.id}>
                    <td><span className='ui-checkbox'>{obj.ordersn}</span></td><td>{obj.name}</td><td>{obj.number}</td>
                </tr>
            );
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'送洗'}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between' style={{paddingBottom:'16px'}}>
                        <Search placeholder='输入订单后六位搜索' callback={this.onSearchRequest}/>
                        <div style={{height:'40px',lineHeight:'40px'}}>
                            <span style={{marginRight:'20px'}}>已选择<span className='ui-red'>{state.choose.length}</span>件</span>
                            <span style={{marginRight:'20px'}} className='ui-checkbox'>全选</span>
                            <input type='button' value='送洗' className='ui-btn-tab'/>
                        </div>
                    </div>
                    <table className='ui-table'>
                        <thead>
                            <tr className='ui-fieldset ui-tr-h'><th>订单号</th><th>项目</th><th>件数</th></tr>
                        </thead>
                        <tbody>{html}</tbody>
                    </table>
                </section>
            </div>
        );
    }
}