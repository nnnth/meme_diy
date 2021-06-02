import React, { createContext } from 'react';
import { useCallback, useEffect, useState, useRef } from 'react'
import ScrollList from './scroll_list'
import DragText from './dragtext'
import './show.css'
import { DownloadOutlined, PlusCircleOutlined,CloudUploadOutlined } from '@ant-design/icons';
import ScrollText from './scroll_text'

import { Form, FormInstance, Button, Tabs,Progress,Switch,Modal,notification} from 'antd';
// import Share from 'social-share-react'
import { configs } from './configs'
import GifText from './gif_text'
import GIF from 'gif.js';
import omggif from 'omggif';

const { TabPane } = Tabs;

declare global {
  interface Window {
    saveAs: any;
  }
}
function getImageBlob(url: string, cb: any) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status === 200) {
      if (cb) cb(this.response);
    }
  };
  xhr.send();
};
type BoxProps = {
  id: number,
  left: number,
  top: number,
  height: number,
  width: number,
}
type TextProps = {
  id: number,
  text: string,
  font: string,
  size: number,
  color: string,
  show: boolean,

}
const defaultbox: BoxProps = {
  id: 0,
  left: 80,
  top: 300,
  height: 40,
  width: 350,
}
const defaulttex: TextProps = {
  id: 0,
  text: "",
  font: "Arial",
  size: 30,
  color: "#000000",
  show: false,
}
export const boxsContext = createContext<Array<BoxProps>>([defaultbox])
const maxcanvassize = 500;
const mincanvassize = 320;
const opensuccessNotificationWithIcon = ()=> {
  notification["success"]({
    message: '上传成功',
    description:
      '',
    duration:3,
  });
};
function Show() {
  const [boxs, setBoxs] = useState<Array<BoxProps>>([defaultbox]);
  const [texts, setTexts] = useState<Array<TextProps>>([defaulttex]);

  const [img, setImg] = useState<CanvasImageSource>(null!);
  const [imgsize, setImgsize] = useState({
    width: 512,
    height: 512
  });
  const [imgurl, setImgurl] = useState("");
  const [gifinfo, setGifinfo] = useState<any>(configs[0]);
  const [progressnum,setProgressNum] = useState<number>(-1);
  const [showbox,setShowbox] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);


  // const [gif, setGif] = useState<any>();
  const gif = useRef<any>(null!);
  // const [gifurl, setGifurl] = useState<string>("");
  const gifurl = useRef<any>(null!);


  const fileRef = useRef<HTMLInputElement>(null!);
  const inputRef = useRef<FormInstance>(null!);
  const currentindex = useRef<number>(0);
  const count_index = useRef<number>(1);
  const isgif = useRef<boolean>(false);
  const gifMeme = useRef<HTMLImageElement>(null!);
  const imgRef = useRef<any>(null!);
  const gifRef = useRef<any>(null!);

  const drawCanvas = useCallback(() => {
    var canvas = document.getElementById("memecanvas") as HTMLCanvasElement;
    canvas.width = imgsize.width;
    canvas.height = imgsize.height;
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      //创建渐变
      // var grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      // grad.addColorStop(0, "magenta");
      // grad.addColorStop(0.5, "yellow");
      // grad.addColorStop(1.0, "red");
      if (img)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // ctx.strokeStyle = grad;
      texts.forEach((text, index) => {
        const box = boxs[index];
        ctx.font = "bold ".concat(text.size.toString(), "px ", text.font);
        // ctx.font ="bold 30px Times New Roman"
        ctx.fillStyle = text.color;
        ctx.fillText(text.text, box.left + 5, box.top + box.height / 2 + 10);
      });
    };
  }, [boxs, img, imgsize, texts]);
  useEffect(() => {
    if (!isgif.current)
      drawCanvas();
  }, [img, boxs, texts, drawCanvas]);

  useEffect(() => {
    if (!isgif.current || imgurl === "")
      return;
    var ind = imgurl.lastIndexOf('/');
    var name = imgurl.substring(ind + 1);
    var index = parseInt(name.split('.')[0]);
    if (index >= 0 && index < configs.length) {
      setGifinfo(configs[index]);

    }
    else {
      alert("no correspond config for the gif");
    }
  }, [imgurl]);


  const loadimgurl = (url: string) => {
    setImgurl(url);
    if (url.endsWith("gif")) {
      isgif.current = true;
    }
    else
      isgif.current = false;
    var reader = new FileReader();
    getImageBlob(url, function (blob: Blob) {
      reader.readAsDataURL(blob);
    });
    reader.onload = e => {
      var imgurl = reader.result as string;
      var img = new Image();
      img.src = imgurl;
      img.onload = function () {//必须onload之后再设置
        setImg(img);
        if (img.width < mincanvassize && img.height < mincanvassize) {
          if (img.width < img.height)
            setImgsize({ width: mincanvassize, height: img.height * mincanvassize / (img.width) });
          else
            setImgsize({ height: mincanvassize, width: img.width * mincanvassize / (img.height) });
        }
        else if (img.width < maxcanvassize && img.height < maxcanvassize) {
          setImgsize({ width: img.width, height: img.height });
        }
        else {
          if (img.width > img.height)
            setImgsize({ width: maxcanvassize, height: img.height * maxcanvassize / (img.width) });
          else
            setImgsize({ height: maxcanvassize, width: img.width * maxcanvassize / (img.height) });
        }

      };
    };
    // drawCanvas();
  };
  const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length !== 0) {
      let file = files[0];
      if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
      }
      loadimgurl(URL.createObjectURL(file));
    }
  };
  const textChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var value = e.target.value;
    var index = parseInt(e.target.id)
    var newtexts = texts.slice();
    newtexts[index].text = value;
    setTexts(newtexts);
  }
  
  const addinput = () => {
    var newboxs = boxs.slice();
    newboxs.push({
      id: count_index.current + 1,
      left: 50,
      top: 20,
      height: 30,
      width: 200,
    });
    setBoxs(newboxs);
    var newtexts = texts.slice()
    newtexts.push({
      id: count_index.current + 1,
      text: "",
      font: "Arial",
      size: 30,
      color: "#000000",
      show: false,
    });
    setTexts(newtexts);
    count_index.current = count_index.current + 1;
    currentindex.current = texts.length - 1;
  }
  const deleteinput = (e: React.MouseEvent) => {
    var id = parseInt(e.currentTarget.id);
    var newboxs = boxs.slice();
    var newtexts = texts.slice();
    newboxs.splice(id, 1);
    newtexts.splice(id, 1);
    setBoxs(newboxs);
    setTexts(newtexts);
  }

  const setPos = (id: number, style: BoxProps) => {
    var newboxs = boxs.slice()
    newboxs[id] = style;
    setBoxs(newboxs);
  }
  useEffect(() => {
    if (!isgif.current) {
      loadimgurl('/templates/0.jpg');
      drawCanvas();
    }
  }, []);
  const onFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    var value = e.target.value;
    var index = parseInt(e.target.id);
    var newtexts = texts.slice();
    newtexts[index].font = value.toString();
    currentindex.current = index;
    setTexts(newtexts);
  }
  const onFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var fontsize = parseInt(e.target.value);
    var index = parseInt(e.target.id);
    var newtexts = texts.slice();
    newtexts[index].size = fontsize;
    currentindex.current = index;
    setTexts(newtexts);
  }
  const changevis = (e: React.MouseEvent<HTMLButtonElement>) => {
    var index = parseInt(e.currentTarget.id);
    var newtexts = texts.slice();
    if (newtexts[index].show)
      newtexts[index].show = false;
    else {
      newtexts[index].show = true;
      currentindex.current = index;
    }
    setTexts(newtexts);
  }
  const onColorChange = (value: any) => {
    var newtexts = texts.slice();
    newtexts[currentindex.current].color = value.hex;
    setTexts(newtexts);
  }


  const createWorkers = async (info: any) => {
    const tmpWorker = await fetch('/gif.worker.js'),
        workerSrcBlob = new Blob([await tmpWorker.text()], { type: 'text/javascript' }),
        workerBlobURL = window.URL.createObjectURL(workerSrcBlob);
    gif.current = new GIF({
        workerScript: workerBlobURL,
        workers: 3,
        quality: 16,
        width: info.width,
        height: info.height,
    });
}
const createCanvasContext = (width:number, height:number) => {
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [width, height]
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.font = "16px 'Microsoft YaHei', sans-serif";
    [ctx.textAlign, ctx.textBaseline] = ['center', 'bottom'];
    [ctx.fillStyle, ctx.strokeStyle] = ['white', 'black'];
    [ctx.lineWidth, ctx.lineJoin] = [3, 'round'];
    return [canvas, ctx];
}

