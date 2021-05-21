import React from 'react'
import { Input } from 'antd';

function GifText(props:any){
    return (
        <div>
             { props.config.map((sentence: any, index: number) =>
                    <div className="field" key={index}>
                        <div className="control">
                            <label className="label">第 {index + 1} 句：</label>
                            <Input className="input is-info sentence" type="text" placeholder={sentence.default} />
                        </div>
                    </div>)}
        </div>
    );
}
export default GifText;