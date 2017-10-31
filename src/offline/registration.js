/**
 * 上挂组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import '../static/api';
import Crumbs,{Search} from '../static/UI';

export default class Registration extends Component{
    constructor(props) {
        super(props);
        this.state = {data:[],choose:[],start:'',end:''}
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.onChooseRequest = this.onChooseRequest.bind(this);
        this.onConfirmResquest = this.onConfirmResquest.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('registration'),api.data({token:this.props.token}))
        .then(response => {
            this.setState({data:response.data.data});
        });
    }

    onSearchRequest(word) {
        axios.post(api.U('registration'),api.data({token:this.props.token,ordersn:word}))
        .then(response => {
            this.setState({data:response.data.data,choose:[]});
        });
    }
    onChooseRequest(e) {
        let target = e.target,
            id = target.dataset.id;
        if (target.classList.contains('ui-checked')) {
            let index = id.inArray(this.state.choose);
            this.state.choose.splice(index, 1);
        } else {
            this.state.choose.push(id);
        }
        this.setState({choose:this.state.choose});
    }

    onConfirmResquest() {
        let state = this.state;
        if (
            state.choose.length < 1
            ||
            isNaN(state.start)
            ||
            isNaN(state.end)
            ||
            state.start > state.end
        ) return;

        axios.post(
            api.U('handleRegistration'),
            api.data({
                token:this.props.token,
                json_data:JSON.stringify(state.choose),
                start:state.start,
                end:state.end
            })
        )
        .then(response => {
            if (api.verify(response.data)) {
                axios.post(api.U('registration'),api.data({token:this.props.token}))
                .then(response => {
                    this.setState({data:response.data.data,choose:[]});
                });
            }
        });
    }
    render() {
        let props = this.props,
            state = this.state,
            html = state.data.map(obj => 
                <tr className='ui-fieldset ui-tr-d' key={obj.id}>
                    <td>
                        <span 
                            className={'ui-checkbox' + (-1 !== obj.id.inArray(state.choose) ? ' ui-checked' : '')}
                            data-id={obj.id}
                            onClick={this.onChooseRequest}
                        >{obj.ordersn}</span>
                    </td>
                    <td>{obj.name}</td>
                    <td>{obj.number}</td>
                </tr>
            );
        return (
            <div>
                <Crumbs crumbs={[{key:0,text:'上挂'}]} callback={props.changeView}/>
                <section className='ui-container'>
                    <div className='ui-box-between' style={{paddingBottom:'16px'}}>
                        <Search placeholder='输入订单后六位搜索' callback={this.onSearchRequest}/>
                        <div style={{height:'40px',lineHeight:'40px'}}>
                            <span className='ui-inline-box' style={{marginRight:'20px'}}>
                                <input 
                                    type='text' 
                                    value={state.start} 
                                    className='ui-registration-input' 
                                    placeholder='输入开始号'
                                    onChange={e => this.setState({start:e.target.value})}
                                />
                                &nbsp;
                                <span style={{lineHeight:'36px',color:'#999'}}>——</span>
                                &nbsp;
                                <input 
                                    type='text' 
                                    value={state.end} 
                                    className='ui-registration-input' 
                                    placeholder='输入结束号'
                                    onChange={e => this.setState({end:e.target.value})}
                                />
                            </span>
                            <span style={{marginRight:'20px'}}>已选择<span className='ui-red'>{state.choose.length}</span>件</span>
                            <input type='button' value='上挂' className='ui-btn-tab' onClick={this.onConfirmResquest}/>
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