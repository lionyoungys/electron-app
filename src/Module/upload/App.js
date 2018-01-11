/**
 * 上传照片组件
 * @author yangyunlong
 */
const {dialog} = window.require('electron').remote;
const fs = window.require('fs');
 import React from 'react';
 import Crumb from '../UI/crumb/App';
 import './App.css';

 export default class extends React.Component {
     constructor(props) {
         super(props);
         this.state = {data:[]}
     }

     componentDidMount() {
         axios.post(api.U('checkout'),api.D({oid:this.props.param.oid, token:this.props.token}))
         .then(response => {
             console.log(response.data);
             api.V(response.data) && this.setState({data:response.data.result});
         })
     }

     render() {
         let html = this.state.data.map(obj =>
            <Data key={obj.id} img={obj.item_images} name={obj.item_name}/>
        );
         return (
             <div>
                <Crumb data={[{key:0,value:'待清洗',view:'online',param:{checked:'to_clean'}},{key:1,value:'上传照片'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    {html}
                </div>
             </div>
         );
     }
 }

 class Data extends React.Component {
    constructor(props) {
        super(props);
        this.upload = this.upload.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
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

    upload() {
        dialog.showOpenDialog({
            filters: [{name: 'Images', extensions: ['jpg','png','jpeg','JPG','PNG','JPEG']}],
            properties: ['openFile']
        },(filePaths) => {
            if (tool.isSet(filePaths)) {
                let base64 = fs.readFileSync(filePaths[0]).toString('base64');
                axios.post(
                    api.U('upload'),
                    api.D(
                        {
                            token:this.props.token,
                            item_id:this.props.id,
                            image:base64.base64toBlob(filePaths[0].ext())
                        }
                    )
                )
                .then(response => {
                    let result = response.data;
                    if (api.verify(result)) {
                        this.state.images.push(result.data[0])
                        this.setState({images:this.state.images});
                    }
                });

            }
        });
    }

     render() {
        let images = this.props.img.map((obj) => 
            <div key={obj} className='m-img-box'>
                <img src={obj}/>
                <i 
                    className='m-img-delete' 
                    onClick={this.deleteImage}
                    data-path={obj}
                ></i>
            </div>
        );
         return (
            <div className='upload'>
                <div>
                    <span>{this.props.name}</span>
                    <span>数量:&times;1</span>
                </div>
                <div>
                    <div className='m-img-box'>上传照片:</div>
                    {images}
                    <div className='m-img-box m-img-upload' onClick={this.upload}></div>
                    <div className='m-img-text'>
                        <div className='m-img-text-bottom'>(上传不得超过11张)</div>
                    </div>
                </div>
            </div>
         );
     }
 }