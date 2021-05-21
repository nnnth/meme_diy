import React from 'react'
import { TwitterPicker } from 'react-color'
import { DeleteOutlined } from '@ant-design/icons';


import { Input, Button } from 'antd';
const fontoptions = ["Arial", "Helvetica", "Impact", "Arial Black", "Times New Roman", "Trebuchet MS", "Comic SansMS", "Andale Mono"];

function Custom(props:any){

    return (
        <div className="single-input">
        <div className="input-wrap">
          <Input key={props.item.id} style={{ marginTop: 8 }} type="text" id={props.index.toString()} onChange={props.textChange} />
          {!props.isgif?<Button id={props.index.toString()} style={{ marginTop: 8 }} type="dashed" icon={<DeleteOutlined />} onClick={props.deleteinput}>
          </Button>:""}
        </div>
        <div className="font-select">
          <label style={{ textAlign: "center" }}>字体</label>
          <select id={props.index.toString()} defaultValue="Arial" onChange={props.onFontChange}>
            {fontoptions.map((item, index) => <option key={index} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="font-color">
          <label>颜色</label>
          <button style={{ width: "30px", background: props.item.color, border: "none", margin: 0 }} key={props.item.id} id={props.index.toString()} onClick={props.changevis} className="color-select"></button>
          {props.item.show ? <div style={{ zIndex: 2, position: "fixed" }}><TwitterPicker onChange={props.onColorChange} /></div> : ""}

        </div>
        <div className="font-size">
          <label>字体大小</label>
          <Input key={props.item.id} id={props.index.toString()} type="range" className="slider" max="100" min="1" value={props.item.size} onChange={props.onFontSizeChange} />
        </div>

      </div>
    );
}
export default Custom;