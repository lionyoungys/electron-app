/**
 * 空数据组件
 * @author yangyunlong
 */
import React from 'react';

//children:标题内容    onClose()|关闭事件
export default class extends React.Component {
    constructor(props) {super(props)}

    render() {
        if (!this.props.show) return null;
        return (
            <div className='empty'>没有找到符合条件的数据</div>
        );
    }
}