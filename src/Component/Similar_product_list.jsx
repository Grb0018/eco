import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Similar_product_list=(props)=>{

    const  { type , products , currentId ,currentGender}= props;
    const [finalList,setFinalList]=useState([]);
    useEffect(()=>{
        setFinalList(products.filter(item=>item.id!==currentId&&item.type===type));
       
    },[type,products,currentId])

        return <>
        <div className='my-4 '>
            <hr />
            <span className='px-4 my-5 block font-semibold'>Lets check more {type} ,</span>
            <div className="flex min-w-full  overflow-y-hidden relative px-10 flex-row gap-4 justify-evenly md:gap-10 md:justify-normal">
        {
            finalList.map((item,i)=>{
                if(i<5){
                    return <>
                    <Link to={"/"+currentGender+"/"+item.id} key={i}>
                    <div className=" relative min-w-[14rem] bg-cover h-72 " style={{backgroundImage: `url("${item.images1}")`}} >
                        <div className=" flex flex-col justify-start items-start gap-2 absolute bottom-0 p-2 ">
                            <span className="text-white font-semibold bg-[#0b0d0e2b] text-lg">{item.company}</span>
                            <span className="text-sm text-white  [text-shadow:_0px_1px_7px_black]  ">{item.name}</span>
                        </div>
                    </div>
                    </Link>
                    </>
                }
            })
        }
         </div>
        </div>
        </>
    

}

export default Similar_product_list;