import { useEffect, useRef, useState } from "react";

const Loading=(props)=>{
    const icon = useRef();
    const[deg,setDeg]=useState("360deg");
    const rotate=(deg)=>{
        if(icon.current){
            icon.current.style.rotate=deg;
            if(deg==="360deg"){
                setDeg("120deg");   
            }else if(deg==="120deg"){
                setDeg("240deg");   
            }else if(deg==="240deg"){
                setDeg("360deg");
            }
        }
    };
    useEffect(()=>{
        setTimeout(()=>{
            rotate(deg)
        },400)
    },[deg])
    return <>
    <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center z-20">
    <div className="p-20 flex flex-col justify-center items-center bg-slate-50 rounded-3xl">
    <div className=" flex flex-row justify-center items-center">
    <span className=" text-center bold m-4 text-4xl text-black flex flex-row gap-2 items-center justify-center">
        CartY 
        <div ref={icon}>
        <i className="fi fi-tr-clothes-hanger text-rose-800 duration-500"></i>
        </div>
    </span>
    </div>
    <span className="text-sm text-slate-800">Getting things ready ...</span>
    </div>
    </div>
    </>
}

export default Loading;