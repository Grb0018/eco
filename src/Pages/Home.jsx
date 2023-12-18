
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import Loading from "../Component/Loading";
import { store } from "../redux/store";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { addMenProduct, addWomenProduct } from "../redux/storeSlice";
import ItemCard from "../Component/ItemCard";
import { Link } from "react-router-dom";
import More_product_list from "../Component/More_product_list";
const Home =()=>{
    const [loading,setLoading]=useState(true);
    const mens_product = useSelector(state=>state.storeSlice.men);
    const women_product = useSelector(state=>state.storeSlice.women);
    const[potrait,setPotrait]=useState(false);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(mens_product.length===0 || women_product.length===0){
            getDocs(collection(db,"men")).then(val=>{
                let men=[];
                let women=[];
                val.forEach(snapshot=>{
                    if(snapshot.data().gender==="men"){
                        men.push(snapshot.data());
                    }else{
                        women.push(snapshot.data());
                    }
                });
                dispatch(addMenProduct([...men]));
                dispatch(addWomenProduct([...women]));
                setLoading(false);
            })
        }else{
            setLoading(false);
        }
    },[])

    useEffect(()=>{
        if(window.innerWidth<650){
            setPotrait(true)
        }else{
            setPotrait(false)
        }
    },[window.innerWidth])

    const discountProduct=(percentage)=>{
        let allProduct = [...mens_product,...women_product];
        let products = [];
        allProduct.forEach(item=>{
            let discount = ((parseInt(item.actual_price)-parseInt(item.price))/parseInt(item.actual_price))*100;
            if(discount>percentage){
                products.push({item:item,discount:discount});
            }
        });
        return products;
    }

    return <>
    <div className="relative min-h-screen pb-72 ">
        <Header page={"Home"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
        {loading?<Loading/>:<>
        <img src={potrait?"./img/banner-m.webp":"./img/banner.webp"} alt="CartY" className="w-full h-auto my-12 bg-slate-100"/>
        <span className="flex justify-center w-full my-3 text-2xl md:text-sm">
            <span className="flex flex-col items-end gap-2">
            <q className=" italic">Fashion is the armor to survive the reality of everyday life</q> <p className="text-lg md:text-xs font-semibold">– Bill Cunningham</p>
            </span>
        </span>
        <main>
            <div className="flex flex-col justify-center items-center my-16 p-10 bg-neutral-50" data-aos="flip-left" data-aos-delay="100">
                <p className=" font-semibold text-2xl text-rose-700">Top Categories</p>
                <p className="text-zinc-800 text-sm">A style for every story.</p>
                <span className="flex flex-row gap-10 md:gap-4">
                    <Link to="/men" className="flex flex-col justify-center items-center gap-2 mt-8 mx-12 md:mx-5">
                        <span className="w-24 h-24 rounded-full bg-slate-400 flex bg-cover" style={{backgroundImage:`url(${mens_product[3].images1})`}}></span>
                        <p className="text-sm">Men</p>
                    </Link>

                    <Link to={"/women"} className="flex flex-col justify-center items-center gap-2 mt-8 mx-12 md:mx-5">
                        <span className="w-24 h-24 rounded-full bg-slate-400 flex bg-cover" style={{backgroundImage:`url(${women_product[5].images1})`}}></span>
                        <p className="text-sm">Women</p>
                    </Link>
                </span>
            </div>
            <div className="flex flex-col justify-center items-center my-16 p-10 bg-orange-50 md:p-1 md:pt-4" data-aos="flip-left" data-aos-delay="100">
            <span className=" font-semibold text-xl text-slate-600 flex gap-3 items-center md:text-sm md:ga-1"><p> ---- Products More Than</p><p className="text-rose-700 font-semibold text-3xl md:text-lg">70% </p> Discount ---- </span>
            <hr />
            <span className=" flex flex-row justify-around w-full my-6 md:w-[95%] md:overflow-scroll md:justify-normal md:gap-14 md:p-10">
            {discountProduct(70).map((item,i)=>{
                return <span className=" border-4 border-rose-300 relative" key={i}>
                    <span className="absolute flex z-10 -top-2 -left-10 p-2 bg-rose-600 rounded-md text-rose-100 -rotate-45">{parseInt(item.discount)}% off</span>
                    <ItemCard item={item.item}/></span>
            })}
            </span>
            </div>

            <div className="flex flex-col justify-center items-center my-16 p-10 md:p-2" data-aos="flip-left" data-aos-delay="100">
                <span className="flex flex-row justify-between px-10 w-full md:px-1">
                    <p className="text-lg text-slate-800 font-semibold md:text-sm">Mens's shirts collection , </p>
                    <Link to={"/men"} className="font-semibold text-rose-500 md:text-sm">More Shirt</Link>
                </span>
                <div className="flex flex-row justify-around w-full my-10 md:justify-normal md:gap-10 md:flex-col md:px-5">
                {mens_product.filter(item=>item.type==="shirt").map((item,i)=>{
                    return i<4 ? <span key={i} className="  shadow-xl shadow-orange-100">
                    <ItemCard item={item} />
                    </span>
                    :<></>
                })}
                </div>
            </div>            

            <div className="flex flex-col justify-center items-center my-16 p-10 bg-orange-50 md:px-2" data-aos="flip-left" data-aos-delay="100">
            <span className=" font-semibold text-xl text-slate-600 flex gap-3 items-center md:text-sm"><p> ---- Products More Than</p><p className="text-rose-700 font-semibold text-3xl md:text-xl">50% </p> Discount ---- </span>
            <hr />
            <span className=" flex flex-row justify-around w-full my-6 md:w-[95%] md:overflow-scroll md:justify-normal md:gap-14 md:p-10">
            {discountProduct(50).map((item,i)=>{
                return i<4 ?<span className=" border-4 border-rose-300 relative" key={i}>
                    <span className="absolute flex z-10 -top-2 -left-10 p-2 bg-rose-600 rounded-md text-rose-100 -rotate-45">{parseInt(item.discount)}% off</span>
                    <ItemCard item={item.item}/></span>
                    :<></>
            })}
            </span>
            </div>

            <div className="flex flex-col justify-center items-center my-16 p-10 md:p-2" data-aos="flip-left" data-aos-delay="100">
                <span className="flex flex-row justify-between px-10 w-full md:px-1">
                    <p className="text-lg text-slate-800 font-semibold md:text-sm">Womens's kurtas collection , </p>
                    <Link to={"/women"} className="font-semibold text-rose-500 md:text-sm">More Kurtas</Link>
                </span>
                <div className="flex flex-row justify-around w-full my-10 md:flex-col md:gap-10 md:px-5">
                {women_product.filter(item=>item.type==="kurtas").map((item,i)=>{
                    return i<4 ? <span key={i} className="  shadow-xl shadow-orange-100">
                    <ItemCard item={item} />
                    </span>
                    :<></>
                })}
                </div>
            </div>

            <More_product_list item_List={[...mens_product,...women_product]} selected_item={women_product[0]} />
        </main>
        </>}

        
        <Footer page={"Home"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
    </div>
    </>
}
export default Home