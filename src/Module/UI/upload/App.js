/**
 * 项目上传组件
 * @author yangyunlong
 */
const {dialog} = window.require('electron').remote;
import React from 'react';
import './App.css';
//name id onUpload onUploadRequest(id,img) loading = true/false
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {image:''}
        this.chooseImage = this.chooseImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    deleteImage(e) {this.props.onDeleteRequest(this.props.id, e.target.dataset.url);}

    chooseImage() {
        if (this.props.img.length >= 12) return;
        dialog.showOpenDialog({
            filters: [{name: 'Images', extensions: ['jpg','png','jpeg','bmp','JPG','PNG','JPEG','BMP']}],
            properties: ['openFile']
        },(filePaths) => {
            if (filePaths instanceof Array) {
                this.setState({image:filePaths[0]});
                this.props.onUploadRequest(this.props.id, filePaths[0].filePathToBlob());
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
                    data-url={obj}
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
                    {this.props.loading ? (<div className='m-img-box'><img src={this.state.image}/><i className='m-loading'></i></div>) : null}
                    {this.props.img.length >= 12 ? null : (<div className='m-img-box upload' onClick={this.chooseImage}></div>)}
                    <div><div>(上传不得超过12张)</div></div>
                </div>
            </div>
         );
     }
 }