import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase";
import { getDocs , collection} from "firebase/firestore";
import { addMenProduct } from "../redux/storeSlice";
import Header from "./Header";
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
    <div className="flex min-w-max relative px-10 flex-row gap-2">
        {
            men_product.map((item)=>{
                return <>
                <div className=" relative min-w-60 cover h-60 " style={{backgroundImage: `url("${item.image1}")`}}>
                    {item.company}
                </div>
                </>
            })
        }
    </div>
    </div>


</div>
</>
}
export default Men;