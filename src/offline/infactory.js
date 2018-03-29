/**
 * 入厂组件
 * @author yangyunlong
 */
import React, {Component} from 'react';

export default class InFactory extends Component{
    constructor(props) {
        super(props);
        this.state = {data:[],choose:[],isAllChoose:false}
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.onChooseRequest = this.onChooseRequest.bind(this);
        this.onAllChooseRequest = this.onAllChooseRequest.bind(this);
        this.onConfirmResquest = this.onConfirmResquest.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('infactory'),api.data({token:this.props.token}))
        .then(response => {
            console.log(response.data);
            this.setState({data:response.data.data});
        });
    }

    onSearchRequest(word) {
        axios.post(api.U('offlineClean'),api.data({token:this.props.token,ordersn:word}))
        .then(response => {
            this.setState({data:response.data.data,choose:[],isAllChoose:false});
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

    onAllChooseRequest() {
        let state = this.state,
            len = state.data.length,
            tempArr = [];
        if (state.isAllChoose) {
            this.setState({choose:[],isAllChoose:false});
        } else {
            for (let i = 0;i < len;++i) {
                tempArr.push(state.data[i].id);
            }
            this.setState({choose:tempArr,isAllChoose:true});
        } 
    }
    onConfirmResquest() {
        if (this.state.choose.length < 1) return;
        axios.post(
            api.U('offlineCleanRequest'),
            api.data({token:this.props.token,items:JSON.stringify(this.state.choose)})
        )
        .then(response => {
            if (api.verify(response.data)) {
                axios.post(api.U('offlineClean'),api.data({token:this.props.token}))
                .then(response => {
                    this.setState({data:response.data.data,choose:[],isAllChoose:false});
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
                </tr>
            );
        return (
            <div>
                <section className='ui-container'>
                    <div className='ui-box-between' style={{paddingBottom:'16px'}}>
                        <div></div>
                        <div style={{height:'40px',lineHeight:'40px'}}>
                            <span style={{marginRight:'20px'}}>已选择<span className='ui-red'>{state.choose.length}</span>件</span>
                            <span 
                                style={{marginRight:'20px'}} 
                                className={'ui-checkbox' + (state.isAllChoose ? ' ui-checked' : '')} 
                                onClick={this.onAllChooseRequest}
                            >全选</span>
                            <input type='button' value='入厂' className='ui-btn-tab' onClick={this.onConfirmResquest}/>
                        </div>
                    </div>
                    <table className='ui-table'>
                        <thead>
                            <tr className='ui-fieldset ui-tr-h'><th>衣物编码</th><th>名称</th></tr>
                        </thead>
                        <tbody>{html}</tbody>
                    </table>
                </section>
            </div>
        );
    }
}