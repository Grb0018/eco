
import { useState , useEffect } from "react";
import {addToCart} from "../redux/storeSlice";
import { doc, getDoc } from 'firebase/firestore';
import { addUser } from '../redux/storeSlice';
import { auth, db } from "../firebase";
import { Link, useParams } from "react-router-dom";
import { store } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../Component/Header";
const Cart=()=>{

    const dispatch = useDispatch();
    const [totalcartItems, setTotalcartItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [extraDiscount, setExtraDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [cartItem, setCartItem] = useState([]);
    const user = useSelector(state=>state.storeSlice.user);
    
    useEffect(() => {
        if(user.length>=0){
            onAuthStateChanged(auth,(user)=>{
                if(user){
                    if(store.getState()?.storeSlice?.user[0].cart.length>0){
                        setCartItem(store.getState()?.storeSlice?.user[0].cart);
                    }else{
                        getDoc(doc(db,"users",user.uid)).then(snapshot=>{
                            dispatch(addUser([snapshot.data()]));
                            setCartItem(snapshot.data().cart);
                        })
                    }
                    setTotalcartItems(cartItem.length);
                }else{
                    console.log("no user")
                }
            })
        }else{
            setCartItem(store.getState()?.storeSlice?.user[0].cart);
        }

    }, [])

    const totalPriceCal = () => {
        var price = 0;
        cartItem.forEach(item => {
            price += parseInt(item.price) * parseInt(item.quantity);
        });
        setTotalPrice(price);

        let discount = 0;
        let rawprice = parseInt(price);
        discount = rawprice * 10 / 100;
        setExtraDiscount(discount);

        let finalAmount = parseInt(price) - parseInt(discount);
        finalAmount -= 30;
        setTotalAmount(finalAmount);
    }

    useEffect(() => {
        totalPriceCal();
        setTotalcartItems(cartItem.length);
    }, [cartItem])

    const removeItem = (data) => {
        var newList = cartItem.filter((item) => {
            if (item.name !== data.name) {
                return item;
            }
        });
        setCartItem([...newList]);
        dispatch(addToCart(newList));
    }

return <>
<Header />
{user.length > 0 ?
        <div className="flex flex-col m-10 p-10 mt-16">
        <p className="text-center text-4xl text-slate-950 font-semibold ">Your Cart Items</p>
        <div className="flex flex-row relative">
            <span className="flex flex-col p-8 w-2/3 relative">
                <p className=" bg-slate-50 p-2 font-semibold">Items</p>
                {cartItem.map((item, i) => {
                    return <div className="flex flex-row p-4 bg-neutral-50 border-y-2" key={i}>
                        <p className="m-2 w-[1.8rem]">{i + 1}.</p>
                        <span className="flex justify-center items-center bg-white rounded-sm">
                            <img src={item.img} className=" max-w-[10rem] rounded-md h-auto" />
                        </span>
                        <span className="flex flex-col px-1 w-9/12">
                            <p className=" font-bold px-1 text-xl">{item.brand}</p>
                            <p className=" font-semibold p-1 text-md">{item.name}</p>
                            <p className="p-1 text-md"> {item.details}</p>
                            <p className="text-sm p-1">Quantity : {item.quantity}</p>
                            <p className="text-sm p-1">Size : {item.size}</p>
                            <p className="text-sm p-1">Price : {item.price}</p>
                        </span>
                        <i className="fi fi-ss-trash p-1 cursor-pointer w-1/10" onClick={() => { removeItem(item) }}></i>
                    </div>
                })}
            </span>
            <span className="flex flex-col p-8 w-1/3 relative">
                <p className=" bg-slate-50 p-2 font-semibold">Price</p>
                {cartItem.length > 0 ?
                    <div>
                        <span className="flex p-2 bg-neutral-50"><p className=" font-semibold w-2/3 py-2 font-md text-left">Total Price</p><p className="w-1/3 font-sm py-2 text-right">{totalPrice}</p></span>
                        <span className="flex p-2 bg-neutral-50"><p className=" font-semibold w-2/3 py-2 font-md text-left">Extra Discount (10 %)</p><p className="w-1/3 font-sm py-2 text-right">-{extraDiscount}</p></span>
                        <span className="flex p-2 bg-neutral-50"><p className=" font-semibold w-2/3 py-2 font-md text-left">Shipping Fee </p><p className="w-1/3 font-sm py-2 text-right">60</p></span>
                        <span className="flex p-2 bg-neutral-50"><p className=" font-semibold w-2/3 py-2 font-md text-left">Shipping Discount</p><p className="w-1/3 font-sm py-2 text-right">-30</p></span>
                        <span className="flex p-2 border-y-2 border-dotted border-slate-500 bg-neutral-0"><p className=" font-semibold w-2/3 font-md text-left">Total Amount</p><p className="w-1/3 font-sm text-right">{totalAmount}</p></span>
                    </div>
                    :
                    <div></div>

                }

            </span>
        </div>
    </div>
    :
    <div className="flex flex-row gap-2 w-full justify-center items-center my-16">
        <span>Please </span>
        <Link className="font-semibold text-2xl" to="/signin"> SignIn </Link>
        <span>to continue .</span>
    </div>
}
    
    </>
}

export default Cart;