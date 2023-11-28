import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase";
import { getDocs , collection} from "firebase/firestore";
import { addMenProduct } from "../redux/storeSlice";
import Header from "../Component/Header";
import { Link } from "react-router-dom";
const Men=()=>{

    const dispatch = useDispatch();

    const men_product = useSelector(state=>state.storeSlice.men)
    useEffect(()=>{
        if(men_product.length<1){
            try {
                getDocs(collection(db,"men")).then(docsnap=>{
                    const products=[]
                    docsnap.forEach(element => {
                        products.push(element.data())
                    });
                    dispatch(addMenProduct([...products]));
                })
            } catch (error) {
                console.log(error)
            }
        }
    },[])
return <>
<div className="flex flex-col justify-center items-center gap-2">
<Header />
<span className="w-full relative px-4 ">
    <Link to={"/"} className="text-sm">ThE</Link>
    <span> / </span>
    <Link to={"/men"} className="text-md font-semibold">Men</Link>
</span>
<span className="m-4 font-semibold underline w-full px-4 ">
    T-shirt Collection
</span>

    <div className="w-full relative">
    <div className="flex min-w-full  overflow-y-hidden relative px-10 flex-row gap-4 justify-evenly">
        {
            men_product.map((item)=>{
                if(item.type==="tshirt"){
                    return <>
                    <Link to={"/product/"+item.id} >
                    <div className=" relative min-w-[16rem] bg-cover h-80 " style={{backgroundImage: `url("${item.images1}")`}}>
                        <div className=" flex flex-col justify-start items-start gap-2 absolute bottom-0 p-2">
                            <span className="text-white font-semibold bg-[#0b0d0e2b] text-lg">{item.company}</span>
                            <span className="text-sm text-gray-900 ">{item.name}</span>
                        </div>
                    </div>
                    </Link>
                    </>
                }
            })
        }
    </div>
    </div>


<span className="m-4 font-semibold underline w-full px-4 ">
    Shirt Collection
</span>

    <div className="w-full relative">
    <div className="flex min-w-full  overflow-y-hidden relative px-10 flex-row gap-4 justify-evenly">
        {
            men_product.map((item)=>{
                if(item.type==="shirt"){
                    return <>
                    <Link to={"/product/"+item.id} >
                    <div className=" relative min-w-[16rem] bg-cover h-80 " style={{backgroundImage: `url("${item.images1}")`}} >
                        <div className=" flex flex-col justify-start items-start gap-2 absolute bottom-0 p-2">
                            <span className="text-white font-semibold bg-[#0b0d0e2b] text-lg">{item.company}</span>
                            <span className="text-sm text-gray-900 ">{item.name}</span>
                        </div>
                    </div>
                    </Link>
                    </>
                }
            })
        }
    </div>
    </div>


</div>
</>
}
export default Men;