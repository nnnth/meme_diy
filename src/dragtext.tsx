import React from 'react'
import { useCallback, useEffect, useContext, useRef } from 'react'
import './dragtext.css'
import { boxsContext } from './show'
const points = ['e', 'w', 's', 'n', 'ne', 'nw', 'se', 'sw']
interface BoxProps {
    id: number,
    onChange: Function,
}

function DragText(props: BoxProps) {
    const style = useContext(boxsContext)[props.id];
    const parentpos = useRef<DOMRect>(null!);
    // 画板的
    useEffect(() => {
        const parentwrap = document.getElementsByClassName("wrap-canvas")[0] as HTMLDivElement;
        parentpos.current = parentwrap.getBoundingClientRect();
    }, [])

    const init = useRef({
        disx: 0,
        disy: 0,
        width: 0,
        height: 0,
        cx: 0,
        cy: 0,
        top: 0,
        left: 0,
    })
    const textref = useRef<HTMLDivElement>(null!);
    const isDown = useRef(false)
    const direction = useRef("")



    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        isDown.current = true;
        const disy = e.clientY - textref.current.offsetTop;
        const disx = e.clientX - textref.current.offsetLeft;
        init.current = ({
            disx: disx,
            disy: disy,
            width: style.width,
            height: style.height,
            cx: e.clientX,
            cy: e.clientY,
            top: textref.current.offsetTop,
            left: textref.current.offsetLeft
        });
        if ((e.target as HTMLDivElement).className === "drawing-item")
            direction.current = "move"
        else
            direction.current = (e.target as HTMLDivElement).className.split('-')[2]
    }
    const transform = useCallback((e: MouseEvent) => {
        var newstyle = { ...style }
        switch (direction.current) {
            case 'move':
                const top = e.clientY - init.current.disy;
                const left = e.clientX - init.current.disx;
                newstyle.top = Math.max(0, Math.min(top, parentpos.current.height - style.height));
                newstyle.left = Math.max(0, Math.min(left, parentpos.current.width - style.width));
                console.log(newstyle.left);
                break
            // 东
            case 'e':
                // 向右拖拽添加宽度
                newstyle.width = init.current.width + e.clientX - init.current.cx;
                newstyle.width = Math.min(newstyle.width, parentpos.current.width - newstyle.left)
                break;
            // // 西
            case 'w':
                // 增加宽度、位置同步左移
                newstyle.width = init.current.width - e.clientX + init.current.cx;
                newstyle.left = Math.max(0, init.current.left + e.clientX - init.current.cx);
                newstyle.width = Math.min(newstyle.width, init.current.width + init.current.left - newstyle.left);
                break
            // 南
            case 's':
                newstyle.height = init.current.height + e.clientY - init.current.cy;
                newstyle.height = Math.min(newstyle.height, parentpos.current.height - newstyle.top)
                break
            // 北
            case 'n':
                newstyle.height = init.current.height - e.clientY + init.current.cy;
                newstyle.top = Math.max(0, init.current.top + e.clientY - init.current.cy);
                newstyle.height = Math.min(newstyle.height, init.current.height + init.current.top - newstyle.top)

                break
            // 东北
            case 'ne':
                newstyle.height = init.current.height - e.clientY + init.current.cy;
                newstyle.top = Math.max(0, init.current.top + e.clientY - init.current.cy);
                newstyle.height = Math.min(newstyle.height, init.current.height + init.current.top - newstyle.top)
                newstyle.width = init.current.width + e.clientX - init.current.cx;
                newstyle.width = Math.min(newstyle.width, parentpos.current.width - newstyle.left)
                break
            // 西北
            case 'nw':
                newstyle.height = init.current.height - e.clientY + init.current.cy;
                newstyle.top = Math.max(0, init.current.top + e.clientY - init.current.cy);
                newstyle.height = Math.min(newstyle.height, init.current.height + init.current.top - newstyle.top)
                newstyle.width = init.current.width - e.clientX + init.current.cx;
                newstyle.left = Math.max(0, init.current.left + e.clientX - init.current.cx);
                newstyle.width = Math.min(newstyle.width, init.current.width + init.current.left - newstyle.left);
                break
            // 东南
            case 'se':
                newstyle.height = init.current.height + e.clientY - init.current.cy;
                newstyle.height = Math.min(newstyle.height, parentpos.current.height - newstyle.top)
                newstyle.width = init.current.width + e.clientX - init.current.cx;
                newstyle.width = Math.min(newstyle.width, parentpos.current.width - newstyle.left)
                break
            // 西南
            case 'sw':
                newstyle.height = init.current.height + e.clientY - init.current.cy;
                newstyle.height = Math.min(newstyle.height, parentpos.current.height - newstyle.top)
                newstyle.width = init.current.width - e.clientX + init.current.cx;
                newstyle.left = Math.max(0, init.current.left + e.clientX - init.current.cx);
                newstyle.width = Math.min(newstyle.width, init.current.width + init.current.left - newstyle.left);
                break
        }
        newstyle.width = Math.max(10, newstyle.width)
        newstyle.height = Math.max(10, newstyle.height)
        props.onChange(props.id, newstyle);
    }, [props, style]);

    const onMouseMove = useCallback((e: MouseEvent): void => {
        if (!isDown.current) return
        transform(e);
    }, [transform])

    const onMouseUp = useCallback(() => {
        isDown.current = false;
        direction.current = ""
    }, [])
    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);
        }
    }, [onMouseMove, onMouseUp])


    return (
        <div>
            <div className="drawing-item" ref={textref} style={style} onMouseDown={onMouseDown}>
                {points.map((item, index) => <div key={index} className={`control-point point-${item}`} onMouseDown={onMouseDown}></div>)}
            </div>
        </div>
    )
}
export default DragText