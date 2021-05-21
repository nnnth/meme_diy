import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import GIF from 'gif.js';
import omggif from 'omggif';
import {configs} from './configs'
export default function Gif() {
    const [gifinfo, setGifinfo] = useState<any>(configs[0]);
    const [gifurl, setGifurl] = useState<string>("");
    // const [gif, setGif] = useState<any>();
    const gifref = useRef<any>(null!);
    const gifMeme = useRef<HTMLImageElement>(null!);
    const createWorkers = async (info: any) => {
        const tmpWorker = await fetch('/gif.worker.js'),
            workerSrcBlob = new Blob([await tmpWorker.text()], { type: 'text/javascript' }),
            workerBlobURL = window.URL.createObjectURL(workerSrcBlob);
        var temp = new GIF({
            workerScript: workerBlobURL,
            workers: 3,
            quality: 16,
            width: info.width,
            height: info.height,
        })
        console.log(temp);
        console.log(workerBlobURL);
        // setGif(temp);
        gifref.current = temp;
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
        const tmp = await fetch(gifinfo.gif),
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
            var newgif = gifref.current
            newgif.addFrame(info.ctx, {
                copy: true,
                delay: frameInfo.delay * 10,
                dispose: -1
            })
            // setGif(newgif);
            gifref.current = newgif;
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
        a.href = gifurl;
        a.download = 'meme.gif';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    const renderGif = () => {
        gifref.current.render();
        // this.state.gif.on('progress', progress => {
        //     this.setState({ progressNum: 100 * progress });
        //     this.finished = false;
        // })
        gifref.current.on('finished', (blob:Blob) => {
            const img = gifMeme.current as HTMLImageElement;
            var gifUrl = window.URL.createObjectURL(blob);
            img.src = gifUrl;
            setGifurl(gifUrl);
            downGif();
        })
    }
    const generating = async () => {
        // this.setState({ progressNum: 0 })
        const info = await createGif();
        await createWorkers(info);
        drawFrame(info);
        renderGif()
    }

    return (
        <div>
            <img src="gifs/dagong.gif" ref={gifMeme}></img>
            {
                gifinfo.config.map((sentence: any, index: number) =>
                    <div className="field" key={index}>
                        <label className="label">第 {index + 1} 句：</label>
                        <div className="control">
                            <input className="input is-info sentence" type="text" placeholder={sentence.default} />
                        </div>
                    </div>)
            }
            <button onClick={generating}>下载</button>
        </div>
    )
}