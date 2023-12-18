import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase";
import { getDocs, collection, where, query } from "firebase/firestore";
import { addWomenProduct } from "../redux/storeSlice";
import Header from "../Component/Header";
import { Link } from "react-router-dom";
import { store } from "../redux/store";
import Loading from "../Component/Loading";
import Footer from "../Component/Footer";
import FilterW from "../Component/Filter-w";
const Women=()=>{
    const [kurtas, setkurtas] = useState(true);
    const [jacket, setjacket] = useState(true);
    const [kurtasCollection, setkurtasCollection] = useState([]);
    const [jacketCollection, setjacketCollection] = useState([]);
    const[loading,setLoading]=useState(true);
    const dispatch = useDispatch();
    const women_product = useSelector(state => state.storeSlice.women)
    useEffect(() => {
        setkurtasCollection(women_product.filter(item => item.type === "kurtas"));
        setjacketCollection(women_product.filter(item => item.type === "jacket"));
    }, [women_product])

    useEffect(() => {
        if (women_product.length < 1) {
            try {
                getDocs(query(collection(db, "men"),where("gender","==","women"))).then(docsnap => {
                    const products = []
                    docsnap.forEach(element => {
                        products.push(element.data())
                    });
                    dispatch(addWomenProduct([...products]));
                    setLoading(false);
                })
            } catch (error) {
                console.log(error)
            }
        }else{
            setLoading(false);
        }
    }, [dispatch,women_product.length])


    return <div className="relative min-h-screen pb-72">
        <div className="flex flex-col justify-center items-center gap-2">
            <Header page={"Women"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
            {loading?<Loading/>:<></>}
            <span className="w-full relative px-4 md:my-6">
                <Link to={"/"} className="text-sm">CartY</Link>
                <span> / </span>
                <Link to={"/women"} className="text-md font-semibold">Women</Link>
            </span>

            {
                kurtas && loading===false ?
                    <span className="m-4 font-semibold underline w-full px-4 ">
                        kurtas Collection
                    </span>
                    : <></>
            }
            <FilterW products={women_product} setkurtas={setkurtas} setjacket={setjacket} setkurtasCollection={setkurtasCollection} setjacketCollection={setjacketCollection} kurtasCollection={kurtasCollection} jacketCollection={jacketCollection}/>
            <div className="w-full relative">
                <div className="flex min-w-full justify-between  overflow-y-hidden relative px-10 flex-row gap-4  md:flex-col">
                    {
                        kurtasCollection.map((item) => {
                            if (kurtas === true) {
                                return <>
                                    <Link to={"/women/" + item.id} >
                                        <div className=" relative min-w-[16rem] bg-cover h-80 " style={{ backgroundImage: `url("${item.images1}")` }}>
                                            <div className=" flex flex-col justify-start items-start gap-2 absolute bottom-0 p-2">
                                                <span className=" text-white [text-shadow:_0px_1px_7px_black] font-semibold text-xl">₹ {item.price}</span>
                                                <span className="text-white font-semibold bg-[#0b0d0e2b] text-lg p-0.5 px-2 rounded-sm">{item.company}</span>
                                                <span className="text-sm text-white [text-shadow:_0px_1px_7px_black]">{item.name}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            }else{
                                return<></>
                            }
                        })
                    }
                </div>
            </div>


            {
                jacket && loading===false
                    ? <span className="m-4 font-semibold underline w-full px-4 md:mt-10 ">
                        Jacket Collection
                    </span>
                    : <></>
            }
            <div className="w-full relative">
                <div className="flex min-w-full justify-between overflow-y-hidden relative px-10 flex-row gap-8 md:flex-col">
                    {
                        jacketCollection.map((item) => {
                            if (jacket === true) {
                                return <>
                                    <Link to={"/women/" + item.id} >
                                        <div className=" relative min-w-[16rem] bg-cover h-80 " style={{ backgroundImage: `url("${item.images1}")` }} >
                                            <div className=" flex flex-col justify-start items-start gap-2 absolute bottom-0 p-2">
                                                <span className=" text-white [text-shadow:_0px_1px_7px_black] font-semibold text-xl">₹ {item.price}</span>
                                                <span className="text-white font-semibold bg-[#0b0d0e2b] text-lg p-0.5 px-2 rounded-sm">{item.company}</span>
                                                <span className="text-sm text-white [text-shadow:_0px_1px_7px_black] ">{item.name}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            }else{
                                return<></>
                            }
                        })
                    }
                </div>
            </div>


        </div>
        <Footer page={"Home"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
    </div>
}

export default Women;