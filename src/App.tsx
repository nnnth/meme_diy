import React, {useState } from 'react';
import './App.css';
import Show from './show'
import 'antd/dist/antd.css';
import Title from './head'
import PrePage from './prepage'


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
  const [enter,setEnter] = useState<boolean>(false);
  const onClick = ()=>
  {
    setEnter(true);
  }
  return (
     <div className="App">
       {enter?
      <div>
      <Title></Title>
       <Show></Show></div>:<PrePage onClick={onClick}></PrePage>}
     </div>
   );
}

export default App;
