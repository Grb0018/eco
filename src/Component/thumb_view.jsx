import { useEffect, useState } from "react";

const Thumb_view=(props)=>{
    
    const[images,setImages]=useState([]);
    const[currentSource,setCurrentSource]=useState("");
    const[thumbImage,setThumbImage]=useState(images.filter(img=>img!==images[0]));
    useEffect(()=>{
        setThumbImage(images.filter(img=>img!==currentSource));
    },[currentSource])
    useEffect(()=>{
        setImages(props.imageList);
        setCurrentSource(props.imageList[0]);
    },[props.imageList])
    return <>
    <div className="flex flex-row-reverse md:flex-col gap-2 items-center justify-center md:w-full">
        <div className="md:flex md:justify-center md:w-full">
            <img src={currentSource} className="w-[26rem] mr-5 md:w-[15rem]" />
        </div>
        <div className="flex flex-col gap-4 justify-between md:flex-row">
            {thumbImage.map((img,i)=>{
                return <img className=" w-40 cursor-pointer md:w-20" src={img} key={i} onClick={()=>{setCurrentSource(img)}}></img>
            })}
        </div>
    </div>
    </>
}

export default Thumb_view;