/**
 * 平台消息组件
 * @author yangyunlong
 */
import React from 'react';
import OptionBox from '../../Elem/OptionBox';
import './App.css';



export default class extends React.Component{
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.state = {
            data:[],
            checked:[],
            isDelete:false
        };
        this.type = 1;
        if (tool.isSet(this.props.param)) this.type = this.props.param;
        this.query = this.query.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAllChekced = this.handleAllChekced.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    componentDidMount() {this.query()}
    //数据查询
    query() {
        api.post('msg_list', {token:this.props.token}, (response, verify) => {
            if (verify) {
                let len = response.data.result.length,
                    data = [];
                for (let i = 0;i < len;++i) {
                    this.type == response.data.result[i].type && data.push(response.data.result[i]);
                }
                this.setState({data:data});
            }
        })
    }
    handleClick(value, checked) {
        if (checked) {
            let index = value.inArray(this.state.checked);
            -1 !== index && this.state.checked.splice(index, 1);
        } else {
            this.state.checked.push(value);
        }
        this.setState({checked:this.state.checked});
    }
    handleAllChekced(value, checked) {
        if (checked) {
            this.setState({checked:[]});
        } else {
            let len = this.state.data.length;
            if (!len) return;
            if (this.state.checked.length < len) {
                let checked = [];
                for (let i = 0;i < len;++i) {
                    checked.push(this.state.data[i].id);
                }
                this.setState({checked:checked});
            }
        }
    }
    handleDelete() {
        let len = this.state.checked.length;
        if (!len) return;
        let id;
        for (let i = 0;i < len;++i) {
            id = this.state.checked[i];
            api.post('msg_delete', {token:this.props.token,id:id}, (response, verify) => {
                if (verify) {
                    let index = id.inObjectArray(this.state.data, 'id');
                    if (-1 !== index) {
                        this.state.data.splice(index, 1);
                        this.setState({data:this.state.data, checked:[], isDelete:false});
                    }
                }
            });
        }
    }

    redirect(e) {this.props.changeView({view:'msg_detail', param:e.target.dataset.url})}

    render() {
        let html = this.state.data.map(obj => 
            <div className='msg-platform-row' key={obj.id}>
                {
                    this.state.isDelete
                    &&
                    <div className='msg-platform-check'>
                        <OptionBox
                            type='checkbox'
                            checked={-1 !== obj.id.inArray(this.state.checked)}
                            value={obj.id}
                            onClick={this.handleClick}
                        ></OptionBox>
                    </div>
                }
                <div className='msg-platform-date' data-url={obj.url} onClick={this.redirect}>{tool.date('m/d', obj.time)}</div>
                <div className='msg-platform-info'>
                    <div>
                        <span data-url={obj.url} onClick={this.redirect}>{obj.title}</span>
                        <span>{tool.date('Y-m-d H:i:s', obj.time)}</span>
                        {0 == obj.state && <span></span>}
                    </div>
                    <div data-url={obj.url} onClick={this.redirect}>{obj.content}</div>
                </div>
            </div>
        );
        return (
            <div className='msg-platform'>
                <div className='msg-platform-top'>
                    <div>
                        {
                            this.state.isDelete
                            ?
                            <button type='button' className='e-btn confirm' onClick={this.handleDelete}>删除</button>
                            :
                            <button type='button' className='e-btn confirm' onClick={() => this.setState({isDelete:true})}>编辑</button>
                        }
                    </div>
                    <div>
                        {
                            this.state.isDelete
                            &&
                            <OptionBox
                                type='checkbox'
                                checked={this.state.checked.length == this.state.data.length && this.state.data.length}
                                onClick={this.handleAllChekced}
                            >全选</OptionBox>
                        }
                    </div>
                    <div>已选择<span style={{color:'red'}}>&nbsp;{this.state.checked.length}&nbsp;</span>件</div>
                </div>
                {html}
            </div>
        );
    }
}