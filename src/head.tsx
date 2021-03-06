import React, { useState } from "react"
import {Avatar} from 'antd'
import { UserOutlined } from '@ant-design/icons';
import GithubCorner from 'react-github-corner';
import { useRef } from 'react';
import './head.css'

function Title(){
    const fileRef = useRef<HTMLInputElement>(null!);
    const [avatar,setAvatar] = useState<string>("icon.png")
    const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length !== 0) {
          let file = files[0];
          if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型");
            return false;
          }
          setAvatar(file.name);
          console.log(file.name);
        }
      };
    return(
        <header className="meme-header">
              <img src={avatar} style={{position:"absolute",top:5,right:40}}width="40px" height="40px" alt="avatar" onClick={() => fileRef.current?.click()}></img>
              <div className="wordart"><span className="text">MemeDiy</span></div>
             <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={imageChange}
            />
            <GithubCorner href="https://github.com/nnnth/meme_diy" size="80" direction="left" bannerColor="#CCCCFF"/>
         </header>
    );
}
export default Title