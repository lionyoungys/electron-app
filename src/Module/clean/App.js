/**
 * 送洗界面组件
 * @author yangyunlong
 */

import React from 'react';
import Search from '../UI/search/App';
import OptionBox from '../../Elem/OptionBox';        //新增
import ImageLightbox from '../../Elem/ImageLightbox';   //新增
import UploadToast from '../UI/upload-toast/App';    //新增
import './App.css';
const state = 3, word = '清洗';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.state = {
            value:'',
            data:[],
            checked:[],
            all:false,
            team:[],
            show:false,
            teamId:null,
            loading:null,
            //新增state属性
            uploadShow:false,
            lightboxShow:false,
            index:null
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleAllChecked = this.handleAllChecked.bind(this);
        this.handleCleaned = this.handleCleaned.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.query = this.query.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.upload = this.upload.bind(this);
        this.delete = this.delete.bind(this);
        //新增
        this.uploadShow = this.uploadShow.bind(this);
        this.lightboxShow = this.lightboxShow.bind(this);
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
        axios.post(api.U('operate_search'),api.D({token:this.props.token,status:state,clean_sn:this.state.value}))
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
                        this.setState({checked:this.state.checked, value:''});
                    }
                } else {
                    this.setState({value:''});
                    alert(response.data.msg);
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
        axios.post(api.U('item_cleaned'),api.D({token:this.props.token,itemids:this.state.checked.toString(),moduleid:state}))
        .then(response => {
            if (api.V(response.data)) {
                this.setState({checked:[],all:false});
                this.query();
            } else {
                alert(response.data.msg);
            }
        });
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

    upload(base64, image) {
        let index = this.state.index;
        api.post(
            'item_upload', 
            {token:this.props.token,item_id:this.state.data[index].id,image:image},
            (response, verify) => {
                if (verify) {
                    if (tool.isSet(this.state.data[index].tempImages)) {
                        this.state.data[index].tempImages.push(response.data.result);
                    } else {
                        this.state.data[index].tempImages = [response.data.result];
                    }
                    this.state.data[index].image.push(response.data.result);
                    this.setState({data:this.state.data});
                }
            }
        )
    }

    delete(urlIndex) {
        let index = this.state.index,
            url = this.state.data[index].tempImages[index];
        api.post(
            'unload', 
            {token:this.props.token,item_id:this.state.data[index].id,url:url},
            (response, verify) => {
                if (verify) {
                    let realIndex = url.inArray(this.state.data[index].tempImages),
                        realIndex2 = url.inArray(this.state.data[index].image);
                    -1 !== realIndex && this.state.data[index].tempImages.splice(realIndex, 1);
                    -1 !== realIndex2 && this.state.data[index].image.splice(realIndex2, 1);
                    this.setState({data:this.state.data});
                }
            }
        );
    }
    //新增方法
    uploadShow(e) {
        this.setState({uploadShow:true, index:e.target.dataset.index});
    }
    lightboxShow(e) {
        this.setState({lightboxShow:true, index:e.target.dataset.index});
    }

    render() {
        let html = this.state.data.map( (obj, index) =>
            <tr key={obj.id} className={!(obj.assist == 1 || obj.clean_state == 1) ? null : 'disabled'}>
                <td>
                    {
                        !(obj.assist == 1 || obj.clean_state == 1)
                        ?
                        <OptionBox
                            type='checkbox'
                            checked={-1 !== obj.id.inArray(this.state.checked)}
                            value={obj.id}
                            onClick={this.handleChecked}
                        >{obj.clean_sn}</OptionBox>
                        :
                        obj.clean_sn
                    }
                </td>
                <td>{obj.item_name}</td>
                <td>{obj.problem}</td>
                <td>{obj.forecast}</td>
                <td>
                    <span className='e-orange e-pointer' data-index={index} onClick={this.lightboxShow}>{obj.image.length}张</span>
                    &emsp;
                    <button type='button' className='e-btn editor small' data-index={index} onClick={this.uploadShow}>上传图片</button>
                </td>
            </tr>
        );
        return (
            <div className='clean'>
                <div className='clean-top'>
                    <div className='left'>
                        <OptionBox type='checkbox' checked={this.state.all} onClick={this.handleAllChecked}>全选</OptionBox>
                        &emsp;&emsp;
                        已选择<span className='e-orange'>&nbsp;{this.state.checked.length}&nbsp;</span>件
                        &emsp;&nbsp;
                        <button type='button' className='e-btn confirm' onClick={this.handleCleaned}>已{word}</button>
                        &emsp;
                        <span style={{position:'relative'}}>
                            <button type='button' className='e-btn confirm' onClick={() => this.setState({show:true})}>入厂</button>
                            <Team
                                show={this.state.show}
                                onClose={() => this.setState({show:false})}
                                onConfirm={this.onConfirm}
                                data={this.state.team}
                                checked={this.state.teamId}
                                onChecked={value => this.setState({teamId:value})}
                            />
                        </span>
                    </div>
                    <div className='right'>
                        <Search 
                            placeholder='请输入或扫描衣物编码'
                            value={this.state.value}
                            onChange={value => this.setState({value:value})}
                            callback={this.onSearch}
                        />
                    </div>
                </div>
                <div className='e-box'>
                    <table className='e-table border'>
                        <thead><tr><th>衣物编码</th><th>名称</th><th>瑕疵</th><th>洗后预估</th><th>上传图片</th></tr></thead>
                        <tbody>{html}</tbody>
                    </table>
                </div>
                <UploadToast
                    show={this.state.uploadShow}
                    images={
                        null !== this.state.index && tool.isSet(this.state.data[this.state.index].tempImages) 
                        ? 
                        this.state.data[this.state.index].tempImages : []
                    }
                    infinite={true}
                    onDelete={this.delete}
                    onChoose={this.upload}
                    onClose={() => this.setState({uploadShow:false})}
                />
                <ImageLightbox
                    show={this.state.lightboxShow}
                    images={
                        null !== this.state.index && tool.isSet(this.state.data[this.state.index].image)
                        ? 
                        this.state.data[this.state.index].image : []
                    }
                    onClose={() => this.setState({lightboxShow:false})}
                />
            </div>
        );
    }
}

class Team extends React.Component {
    constructor(props) {super(props)}

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
                    <button type='button' className='e-btn cancel' onClick={this.props.onClose}>取消</button>
                    &emsp;&emsp;
                    <button type='button' className='e-btn confirm' onClick={this.props.onConfirm}>确认</button>
                </div>
            </div>
        );
    }
}