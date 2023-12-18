import { store } from "../redux/store"
import { Link } from "react-router-dom";
import Header from "../Component/Header";
import More_product_list from "../Component/More_product_list";
import { useEffect, useState } from "react";
import { Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { addMenProduct, addWomenProduct } from "../redux/storeSlice";
import Footer from "../Component/Footer";
import Loading from "../Component/Loading";
const Order = () => {
    const orders = store.getState().storeSlice.orders;
    const men_product = store.getState().storeSlice.men;
    const women_product = store.getState().storeSlice.women;
    const dispatch = useDispatch();
    const [readyToshow, setReadyToShow] = useState(false);
    useEffect(() => {
        if (men_product.length < 1 || women_product.length < 1) {
            getDocs(collection(db, "men")).then(data => {
                let men = [];
                let women = [];
                data.forEach(snapshot => {
                    if (snapshot.data()["gender"] === "men") {
                        men.push(snapshot.data());
                    } else {
                        women.push(snapshot.data());
                    }
                });
                dispatch(addMenProduct([...men]));
                dispatch(addWomenProduct([...women]));
                setReadyToShow(true);
            })
        } else {
            setReadyToShow(true);
        }
    }, [])

    const totalItemCout = (list) => {
        let quantity = 0;
        list.forEach(item => quantity += parseInt(item.quantity));
        return quantity
    }
    return <div className="relative min-h-screen pb-64">
        <Header />
        {readyToshow ?
            <>
                <div className="flex flex-col justify-center items-center relative">
                    {orders.length > 0
                        ? <div className="w-2/3 md:w-[95%] my-4">
                            <span>Ordered Item List,</span>
                            {
                                orders.map((item,i) => {
                                    return <>
                                    <div key={i} className="flex flex-row items-center border-b-2 border-slate-500">
                                        <details className="flex flex-col gap-2 my-1 bg-white p-2 w-11/12 md:w-full rounded-xl shadow-sm">
                                            <summary><span className="text-xs text-slate-800">Ordered On : </span>
                                                <span className="text-sm font-semibold">{new Timestamp(item.purchaseTime.seconds,item.purchaseTime.nanoseconds).toDate().toDateString()}</span>
                                                <span></span>
                                            </summary>
                                            <div className="flex flex-col gap-3 bg-purple-50 p-4 rounded-md">
                                            <span className="flex flex-col"><span className=" text-xs text-slate-800">Order Id : </span>
                                                <span className="font-semibold text-sm">{item.orderId}</span>
                                            </span>
                                            <span className="flex flex-col text-sm">
                                                <span className="text-xs text-slate-600 border-b-2 border-slate-600 mb-1">Total items : {totalItemCout(item.items)}</span>
                                                {item.items.map(eachProduct => {
                                                    return <span className="flex flex-row justify-between">
                                                        <Link to={`/${eachProduct.gender}/${eachProduct.id}`} className="text-purple-900 font-semibold md:w-2/3">{eachProduct.quantity} x {eachProduct.name}</Link>
                                                        <span className="font-semibold">Rs .{parseInt(eachProduct.price) * parseInt(eachProduct.quantity)}</span>
                                                    </span>
                                                })}
                                                <span className="flex flex-row justify-between border-t-2 border-dotted border-slate-900 text-sm my-1"><span className="font-semibold">Total Price : </span>
                                                    <span className="font-semibold">Rs. {item.priceDetails.totalPrice}</span>
                                                </span>
                                            </span>
                                            <span className="text-sm">
                                                <span className="text-xs text-slate-800">Shipping Address : </span>
                                                <span>{item.shippingAddress}</span>
                                            </span>
                                            </div>
                                        </details>
                                        </div>
                                    </>
                                })
                            }
                        </div>
                        : <div className="flex flex-row gap-2 w-full justify-center items-center my-16">
                            <span>You have not orderd anything.</span>
                            <span>Lets Check </span>
                            <Link className="font-semibold text-2xl" to="/"> CartY </Link>
                            <span>Dresses .</span>
                        </div>
                    }
                    
                </div>
                {men_product.length > 0
                        ? 
                            <More_product_list item_List={[...men_product, ...women_product]} selected_item={[men_product[0]]} />
                            
                        : <></>
                    }
            </>
            : <Loading />
        }


<Footer page={"Home"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
    </div>
}
export default Order;