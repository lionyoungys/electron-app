/**
 * 上传照片组件
 * @author yangyunlong
 */

 import React from 'react';
 import Crumb from '../UI/crumb/App';
 import './App.css';

 export default class extends React.Component {
     constructor(props) {
         super(props);
     }

     render() {
         return (
             <div>
                <Crumb data={[{key:0,value:'待清洗',view:'online',param:{checked:'to_clean'}},{key:1,value:'上传照片'}]} callback={this.props.changeView}/>
                <div className='m-container'>
                    <div className='m-box'>section one</div>
                    <div className='m-box'>section two</div>
                </div>
             </div>
         );
     }
 }