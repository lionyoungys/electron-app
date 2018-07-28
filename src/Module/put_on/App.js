/**
 * 上挂界面组件
 * @author yangyunlong
 */

import React from 'react';
import Search from '../UI/search/App';
import OptionBox from '../../Elem/OptionBox';        //新增
import ImageLightbox from '../../Elem/ImageLightbox';   //新增
import UploadToast from '../UI/upload-toast/App';    //新增
import './App.css';
const state = 91, word = '上挂';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.state = {value:'',data:[],checked:[],all:false, start:'', loading:null,uploadShow:false,lightboxShow:false,index:null};
        this.onSearch = this.onSearch.bind(this);
        this.handleAllChecked = this.handleAllChecked.bind(this);
        this.handleCleaned = this.handleCleaned.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.query = this.query.bind(this);
        this.goBack = this.goBack.bind(this);
        this.upload = this.upload.bind(this);
        this.delete = this.delete.bind(this);
        this.uploadShow = this.uploadShow.bind(this);
        this.lightboxShow = this.lightboxShow.bind(this);
    }

    componentDidMount() {this.query()}
    query() {
        axios.post(api.U('put_on'),api.D({token:this.props.token}))
        .then(response => {
            api.V(response.data) && this.setState({data:response.data.result,value:''});
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
                    if (this.state.data[index].assist == 1) return;
                    let index2 = this.state.data[index].id.inArray(this.state.checked);
                    if (-1 === index2) {
                        this.state.checked.push(this.state.data[index].id);
                        this.setState({checked:this.state.checked});
                    }
                } else {
                    alert(response.data.msg);
                }
                this.setState({value:''});
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
                if (data[i].assist == 0) checked.push(data[i].id);
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
        if (this.state.checked.length < 1) return;
        if ('' == this.state.start) return alert('请输入衣挂号');
        api.post(
            'put_it_on', 
            {
                token:this.props.token,
                itemids:this.state.checked.toString(),
                moduleid:state,
                startnum:this.state.start,
                endnum:this.state.start
            },
            (response, verify) => {
                if (verify) {
                    this.setState({checked:[],all:false});
                    this.query();
                } else {
                    alert(response.data.msg);
                }
            }
        )
    }
    goBack() {
        if (this.state.checked.length != 1) return alert('返流项目需选中单个项目返流');
        this.props.changeView({view:'go_back',param:{state:state,id:this.state.checked[0]}});
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
            <tr key={obj.id} className={obj.assist != 1 ? null : 'disabled'}>
                <td>
                    {
                        obj.assist != 1
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
                        <input type='text' className='put-on-input' value={this.state.start} onChange={e => this.setState({start:e.target.value})} placeholder='输入衣挂号'/>
                        &emsp;
                        <button type='button' className='e-btn confirm' onClick={this.handleCleaned}>已{word}</button>
                        &emsp;
                        <button type='button' className='e-btn confirm' onClick={this.goBack}>返流</button>
                    </div>
                    <div className='right'>
                        <Search 
                            scanner={true}
                            placeholder='请输入或扫描衣物编码'
                            value={this.state.value}
                            onChange={value => this.setState({value:value})}
                            autoFocus={true}
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