const createGif = async () => {
     const tmp = await fetch(imgurl),
        response = await tmp.arrayBuffer(),
        arrayBufferView = new Uint8Array(response),
        gifReader = new omggif.GifReader(arrayBufferView),
        frameZeroInfo = gifReader.frameInfo(0),
        [, ctx] = createCanvasContext(frameZeroInfo.width, frameZeroInfo.height);
    return {
        index: 0,
        time: 0,
        ctx: ctx,
        gifReader: gifReader,
        width: frameZeroInfo.width,
        height: frameZeroInfo.height,
        captions: document.querySelectorAll('.input.is-info.sentence'),
        pixelBuffer: new Uint8ClampedArray(frameZeroInfo.width * frameZeroInfo.height * 4),
    }
}
const drawFrame = (info:any) => {
    for (let i = 0; i < info.gifReader.numFrames(); i++) {
        info.gifReader.decodeAndBlitFrameRGBA(i, info.pixelBuffer);
        let imageData = new window.ImageData(info.pixelBuffer, info.width, info.height);
        info.ctx.putImageData(imageData, 0, 0);

        let frameInfo = info.gifReader.frameInfo(i);
        if (info.index < gifinfo.config.length) {
            drawCaptions(info, frameInfo)
        }
        var newgif = gif.current
        newgif.addFrame(info.ctx, {
            copy: true,
            delay: frameInfo.delay * 10,
            dispose: -1
        })
        gif.current = newgif;
    }
}
const drawCaptions = (info:any, frameInfo:any) => {
    var textInfo = gifinfo.config[info.index];
    if (textInfo.startTime <= info.time && info.time <= textInfo.endTime) {
        var text = undefined;
        if (info.captions[info.index])
            text = info.captions[info.index].value || textInfo.default;
        else
            text = textInfo.default;
        info.ctx.strokeText(text, info.width / 2, info.height - 5, info.width);
        info.ctx.fillText(text, info.width / 2, info.height - 5, info.width);
    }
    info.time += frameInfo.delay / 100;
    if (info.time > textInfo.endTime) {
        info.index++;
    }
}

