/**
 * 上挂组件
 * @author yangyunlong
 */
import React, {Component} from 'react';
import {Search} from '../static/UI';

export default class Registration extends Component{
    constructor(props) {
        super(props);
        this.state = {data:[],choose:[],start:'',end:''}
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.onChooseRequest = this.onChooseRequest.bind(this);
        this.onConfirmResquest = this.onConfirmResquest.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('offlinePutNumber'),api.data({token:this.props.token}))
        .then(response => {
            console.log(response.data);
            this.setState({data:response.data.data});
        });
    }

    onSearchRequest(word) {
        axios.post(api.U('offlinePutNumber'),api.data({token:this.props.token,clean_number:word}))
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
        ) return;

        axios.post(
            api.U('offlinePutNumberRequest'),
            api.data({
                token:this.props.token,
                //json_data:state.choose.toString(),
                ids:state.choose.toString(),
                //start:state.start,
                put_number:state.start,
                end:state.end
            })
        )
        .then(response => {
            if (api.verify(response.data)) {
                axios.post(api.U('offlinePutNumber'),api.data({token:this.props.token}))
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
                        >{obj.clean_number}</span>
                    </td>
                    <td>{obj.name}</td>
                </tr>
            );
        return (
            <div>
                <section className='ui-container'>
                    <div className='ui-box-between' style={{paddingBottom:'16px'}}>
                        <div>
                            <Search placeholder='输入订单后六位搜索' callback={this.onSearchRequest}/>
                            <span>&emsp;或扫一扫</span>
                        </div>
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
                            <tr className='ui-fieldset ui-tr-h'><th>衣物编号</th><th>项目</th></tr>
                        </thead>
                        <tbody>{html}</tbody>
                    </table>
                </section>
            </div>
        );
    }
}