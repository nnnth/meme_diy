import React from 'react'
import  './prepage.css'

function PrePage(props:any) {
    return (
        <header className="header">
            <div className="brand-box">
                <span className="brand">Meme Diy</span>
            </div>
            <div className="text-box">
                <h1 className="heading-primary">
                    <span className="heading-primary-main">表情包生成器</span>
                    <span className="heading-primary-sub">使用模板或自定义图片生成表情包 支持图片和动图</span>
                </h1>
                <a href="#" className="btn btn-white btn-animated" onClick={props.onClick}>Get Started</a>
            </div>
        </header>
    )
}
export default PrePage;