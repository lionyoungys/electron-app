/**
 * 衣物检查
 * @author yangyunlong
 */
const {dialog} = window.require('electron').remote;
const fs = window.require('fs');
import React, {Component} from 'react';
import '../api';
export default class Check extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
        //orderId = 订单id from = offline / online changeView = props.changeView
        console.log(this.props);
        this.takePay = this.takePay.bind(this);    //取衣付款
        this.pay = this.pay.bind(this);    //立即付款
        this.onlineHandle = this.onlineHandle.bind(this);
    }
    componentDidMount() {
        let props = this.props;
        axios.post(api.U('check'),api.data({token:props.token,id:props.orderId}))
        .then((response) => {
            let result = response.data.data;
            this.setState({data:result});
            console.log(result);
        });
    }

    takePay() {
        let props = this.props;
        if (!props.callback()) return;
        axios.post(api.U('takePay'),api.data({token:props.token,order_id:props.orderId}))
        .then((response) => {
            if (api.verify(response.data)) {
                props.changeView({element:'index'});
            }
        });
    }

    pay() {
        if (!this.props.callback()) return;
        let verify = true;
        this.state.data.map(obj => {
            let colorVerify = '' == obj.color && '' == obj.color_text;
            let questionVerify = '' == obj.item_note && '' == obj.note_text;
            if (colorVerify || questionVerify || 0 == obj.img.length) {
                verify = false;
            }
        });
        if (!verify) return;
        this.props.changeView({element:'pay', param:'id=' + this.props.orderId + '&from=offline'});
    }

    onlineHandle() {
        if (!this.props.callback()) return;
        let verify = true;
        this.state.data.map(obj => {
            let colorVerify = '' == obj.color && '' == obj.color_text;
            let questionVerify = '' == obj.item_note && '' == obj.note_text;
            if (colorVerify || questionVerify || 0 == obj.img.length) {
                verify = false;
            }
        });
        if (!verify) return;
        axios.post(api.U('gotIt'),api.data({token:this.props.token,id:this.props.orderId}))
        .then((response) => {
            console.log(response.data);
            if (api.verify(response.data)) {
                this.props.changeView({element:'order',param:'choose=1'})
            }
        });
    }

    render() {
        let props = this.props,
            state = this.state,
            html = state.data.map((obj) => 
                <Item 
                    key={obj.id}
                    changeView={props.changeView}
                    id={obj.id}
                    name={obj.g_name}
                    number={obj.number}
                    color={obj.color}
                    color_text={obj.color_text}
                    question={obj.item_note}
                    question_text={obj.note_text}
                    assess={obj.assess}
                    assess_text={obj.assess_text}
                    from={props.from}
                    images={obj.img}
                    orderId={props.orderId}
                    token={props.token}
                />
            ),
            btns = <div className='ui-container'>
                    <input 
                        type='button' 
                        value='确认收件' 
                        className='ui-btn ui-btn-confirm ui-btn-large'
                        onClick={this.onlineHandle}
                        data-param='choose=2'
                        data-e='order'
                    />
                   </div>;
        if ('undefined' !== typeof props.from && 'offline' == props.from) {
            btns = <div className='ui-container'>
                   <input 
                       type='button' 
                       value='取衣付款' 
                       className='ui-btn ui-btn-confirm ui-btn-large'
                       onClick={this.takePay}
                   />&emsp;&emsp;
                   <input 
                       type='button' 
                       value='立即付款' 
                       className='ui-btn ui-btn-confirm ui-btn-large'
                       onClick={this.pay}
                   />
                   </div>
        }
        return (
            <div>
                {html}
                {btns}
            </div>
        );
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {images:this.props.images};
        this.deleteImage = this.deleteImage.bind(this);    //删除图片
        this.addImage = this.addImage.bind(this);    //添加图片
        this.color = this.color.bind(this);    //颜色设置跳转
        this.question = this.question.bind(this);    //问题描述跳转
        this.assess = this.assess.bind(this);
    }

    deleteImage(e) {
        let props = this.props,
            path = e.target.dataset.path;
        axios.post(api.U('deleteImage'),api.data({token:props.token,image:path,orderid:props.orderId,id:props.id}))
        .then((response) => {
            let result = response.data;
            if (api.verify(result)) {
                let index = path.inArray(this.state.images);
                if (-1 !== index) {
                    this.state.images.splice(index,1);
                    this.setState({images:this.state.images});
                }
            }
        });
    }

    addImage() {
        let props = this.props;
        dialog.showOpenDialog({
            filters: [{name: 'Images', extensions: ['jpg','png','jpeg','JPG','PNG','JPEG']}],
            properties: ['openFile']
        },(filePaths) => {
            if ('undefined' !== typeof filePaths) {
                let imgData = fs.readFileSync(filePaths[0]).toString('base64');
                axios.post(
                    api.U('checkImageUpload'),
                    api.data({
                        token:props.token,
                        orderid:props.orderId,
                        id:props.id,
                        file:{
                            data:imgData.base64toBlob(),
                            name:filePaths[0]
                        }
                    })
                )
                .then((response) => {
                    let result = response.data;
                    if (api.verify(result)) {
                        this.state.images.push(result.data[0])
                        this.setState({images:this.state.images});
                    }
                });

            }
        });
    }

    color() {
        let props = this.props;
        props.changeView({
            element:'color',
            param:'orderId='+props.orderId+'&id='+props.id+'&color='+props.color+'&from='+props.from+'&color_text='+props.color_text
        });
    }

    question() {
        let props = this.props;
        props.changeView({
            element:'question',
            param:'orderId='+props.orderId+'&id='+props.id+'&question='+props.question+'&from='+props.from+'&question_text='+props.question_text
        });
    }

    assess() {
        let props = this.props;
        props.changeView({
            element:'after',
            param:'orderId='+props.orderId+'&id='+props.id+'&assess='+props.assess+'&from='+props.from+'&assess_text='+props.assess_text
        });
    }
    render() {
        let props = this.props,
            state = this.state,
            colorValue = '' == props.color ? '颜色设置' : '编辑',
            questionValue = '' == props.question ? '问题描述' : '编辑',
            assessValue = '' == props.assess ? '洗后预估' : '编辑',
            addNode = state.images.length >= 11 ? null : <div className='ui-image ui-image-add' onClick={this.addImage}></div>,
            images = state.images.map((obj) => 
                <div key={obj} className='ui-image' style={{backgroundImage:'url('+  api.host + obj +')'}}>
                    <em 
                        className='ui-image-delete' 
                        onClick={this.deleteImage}
                        data-path={obj}
                    ></em>
                </div>
            );

        return (
            <div className='ui-container'>
                <div className='ui-box-between ui-fieldset ui-check-title'>
                    <div>{props.name}</div><div>数量：&times;{props.number}</div>
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-image'>上传照片:</div>
                    {images}
                    {addNode}
                    <div className='ui-image-text'>
                        <div className='ui-image-text-bottom'>(上传不得超过11张)</div>
                    </div>
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-check-word'>颜色:</div>
                    <div className='ui-check-container'>{props.color + ' ' + props.color_text}</div>
                    <input
                        type='button'
                        value={colorValue}
                        className='ui-btn ui-btn-editor'
                        onClick={this.color}
                    />
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-check-word'>问题描述:</div>
                    <div className='ui-check-container'>{props.question + ' ' + props.question_text}</div>
                    <input
                        type='button'
                        value={questionValue}
                        className='ui-btn ui-btn-editor'
                        onClick={this.question}
                    />
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-check-word'>洗后预估:</div>
                    <div className='ui-check-container'>{props.assess + ' ' + props.assess_text}</div>
                    <input
                        type='button'
                        value={assessValue}
                        className='ui-btn ui-btn-editor'
                        onClick={this.assess}
                    />
                </div>
            </div>
        );
    }
}
