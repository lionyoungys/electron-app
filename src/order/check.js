/**
 * 衣物检查
 * @author yangyunlong
 */
const {dialog} = window.require('electron').remote;
const fs = window.require('fs');
import React, {Component} from 'react';
import '../static/api';
import Crumbs from '../static/UI';
class Check extends Component {
    constructor(props) {
        super(props);
        this.state = {data:[]};
        this.params = this.props.param.paramToObject();    //参数列表
        this.id = this.params.id;    //订单ID
        console.log(this.props);
        this.crumbs = [{text:'订单处理',key:0,e:'order',param:'choose=2'},{text:'衣物检查',key:1}];
        if ('undefined' !== typeof this.params.from && 'offline' == this.params.from) {
            this.crumbs = [
                {text:'收衣',key:0,e:'take'},
                {text:'添加项目',key:1,e:'item',param:this.props.param},
                {text:'工艺加价',key:2,e:'offline_craft',param:this.props.param},
                {text:'衣物检查',key:3}
            ];
        }
        this.takePay = this.takePay.bind(this);    //取衣付款
        this.pay = this.pay.bind(this);    //立即付款
    }
    componentDidMount() {
        axios.post(api.U('check'),api.data({token:this.props.token,id:this.id}))
        .then((response) => {
            let result = response.data.data;
            this.setState({data:result});
            console.log(result);
        });
    }

    takePay() {
        let props = this.props;
        axios.post(api.U('takePay'),api.data({token:props.token,order_id:this.id}))
        .then((response) => {
            if (api.verify(response.data)) {
                props.changeView({element:'index'});
            }
        });
    }

    pay() {this.props.changeView({element:'pay',param:this.props.param});}

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
                    from={this.params.from}
                    images={obj.img}
                    orderId={this.id}
                    token={props.token}
                />
            ),
            btns = <div className='ui-container'>
                    <input 
                        type='button' 
                        value='确认' 
                        className='ui-btn ui-btn-confirm ui-btn-large'
                        onClick={props.changeView}
                        data-param='choose=2'
                        data-e='order'
                    />
                   </div>;
        if ('undefined' !== typeof this.params.from && 'offline' == this.params.from) {
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
                <Crumbs  crumbs={this.crumbs} callback={props.changeView}/>
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
                    <input type='button' value={colorValue} className='ui-check-btn' onClick={this.color}/>
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-check-word'>问题描述:</div>
                    <div className='ui-check-container'>{props.question + ' ' + props.question_text}</div>
                    <input type='button' value={questionValue} className='ui-check-btn' onClick={this.question}/>
                </div>
                <div className='ui-content' style={{flexWrap:'wrap'}}>
                    <div className='ui-check-word'>洗后预估:</div>
                    <div className='ui-check-container'>{props.assess + ' ' + props.assess_text}</div>
                    <input type='button' value={assessValue} className='ui-check-btn' onClick={this.assess}/>
                </div>
            </div>
        );
    }
}

export default Check;