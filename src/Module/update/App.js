/**
 * 版本更新组件
 * @author yangyunlong
 */
const {dialog} = window.require('electron').remote;
const {ipcRenderer} = window.require('electron');
import React from 'react';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {downloadURL:'', hasUpdate:false, version:''};
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        api.post('software_update', {token:this.props.token, version:version}, (response, verify) => {
            verify && this.setState({
                downloadURL:response.data.download, 
                version:response.data.last_version,
                hasUpdate:(1 == response.data.has_upd),
            });
        });
    }

    handleUpdate() {
        dialog.showOpenDialog(
            {properties: ['openDirectory']},
            (path) => {
                if ('undefined' === typeof path) return;
                ipcRenderer.send('download', {url:this.state.downloadURL,floder:path[0]});
            }
        );
    }

    render() {
        return (
            <div className='update'>
                <div>{this.state.hasUpdate ? `发现新版本：${this.state.version}` : `当前版本号为${this.state.version}已经是最新版本`}</div>
                {
                    this.state.hasUpdate 
                    && 
                    <div><button type='button' className='e-btn confirm' onClick={this.handleUpdate}>下载最新安装包</button></div>
                }
            </div>
        );
    }
}