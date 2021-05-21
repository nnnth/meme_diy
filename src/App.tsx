import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Show from './show'
import Gif from './gifmeme'
import DragText from './dragtext'
import 'antd/dist/antd.css';
import Title from './head'


function App() {
  // const canvas =  useRef<HTMLCanvasElement>();
  // const ctx = canvas.getContext('2d');
  // var image = new Image();
  // image.src = 'logo.svg';

  // image.onload=function(){
  //   if(ctx)
  //   { 
  //     ctx.drawImage(image,10,10);
  //   var imagedata = ctx.getImageData(50,50,400,400);
  //   ctx.createImageData(imagedata);
  //   }
  // }
  return (
     <div className="App">
      <Title></Title>
       <Show></Show>
       {/* <Gif></Gif> */}
     </div>
   );
}

export default App;
