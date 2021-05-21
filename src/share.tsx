import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRcode from "qrcode.react"
import {Button} from 'antd'
import { QqOutlined,WechatOutlined } from '@ant-design/icons';
import request from './helper'
const serverurl = "http://1.15.40.237:5005"

// Initialize a variables.
let image = (document.images[0] || 0).src || '';
let site = getMetaContentByName('site') || getMetaContentByName('Site') || document.title;
let title = getMetaContentByName('title') || getMetaContentByName('Title') || document.title;
let description = getMetaContentByName('description') || getMetaContentByName('Description') || '';
let url = window.location.href
let origin = window.location.origin
function getMetaContentByName(name:string) {
  return ((document.getElementsByName(name)[0] || 0)as HTMLMetaElement).content;
}
function Share(props:any) {
  const qqshare = ()=>{
    var imgbase64 = props.downloadimg();
       fetch('/users/',{ //请求的服务器地址
           body: JSON.stringify({
            imageData: imgbase64,
            type:"share"
          }),  //请求的数据
           // body:{name:"mumu",age:20}, //第二种请求数据的方法json
           method:"POST", //请求方法
           headers:{  //请求头信息
              //  'Content-Type':'application/x-www-form-urlencoded' //用url编码形式处理数据
               'Content-Type':'application/json' //第二种请求头编写方式json
           }
       })
       .then(res=>res.text()) //请求得到的数据转换为text
       .then(res=>{
            var shareurl = "http://connect.qq.com/widget/shareqq/index.html?url="+window.location.href+"&pics="+serverurl+res+"&title="+title+"&source=me&desc=mem";
            window.open(shareurl,'_blank');
       })
       .catch(err=>{    //错误打印
           console.log(err)
       })

  }
  const qzoneshare = ()=>{

  }
 const weiboshare = ()=>{

 }
 const weixinshare = ()=>{

 }
  
    const templates = {
      "qzone": `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${title}&desc=${description}&summary=&site=`,
      "qq": `http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}&source=&desc=${description}`,
      "tencent": `http://share.v.t.qq.com/index.php?c=share&a=index&title=${title}&url=${url}&pic=${image}`,
      "weibo": `http://service.weibo.com/share/share.php?url=${url}&title=${title}&pic=${image}`,
      "wechat": decodeURIComponent(url),
      "douban": `http://shuo.douban.com/!service/share?href=${url}&name=${title}&text=${description}&image=${image}&starid=0&aid=0&style=11`,
      "diandian": `http://www.diandian.com/share?lo=${url}&ti=${title}&type=link`,
      "linkedin": `http://www.linkedin.com/shareArticle?mini=true&ro=true&title=${title}&url=${url}&summary=&source=&armin=armin`,
      "facebook": `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "twitter": `https://twitter.com/intent/tweet?text=${title}&url=${url}&via=${origin}`,
      "google": `https://plus.google.com/share?url=${url}`
    };
    return (
      <div className="social-share">
        <Button style={{border:"none"}}icon={<img src="icons/QQ.svg" alt="qq" width="30" height="30"/>} onClick={qqshare}></Button>
        <Button style={{border:"none"}} icon={<img src="icons/qzone.png" alt="qzone" width="22" height="22"/>}></Button>
        <Button style={{border:"none"}} icon={<img src="icons/Weibo.svg" alt="weibo" width="30" height="30"/>}></Button>
        <Button style={{border:"none"}} icon={<WechatOutlined/>}></Button>
                {/* <a key={site} className={`social-share-icon icon-${site}`} target='_blank' href={templates[1]}></a> */}
            
              {/* <a key={site} className={`social-share-icon icon-${site}`} target='_blank' href='javascript:;'>
                <div className="wechat-qrcode">
                  <h4>微信扫一扫：分享</h4>
                  <QRcode value={templates[site]} size={wechatQrcodeSize} level={wechatQrcodeLevel}/>
                </div>  
              </a> */}
           
      </div>
    )
}

export default Share;