const downGif = () => {
    let a = document.createElement('a');
    a.href = gifurl.current;
    console.log(gifurl.current);
    a.download = 'meme.gif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
const renderGif = () => {
    gif.current.render();
    gif.current.on('progress', (progress:number) => {
        setProgressNum(0|progress*100);
    })
    gif.current.on('finished', (blob:Blob) => {
        const img = gifMeme.current as HTMLImageElement;
        var gifUrl = window.URL.createObjectURL(blob);
        img.src = gifUrl;
        console.log(gifUrl);
        // setGifurl(gifUrl);
        gifurl.current = gifUrl;
        downGif();
        setProgressNum(-1);

    })
}
const generating = async () => {
    // this.setState({ progressNum: 0 })
    setProgressNum(0);
    const info = await createGif();
    await createWorkers(info);
    drawFrame(info);
    renderGif();

}
const downloadimg = (save:boolean) => {
  if(isgif.current)
  {
    generating();
    return;
  }
  var can = document.getElementById("memecanvas") as HTMLCanvasElement;
  var a = document.createElement("a");
  a.href = can.toDataURL();
  a.download = "meme.jpg"
  if(save)
  a.click();
  return a.href;
}
const handleOk = () => {
  var imgbase64 = downloadimg(false);
  console.log(imgbase64);
  fetch('/users/',{ //请求的服务器地址
      body: JSON.stringify({
       imageData: imgbase64,
       type:"templates"
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
    setIsModalVisible(false);
    opensuccessNotificationWithIcon();
    imgRef.current.refresh();
  })
  .catch(err=>{    //错误打印
      console.log(err)
  })
  
};

const handleCancel = () => {
  setIsModalVisible(false);
};
const upload = ()=>{
  setIsModalVisible(true);
}
const hidebox = ()=>{
  if(showbox)
    setShowbox(false);
  else
    setShowbox(true);
}



  return (
    <boxsContext.Provider value={boxs}>
      <div className="img-meme">
        <div className="wrap-canvas" style={imgsize}>
          {isgif.current ? <img src={imgurl} alt="show gif" ref={gifMeme} style={imgsize}></img> :
            <div>
              <canvas id="memecanvas" onClick={() => fileRef.current?.click()}></canvas>
              {showbox?boxs.map((item, index: number) => <DragText key={item.id} id={index} onChange={setPos}></DragText>):""}
            </div>}
          <div className="utils">
          <Button style={{marginTop:20}} icon={<CloudUploadOutlined/>} onClick={upload}></Button>
          <Button
            type="primary" style={{marginTop:20}}onClick={()=>downloadimg(true)} shape="round" icon={<DownloadOutlined />}>
            下载
          </Button>
          {/* <Share downloadimg={downloadimg}></Share> */}
          {/* <Share
          url='https://www.baidu.com'
          title="meme"
          disabled={['google', 'facebook', 'twitter']}
        ></Share> */}
        <Switch disabled={isgif.current} defaultChecked onChange={hidebox}  style={{marginTop:25}}></Switch>
        <Modal title="上传模板" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>上传的模板将会被所有打开该网站的用户看到</p>
        <p>请不要上传模板以外的图片</p>
        <p>上传的模板刷新后显示在右侧</p>
        <p>感谢您为本网站贡献模板！</p>
      </Modal>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={imageChange}
        />

        <Tabs>
          <TabPane tab="GIF" key="1">
            <ScrollList className="scroll-list" onClick={loadimgurl} path="gifs/" cref={gifRef}></ScrollList>
          </TabPane>
          <TabPane tab="IMG" key="2">
            <ScrollList className="scroll-list" onClick={loadimgurl} path="templates/" cref={imgRef}></ScrollList>
          </TabPane>
          <TabPane tab="TEXT" key="3">
            <Form className="input-area" ref={inputRef}>
              {/* {texts.map((item, index: number) =>
                <Custom item={item}
                  index={index}
                  key={item.id}
                  textChange={textChange}
                  addinput={addinput}
                  deleteinput={deleteinput}
                  onColorChange={onColorChange}
                  onFontChange={onFontChange}
                  onFontSizeChange={onFontSizeChange}
                  changevis={changevis}>
                </Custom>
              )} */}
              {isgif.current?"":<Button style={{ marginTop: 8 }} type="default" icon={<PlusCircleOutlined />} onClick={addinput}>
                    新增文本框
                  </Button>}
              {isgif.current ?
                <GifText config={gifinfo.config}></GifText> :
                  
                  <ScrollText
                    texts={texts}
                    textChange={textChange}
                    addinput={addinput}
                    deleteinput={deleteinput}
                    onColorChange={onColorChange}
                    onFontChange={onFontChange}
                    onFontSizeChange={onFontSizeChange}
                    changevis={changevis}>
                  </ScrollText>}


            </Form>
          </TabPane>
        </Tabs>
      </div>
      {progressnum>0?
        <div className="cover">
          <Progress type="circle" percent={progressnum}/>
        </div>:""}
    </boxsContext.Provider>
  );
}
export default Show