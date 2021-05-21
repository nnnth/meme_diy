import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react'
import "./scroll_list.css"
// interface InputProps{
//     parent:React.Component
// }
function ScrollList(props: any) {
  // 已知item高度、需要与item css高度保持一致
  const itemHeight = 100;
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
    fetch("/users/"+props.path, { //请求的服务器地址
      method: "GET", //请求方法
      headers: {  //请求头信息
        //  'Content-Type':'application/x-www-form-urlencoded' //用url编码形式处理数据
        'Content-Type': 'application/json' //第二种请求头编写方式json
      }
    })
      .then(res => res.json())
      .then(res => {
        setImgurls(res["filelist"]);
      })
      .catch(err => {    //错误打印
        console.log(err)
      });
  }
  useEffect(() => {
    load_imgs();
  }, []);

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

  // 1、监听用户scroll事件
  // 2、实时计算页码
  // 3、如果页码发生改变，进行数据切片，重新渲染数据
  // 4、如果页码没有发生改变，保持不动
  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    e.preventDefault();
    const maxPageNum = getMaxPageNum();
    const scrollPageNum = getPageNum({
      scrollTop: scrollRef.current?.scrollTop,
      pageSize: pageSize,
      itemHeight: itemHeight,
    });
    const currPageNum = Math.min(scrollPageNum, maxPageNum);
    console.log('当前scrollTop', scrollRef.current?.scrollTop)
    // 如果当前页数保持不变
    if (currPageNum === pageNum) return;
    console.log('进入下一页')
    setPageNum(currPageNum);
  };

  // 计算分页
  const getPageNum = ({ scrollTop, pageSize, itemHeight }: any) => {
    const pageHeight = pageSize * itemHeight;
    return Math.max(Math.floor(scrollTop / pageHeight), 1);
  };

  // 数据切片
  const getRenderData = ({ pageNum, pageSize, dataSource }: any) => {
    const startIndex = (pageNum - 1) * pageSize;
    // 这里+2：想要保证顺畅的滑动，快速滑动不白屏，需要至少预留3页数据，前+中+后
    const endIndex = Math.min((pageNum + 2) * pageSize, dataSource.length);
    return {
      showDataSource: dataSource.slice(startIndex, endIndex),
      // 前置数量
      beforeCount: startIndex,
      totalCount: dataSource.length,
    };
  };

  return (
    <div className="scroll" ref={scrollRef} onScroll={(e) => { onScroll(e) }}>
      {/* 滚动层：实际滚动区域高度 */}
      <div
        className="container"
        style={{ height: `${totalCount * itemHeight}px` }}
      >
        {/* 通过translateY撑起滚动条 */}
        <div
          className="inner"
          style={{ transform: `translateY(${beforeCount * itemHeight}px)` }}
        >
          {/* 列表层：实际渲染的数据 */}
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
