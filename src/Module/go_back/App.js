/**
 * 返流界面组件
 * @author yangyunlong
 */

const {dialog} = window.require('electron').remote;
import React from 'react';
import Radio from '../UI/radio/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.props.onRef(this);
        this.id = this.props.param.id;
        this.from = this.props.param.state;
        this.state = {data:{back_img:[]},module:[],text:'',index:0,normal:1};
        this.crumb = [{key:1,value:'返流'}];
        if (50 == this.from) {
            this.crumb.unshift({key:0,value:'烘干',view:'dry'});
        } else if (51 == this.from) {
            this.crumb.unshift({key:0,value:'熨烫',view:'ironing'});
        } else if (52 == this.from) {
            this.crumb.unshift({key:0,value:'质检',view:'check'});
        }
        this.upload = this.upload.bind(this);
        this.del = this.del.bind(this);
        this.submit = this.submit.bind(this);
        this.query = this.query.bind(this);
    }
    componentDidMount() {
        this.query();
    }
    query() {
        axios.post(api.U('go_back'), api.D({token:this.props.token,itemid:this.props.param.id}))
        .then(response => {
            console.log(response.data);
            api.V(response.data) && this.setState({data:response.data.result.data,module:response.data.result.module});
        });
    }

    upload() {
        if (this.state.data.back_img.length > 2) return;
        dialog.showOpenDialog({
            filters: [{name: 'Images', extensions: ['jpg','png','jpeg','bmp','JPG','PNG','JPEG','BMP']}],
            properties: ['openFile']
        },(filePaths) => {
            if (filePaths instanceof Array) {
                api.post(
                    'go_back_upload',
                    {
                        token:this.props.token,
                        itemid:this.props.param.id,
                        image:filePaths[0].filePathToBlob()
                    },
                    (response, verify) => {
                        if (verify) {
                            this.state.data.back_img.push(response.data.result);
                            this.setState({data:this.state.data});
                        }
                    }
                );
            }
        });
    }
    del(e) {
        let url = e.target.dataset.url;
        axios.post(api.U('go_back_delete'), api.D({token:this.props.token,url:url}))
        .then(response => {
            if (api.V(response.data)) {
                this.state.data.back_img.splice(url.inArray(this.state.data.back_img), 1);
                this.setState({data:this.state.data});
            }
        });
    }
    submit() {
        if (this.state.data.back_img.length < 1) return alert('请上传图片');
        if ('' == this.state.text) return alert('请填写文字描述');
        axios.post(
            api.U('go_back'),
            api.D({
                token:this.props.token,
                itemid:this.props.param.id,
                back_content:this.state.text,
                is_back:this.state.normal,
                back_state:this.state.module[this.state.index].module
            })
        ).then(response => {
            console.log(response.data);
            api.V(response.data) && this.props.changeView({view:this.crumb[0].view});
        });
    }
    render() {
        let data = this.state.data,
            step = this.state.module.map( (obj, index) =>
                <Radio
                    key={obj.module}
                    checked={index == this.state.index}
                    onClick={() => this.setState({index:index})}
                >{obj.module_name}&emsp;</Radio>
            ),
            images = data.back_img.map(obj =>
                <div key={obj} className='m-img-box'>
                    <img src={obj}/>
                    <i 
                        className='m-img-delete'
                        onClick={this.del}
                        data-url={obj}
                    ></i>
                </div>
            );
    
        return (
            <div>
                <div className='m-container'>
                    <div className='go-back-title'><span>{data.item_name}</span><span>衣物编码:{data.clean_sn}</span></div>
                    <div className='go-back-box'>
                        <span>上传照片：</span>
                        {images}
                        {data.back_img.length > 2 ? null : (<div className='m-img-box upload' onClick={this.upload}></div>)}
                    </div>
                    <div className='go-back-box'>
                        <span>文字描述：</span>
                        <div className='textarea'>
                            <textarea
                                value={this.state.text}
                                onChange={e => e.target.value.length < 21 && this.setState({text:e.target.value})}
                            ></textarea>
                            <i className='m-counter'>{this.state.text.length}/20</i>
                        </div>
                    </div>
                    <div className='go-back-box'>
                        <span>是否正常返流：</span>
                        <Radio checked={1 == this.state.normal} onClick={() => this.setState({normal:1})}>是&emsp;</Radio>
                        <Radio checked={2 == this.state.normal} onClick={() => this.setState({normal:2})}>否&emsp;</Radio>
                    </div>
                    <div className='go-back-box'>
                        <span>返流步骤：</span>{step}
                    </div>
                    <div>
                        <button className='m-btn confirm middle' type='button' data-view={this.crumb[0].view} onClick={this.props.changeView}>取消</button>
                        &emsp;
                        <button className='m-btn confirm middle' type='button' onClick={this.submit}>确认</button>
                    </div>
                </div>
            </div>
        );
    }
}