/**
 * 图片上传弹窗组件
 * @author yangyunlong
 */
const {dialog} = window.require('electron').remote;
const fs = window.require('fs');
import React from 'react';
import './App.css';
//images=[]    onClose
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.chooseImage = this.chooseImage.bind(this);
    }

    chooseImage() {
        if (this.props.images.length > 11 && !this.props.infinite) return;
        dialog.showOpenDialog({
            filters: [{name: 'Images', extensions: ['jpg','png','jpeg','bmp','JPG','PNG','JPEG','BMP']}],
            properties: ['openFile']
        },(filePaths) => {
            if (filePaths instanceof Array && 'function' === typeof this.props.onChoose) {
                this.props.onChoose(filePaths[0], filePaths[0].filePathToBlob() );
            }
        });
    }

    render() {
        if (!this.props.show) return null;
        let images = this.props.images.map((obj, index) => 
            <div key={index} className='m-img-box'>
                <img src={obj}/>
                <i className='m-img-delete' onClick={() => this.props.onDelete(index)}></i>
            </div>
        );
        return (
            <div className='upload-toast'>
                <div>
                    上传照片
                    <span>&nbsp;&nbsp;{!this.props.infinite && '(最多不超过12张)'}</span>
                    <i className="fa fa-times" onClick={this.props.onClose}></i>
                </div>
                <div>
                    {images}
                    {this.props.images.length > 11 && !this.props.infinite ? null : (<div className='m-img-box upload' onClick={this.chooseImage}></div>)}
                </div>
            </div>
        );
    }
}