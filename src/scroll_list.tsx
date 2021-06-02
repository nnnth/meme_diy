import { useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
import React from 'react'
import "./scroll_list.css"
// interface InputProps{
//     parent:React.Component
// }
function ScrollList(props: any) {
  // 已知item高度、需要与item css高度保持一致
  const itemHeight = 150;
  const pageSize = 10;
  // 原始数据源
  const [imgurls, setImgurls] = useState(Array(0));
  const scrollRef = useRef<HTMLDivElement>(null)
  // const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [totalCount, setTotalCount] = useState(0);
  const [beforeCount, setBeforeCount] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  // 真正渲染的数据
  const [showimg, setShowimg] = useState(Array(0));
  const sliceShowDataSource = useCallback(() => {
    const { showDataSource, beforeCount, totalCount } = getRenderData({
      pageNum: pageNum,
      pageSize: pageSize,
      dataSource: imgurls,
    });
    setShowimg(showDataSource);
    setBeforeCount(beforeCount);
    setTotalCount(totalCount);
  }, [imgurls, pageNum]);
  const load_imgs = () => {
    fetch("/users/" + props.path, { //请求的服务器地址
      method: "GET", //请求方法
      headers: {  //请求头信息
        //  'Content-Type':'application/x-www-form-urlencoded' //用url编码形式处理数据
        'Content-Type': 'application/json' //第二种请求头编写方式json
      }
    })
      .then(res => res.json())
      .then(res => {
        setImgurls(res["filelist"]);
        console.log(res["filelist"])
      })
      .catch(err => {    //错误打印
        console.log(err)
      });
  }
  useEffect(() => {
    load_imgs();
  }, []);
  useImperativeHandle(props.cref, () => ({
    // changeVal 就是暴露给父组件的方法
    refresh: () => {
      if (props.path === "templates/")
        load_imgs()
    }
  }));
  useEffect(() => {
    sliceShowDataSource();
  }, [pageNum, imgurls.length, sliceShowDataSource]);


  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    var img = e.target as HTMLImageElement;
    props.onClick(img.src);
  };

  // 获取最大页数
  const getMaxPageNum = () => {
    var height = 0;
    if (scrollRef.current) {
      height = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    }
    return getPageNum({
      scrollTop: height,
      pageSize: pageSize,
      itemHeight: itemHeight,
    });
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    e.preventDefault();
    const maxPageNum = getMaxPageNum();
    const scrollPageNum = getPageNum({
      scrollTop: scrollRef.current?.scrollTop,
      pageSize: pageSize,
      itemHeight: itemHeight,
    });
    const currPageNum = Math.min(scrollPageNum, maxPageNum);
    if (currPageNum === pageNum) return;
    setPageNum(currPageNum);
  };

   const getPageNum = ({ scrollTop, pageSize, itemHeight }: any) => {
    const pageHeight = pageSize * itemHeight;
    return Math.max(Math.floor(scrollTop / pageHeight), 1);
  };

   const getRenderData = ({ pageNum, pageSize, dataSource }: any) => {
    const startIndex = (pageNum - 1) * pageSize;
     const endIndex = Math.min((pageNum + 2) * pageSize, dataSource.length);
    return {
      showDataSource: dataSource.slice(startIndex, endIndex),
       beforeCount: startIndex,
      totalCount: dataSource.length,
    };
  };

  return (
    <div className="scroll" ref={scrollRef} onScroll={(e) => { onScroll(e) }}>
       <div
        className="container"
        style={{ height: `${totalCount * itemHeight}px` }}
      >
         <div
          className="inner"
          style={{ transform: `translateY(${beforeCount * itemHeight}px)` }}
        >
           {showimg.map((item, index) => {
            return (
              <div className="scroll-item" key={index} onClick={(e) => { handleSelect(e) }}>
                <img alt={"meme"} className="scroll_img" src={props.path + item}></img>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default ScrollList
