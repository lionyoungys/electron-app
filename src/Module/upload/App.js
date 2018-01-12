/**
 * 上传照片组件
 * @author yangyunlong
 */
import React from 'react';
import Crumb from '../UI/crumb/App';
import Upload from '../Ui/upload/App';
import './App.css';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[], loading:null}
        this.upload = this.upload.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        axios.post(api.U('checkout'),api.D({oid:this.props.param.oid, token:this.props.token}))
        .then(response => {
            console.log(response.data);
            api.V(response.data) && this.setState({data:response.data.result});
        })
    }

    upload(id, image) {
        this.setState({loading:id});
        axios.post(api.U('upload'),api.D({token:this.props.token,item_id:id,image:image}))
        .then(response => {
            if (api.V(response.data)) {
                let index = id.inObjectArray(this.state.data, 'id');
                this.state.data[index].item_images.push(response.data.result)
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
                this.state.data[index].item_images.splice(index2, 1);
                this.setState({data:this.state.data});
            }
        })
    }

    render() {
        let html = this.state.data.map(obj =>
            <Upload 
                key={obj.id} 
                id={obj.id} 
                img={obj.item_images} 
                name={obj.item_name}
                onUploadRequest={this.upload}
                onDeleteRequest={this.delete}
                loading={obj.id === this.state.loading}
            />
        );
        return (
            <div>
            <Crumb data={[{key:0,value:'待清洗',view:'online',param:{checked:'to_clean'}},{key:1,value:'上传照片'}]} callback={this.props.changeView}/>
            <div className='m-container'>{html}</div>
            </div>
        );
    }
}
