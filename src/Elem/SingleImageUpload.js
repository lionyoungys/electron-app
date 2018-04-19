/**
 * 单图片上传组件
 * @author yangyunlong
 */
import React from 'react';

//progress    src
export default class extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let type = typeof this.props.progress;
        return (
            <div className='e-img-box'>
                <img src={this.props.src}/>
                {
                   ('string' === type || 'number' === type)
                   &&
                   !isNaN(this.props.progress)
                   &&
                   this.props.progress < 100
                   &&
                   (
                       <div className='single-img-progress'>
                            <div>
                                <div><div style={{width:this.props.progress + '%'}}></div></div>
                                <div>{this.props.progress}%</div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}