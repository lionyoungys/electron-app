/**
 * 送洗界面组件
 * @author yangyunlong
 */

import React from 'react';
import Crumb from '../UI/crumb/App';
import Search from '../UI/search/App';
import Checkbox from '../UI/checkbox/App';
import UploadList from '../UI/upload-list/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value:'',data:[],checked:[],all:false,team:[],show:false,teamId:null,loading:null};
        this.onSearch = this.onSearch.bind(this);
        this.handleAllChecked = this.handleAllChecked.bind(this);
        this.handleCleaned = this.handleCleaned.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.handleGoback = this.handleGoback.bind(this);
        this.query = this.query.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.upload = this.upload.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.query();
        axios.post(api.U('team_merchant'),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({team:response.data.result});
        });
    }
    query() {
        axios.post(api.U('clean'),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result,value:'',show:false});
            console.log(response.data);
        });
    }
    onSearch() {
        axios.post(api.U('operate_search'),api.D({token:this.props.token,status:3,clean_sn:this.state.value}))
        .then(response => {
            if (api.V(response.data)) {
                this.query();
            } else {
                let index = this.state.value.inObjectArray(this.state.data, 'clean_sn');
                if (-1 != index) {
                    if (this.state.data[index].assist == 1 || this.state.data[index].clean_state == 1) return;
                    let index2 = this.state.data[index].id.inArray(this.state.checked);
                    if (-1 === index2) {
                        this.state.checked.push(this.state.data[index].id);
                        this.setState({checked:this.state.checked,value:''});
                    }
                }
            }
        });
    }

    handleAllChecked(value, checked) {
        if (checked) {
            this.setState({checked:[],all:false});
        } else {
            let data = this.state.data,
                len = data.length,
                checked = [];
            for (let i = 0;i < len;++i) {
                if (data[i].assist == 0 && data[i].clean_state == 0) checked.push(data[i].id);
            }
            this.setState({checked:checked,all:true});
        }
    }
    handleChecked(value,checked) {
        if (checked) {
            let index = value.inArray(this.state.checked);
            if (-1 !== index) {
                this.state.checked.splice(index, 1);
                this.setState({checked:this.state.checked,all:false});
            }
        } else {
            this.state.checked.push(value);
            this.setState({checked:this.state.checked});
        }
    }
    handleCleaned() {
        //item_cleaned
        if (this.state.checked.length < 1) return;
        axios.post(api.U('item_cleaned'),api.D({token:this.props.token,itemids:this.state.checked.toString(),moduleid:3}))
        .then(response => {
            if (api.V(response.data)) {
                this.setState({checked:[],all:false});
                this.query();
            } else {
                alert(response.data.msg);
            }
        });
    }
    handleGoback() {

    }
    onConfirm() {
        if (null === this.state.teamId || this.state.checked.length < 1) return;
        axios.post(
            api.U('into_factory'),
            api.D({token:this.props.token,itemids:this.state.checked.toString(),moduleid:20,targetmid:this.state.teamId})
        )
        .then(response => {
            if (api.V(response.data)) {
                this.setState({checked:[],all:false});
                this.query();
            } else {
                alert(response.data.msg);
            }
        });
    }

    upload(id, image) {
        this.setState({loading:id});
        axios.post(api.U('item_upload'),api.D({token:this.props.token,item_id:id,image:image}))
        .then(response => {
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.data, 'id');
                this.state.data[index].image.push(response.data.result)
                this.setState({data:this.state.data,loading:false});
            }
        });
    }

    delete(id, url) {
        axios.post(api.U('unload'),api.D({token:this.props.token,item_id:id,url:url}))
        .then(response => {
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.data, 'id'),
                    index2 = url.inArray(this.state.data);
                this.state.data[index].image.splice(index2, 1);
                this.setState({data:this.state.data});
            }
        })
    }
    render() {

        let html = this.state.data.map(obj => 
            <UploadList
                key={obj.id}
                id={obj.id}
                name={obj.item_name}
                img={obj.image}
                sn={obj.clean_sn}
                hasChecked={!(obj.assist == 1 || obj.clean_state == 1)}
                forecast={obj.forecast}
                problem={obj.problem}
                checked={-1 !== obj.id.inArray(this.state.checked)}
                onClick={this.handleChecked}
                loading={obj.id === this.state.loading}
                onUploadRequest={this.upload}
                onDeleteRequest={this.delete}
            />
        );
        return (
            <div>
                <Crumb data={[{key:0,value:'清洗'}]} callback={this.props.changeView} token={this.props.token} param={{moduleid:3}}/>
                <div className='m-container'>
                    <div className='clean-box'>
                        <Search 
                            placeholder='请输入或扫描衣物编码'
                            value={this.state.value}
                            onChange={value => this.setState({value:value})}
                            callback={this.onSearch}
                        />
                        <div>
                            已选择<span className='m-red'>{this.state.checked.length}</span>件
                            &emsp;
                            <Checkbox checked={this.state.all} onClick={this.handleAllChecked}>全选</Checkbox>
                            &emsp;
                            <button type='button' className='m-btn confirm middle' onClick={this.handleGoback}>退回门店</button>
                            &emsp;
                            <span style={{position:'relative'}}>
                                <button type='button' className='m-btn confirm middle' onClick={() => this.setState({show:true})}>入厂</button>
                                <Team
                                    show={this.state.show}
                                    onClose={() => this.setState({show:false})}
                                    onConfirm={this.onConfirm}
                                    data={this.state.team}
                                    checked={this.state.teamId}
                                    onChecked={value => this.setState({teamId:value})}
                                />
                            </span>
                            &emsp;
                            <button type='button' className='m-btn confirm middle' onClick={this.handleCleaned}>已清洗</button>
                        </div>
                    </div>
                    <div className='m-box'>{html}</div>
                    {/* <div className='m-box'>
                        <table className='m-table tr-b m-text-c'>
                            <thead><tr className='m-bg-white'><th>衣物编码</th><th>名称</th></tr></thead>
                            <tbody>{html}</tbody>
                        </table>
                    </div> */}
                </div>
            </div>
        );
    }
}

class Team extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.show) return null;
        let html = this.props.data.map(obj =>
            <div
                key={obj.accept_id}
                className={this.props.checked == obj.accept_id ? 'checked' : null}
                onClick={() => this.props.onChecked(obj.accept_id)}
            >{obj.mname}</div>
        );
        return (
            <div className='clean-team'>
                <div>请选择合作商家</div>
                <div>{html}</div>
                <div>
                    <button type='button' className='m-btn cancel' onClick={this.props.onClose}>取消</button>
                    &emsp;&emsp;
                    <button type='button' className='m-btn confirm' onClick={this.props.onConfirm}>确认</button>
                </div>
            </div>
        );
    }
}