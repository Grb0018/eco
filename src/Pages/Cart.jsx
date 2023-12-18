
import { useState, useEffect } from "react";
import { addMenProduct, addToCart, addToOrder, addWomenProduct } from "../redux/storeSlice";
import { doc, getDoc, getDocs, updateDoc,collection } from 'firebase/firestore';
import { addUser } from '../redux/storeSlice';
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import { store } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../Component/Header";
import More_product_list from "../Component/More_product_list";
import useRazorpay from "react-razorpay";
import { useRef } from "react";
import Loading from "../Component/Loading";
import Footer from "../Component/Footer";
const Cart = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [totalcartItems, setTotalcartItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [extraDiscount, setExtraDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [cartItem, setCartItem] = useState([]);
    const [billDetail, setbillDetail] = useState(false);
    const user = useSelector(state => state.storeSlice.user);
    const [Razorpay] = useRazorpay();
    const bill = useRef();
    const userAuthcheckingDone = store.getState().storeSlice.checked;
    const men_product = store.getState().storeSlice.men;
    const women_product = store.getState().storeSlice.women;
    useEffect(() => {
        if (userAuthcheckingDone) {
            setLoading(false);
        }
    }, [userAuthcheckingDone])

    useEffect(() => {
        if (user.length >= 0) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    if (store.getState()?.storeSlice?.user.length > 0) {
                        setCartItem(store.getState()?.storeSlice?.user[0].cart);
                    } else {
                        getDoc(doc(db, "users", user.uid)).then(snapshot => {
                            dispatch(addUser([snapshot.data()]));
                            console.log(snapshot.data());
                            setCartItem(snapshot.data().cart);
                        })
                    }
                    setTotalcartItems(cartItem.length);
                } else {
                    console.log("no user")
                }
            })
        } else {
            if (store.getState()?.storeSlice?.user.length > 0) {
                setCartItem(store.getState()?.storeSlice?.user[0].cart);
            }
        }

        //MEN AND WOMEN PRODUCTS GET //////////

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
            })
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
        var check = window.confirm("Are You Sure ? You want to remove.")
        if (check) {
            setLoading(true);
            var newList = cartItem.filter((item) => {
                if (item !== data) {
                    return item;
                }
            });
            updateDoc(doc(db, "users", store.getState()?.storeSlice?.user[0].uid), { cart: newList }).then(snapshot => {
                dispatch(addToCart([...newList]));
                setCartItem([...newList]);
                setLoading(false);
            }).catch(error => {console.log("Error! Try again.");setLoading(false)})
        }
    }

    const quantityUpdate = (item, type) => {
        
        if (type === "minus" && parseInt(item.quantity) > 1) {
            cartItem.forEach(cartProduct => {
                if (cartProduct.id === item.id && cartProduct.size === item.size) {
                    setLoading(true);
                    let newData = Object.assign({}, cartProduct);
                    newData.quantity = parseInt(item.quantity) - 1;
                    let newArray = cartItem.filter(filter_item => {
                        if (filter_item.id === item.id && filter_item.size !== item.size) {
                            return filter_item
                        } else if (filter_item.id !== item.id) {
                            return filter_item
                        }
                    });
                    newArray.push(newData);
                    updateDoc(doc(db, "users", store.getState()?.storeSlice?.user[0].uid), {
                        cart: newArray
                    }).then(val => { dispatch(addToCart(newArray));alert("Added to cart."); setCartItem([...newArray]);setLoading(false); }).catch(error => {console.log("Error! Try again.");setLoading(false)})
                }
            })
        } else if (type == "plus") {
            cartItem.forEach(cartProduct => {
                if (cartProduct.id === item.id && cartProduct.size === item.size) {
                    setLoading(true);
                    let newData = Object.assign({}, cartProduct);
                    newData.quantity = parseInt(item.quantity) + 1;
                    let newArray = cartItem.filter(filter_item => {
                        if (filter_item.id === item.id && filter_item.size !== item.size) {
                            return filter_item
                        } else if (filter_item.id !== item.id) {
                            return filter_item
                        }
                    });
                    newArray.push(newData);
                    updateDoc(doc(db, "users", store.getState()?.storeSlice?.user[0].uid), {
                        cart: newArray
                    }).then(val => { dispatch(addToCart(newArray));alert("Added to cart."); setCartItem([...newArray]);setLoading(false); }).catch(error => {console.log("Error! Try again.");setLoading(false)})
                }
            })

        }
    }

    const trypay = async () => {
        if (user[0].city === "" || user[0].pincode === "" || user[0].country === "" || user[0].state === "") {
            alert("Please fill your details in user page.")
        } else {
            billDetails("close");
            const options = {
                key: process.env.REACT_APP_razorpay_key_id,
                amount: (parseInt(totalAmount) * 100).toString(),
                currency: "INR",
                name: "CartY",
                description: "Test Transaction",
                handler: function (response) {
                    let orderData = {
                        orderId: response.razorpay_payment_id,
                        items: user[0].cart,
                        priceDetails: { totalPrice: totalPrice, extraDiscount: extraDiscount, shippingFee: 60, shippingDiscount: 30 },
                        purchaseTime: new Date(),
                        shippingAddress: `${user[0].city} ${user[0].state} ${user[0].pincode} ${user[0].country}`
                    }
                    var orderList = [...store.getState().storeSlice.orders];
                    orderList.push(orderData);
                    updateDoc(doc(db, "users", user[0].uid), {
                        orders: orderList
                    }).then(val => {
                        dispatch(addToOrder(orderData));
                        updateDoc(doc(db, "users", user[0].uid), {
                            cart: []
                        }).then(val2 => {
                            dispatch(addToCart([]));
                            setCartItem([]);
                        })

                    })
                },
                prefill: {
                    name: user[0].name,
                    email: user[0].email,
                },
                notes: {
                    address: `${user[0].city} ${user[0].state} ${user[0].pincode} ${user[0].country}`,
                },
                theme: {
                    color: "#3399cc",
                },
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
        }
    }
    const billDetails = (type) => {
        if (billDetail === false && type === "open") {
            bill.current.style.transform = "translateY(-5vh)";
            setbillDetail(true);
        } else if (type === "close") {
            bill.current.style.transform = "translateY(-150vh)";
            setbillDetail(false);
        }
    }

    return <div className="relative min-h-screen pb-64">
        <Header page="Cart" totalcartItems={store.getState().storeSlice.user[0]?.cart.length} />
        {loading ? <Loading /> : <></>}
        {user.length > 0  ?
            <>
                {cartItem.length > 0 ?
                    <>
                        <div className="flex flex-col m-10 p-10 md:p-2 md:my-2 md:mx-1 md:mt-12 md:w-full mt-6">
                            <p className="text-left text-2xl text-slate-950 font-semibold md:text-lg">Your Cart <i className="fi fi-rr-cart-arrow-down"></i></p>
                            <div className="flex flex-row relative md:flex-col">
                                <span className="flex flex-col p-8 md:p-1 w-2/3 md:w-full relative ">
                                    <p className="  p-2 md:p-0 font-semibold border-b-2 border-slate-950 rounded-sm">Items</p>
                                    {cartItem.map((item, i) => {
                                        return <div className="flex flex-row p-4 md:p-0 border-b-2 bg-white rounded-xl my-2" key={i}>
                                            <p className="m-2 md:m-0.5 w-[1.8rem]">{i + 1}.</p>
                                            <Link to={`/${item.gender}/${item.id}`} className="flex justify-start items-center mt-2 mr-1 bg-zinc-100 px-2 rounded-sm">
                                                <img src={item.images1} className=" max-w-[5rem] md:max-w-[3rem] rounded-md h-auto border-2 border-white" />

                                            </Link>
                                            <span className="flex flex-col px-1 w-9/12 md:w-full">
                                                <Link to={`/${item.gender}/${item.id}`} className=" font-bold px-1 text-md md:text-sm">{item.company}</Link>
                                                <Link to={`/${item.gender}/${item.id}`}>  <p className=" font-semibold p-1 text-sm md:text-xs">{item.name}</p></Link>
                                                <p className="p-1 text-xs md:hidden"> {item.details}</p>
                                                <span className=" text-sm p-1 flex flex-row items-center">
                                                    <span className="font-semibold">Quantity :</span>
                                                    <span className="flex gap-2 flex-row mx-2 justify-center items-center">
                                                        <span className=" w-6 text-center bg-gray-600 text-white p-1 flex-1 cursor-pointer select-none" onClick={(e) => { quantityUpdate(item, "minus") }}> - </span>
                                                        <span className="flex-1 items-center justify-center text-center h-full w-6">{item.quantity}</span>
                                                        <span className=" w-6  text-center bg-gray-600 text-white p-1 flex-1 cursor-pointer select-none" onClick={(e) => { quantityUpdate(item, "plus") }}> + </span>
                                                    </span>
                                                </span>
                                                <p className="text-sm p-1 md:py-0 font-semibold">Size : {item.size}</p>
                                                <p className="text-sm p-1 md:py-0 font-semibold">Price : {item.price}</p>
                                            </span>
                                            <i className="fi fi-ss-trash p-1 cursor-pointer w-1/10" onClick={() => { removeItem(item) }}></i>


                                        </div>
                                    })}
                                </span>
                                <span className="flex flex-col p-8 w-1/3 relative md:w-full md:p-1">
                                    <p className="  p-2 font-semibold border-b-2 border-slate-950 rounded-sm">Price</p>
                                    {cartItem.length > 0 ?
                                        <div className="my-2">
                                            <span className="flex p-2 bg-neutral-50 text-sm"><p className=" w-2/3 py-2 md:py-0.5 text-left">Total Price</p><p className="w-1/3 font-sm py-2 md:py-0.5 text-right font-semibold">Rs. {totalPrice}</p></span>
                                            <span className="flex p-2 bg-neutral-50 text-sm"><p className=" w-2/3 py-2 md:py-0.5 text-left">Extra Discount (10 %)</p><p className="w-1/3 font-sm py-2 md:py-0.5 text-right font-semibold">Rs.  -{extraDiscount}</p></span>
                                            <span className="flex p-2 bg-neutral-50 text-sm"><p className=" w-2/3 py-2 md:py-0.5 text-left">Shipping Fee </p><p className="w-1/3 font-sm py-2 md:py-0.5 text-right font-semibold">Rs. 60</p></span>
                                            <span className="flex p-2 bg-neutral-50 text-sm"><p className=" w-2/3 py-2 md:py-0.5 text-left">Shipping Discount</p><p className="w-1/3 font-sm py-2 md:py-0.5 text-right font-semibold">Rs. -30</p></span>
                                            <span className="flex p-2 border-y-2 border-dotted border-slate-500 bg-neutral-0"><p className=" font-semibold w-2/3 font-md text-left">Total Amount</p><p className="w-1/3 font-sm text-right font-semibold">Rs.    {totalAmount}</p></span>
                                            <button className=" w-full h-10 my-4 px-2 py-1 text-center bg-slate-700 text-white font-semibold" onClick={() => { billDetails("open") }}>Click to Order</button>
                                        </div>
                                        :
                                        <div></div>
                                    }
                                </span>
                            </div>
                            <div className="fixed top-[30%] w-80 left-[40%] sm:left-[8%] md:left-44 p-4 pt-1 pb-8 bg-white shadow-xl flex flex-col duration-500 translate-y-[-150vh]" ref={bill}>
                                <span className="flex  justify-end items-end w-full">
                                    <i className="fi fi-ts-circle-xmark py-2 text-rose-700 cursor-pointer" onClick={() => { billDetails("close") }}></i>
                                </span>
                                <span className="bg-slate-700 text-white text-center flex items-end justify-center">
                                    <span className="p-2">Bill <i className="fi fi-sr-receipt text-slate-300 text-xs "></i> </span>
                                </span>
                                <section className="flex flex-col my-2 w-full text-sm">
                                    <span>
                                        <span className="font-semibold">Name : </span>
                                        <span>{user[0].name}</span>
                                    </span>
                                    <span>
                                        <span className="font-semibold">Mail : </span>
                                        <span>{user[0].email}</span>
                                    </span>
                                </section>
                                <span className="border-b-2 border-slate-500 text-slate-800 font-semibold text-sm mt-3">Shipping Address <i className="fi fi-sr-home text-sm"></i></span>
                                <span className="text-xs py-2">
                                    {`${user[0].city} , ${user[0].state}`}
                                    <br />
                                    {user[0].pincode}
                                    <br />
                                    {user[0].country}
                                </span>
                                <span className="flex flex-col">
                                    <span className="border-b-2 border-slate-500 text-slate-800 font-semibold text-sm w-full mt-3">Total Amount , </span>
                                    <span><span className="font-semibold">Rs . {totalAmount} /- </span><span className="text-xs">Only</span></span>
                                </span>
                                <button className="p-2 bg-green-100 text-sm font-semibold my-2 mt-6 text-green-800" onClick={() => { trypay() }}>Proceed to Payment</button>
                                <Link to={"/user"} className="w-full p-2 bg-slate-300 text-sm font-semibold my-2 mb-0 text-slate-800 text-center">Edit Shipping Address</Link>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="flex flex-row gap-2 w-full justify-center items-center my-16 md:my-2 md:text-sm md:flex-wrap md:px-10 md:mt-10">
                            <span>Its look like you havn't check anything.</span>

                            <span>Lets Check </span>
                            <Link className="font-semibold text-2xl" to="/"> CartY </Link>
                            <span>Dresses .</span>
                        </div>
                        {men_product.length > 0
                        ? <More_product_list item_List={[...men_product, ...women_product]} selected_item={[men_product[0]]} />
                        : <></>
                    }
                    </>
                }
            </>

            : <>{!loading ?
                <div className="flex flex-row gap-2 w-full justify-center items-center my-16">
                    <span>Please </span>
                    <Link className="font-semibold text-2xl" to="/signin"> SignIn </Link>
                    <span>to continue .</span>
                </div>
                : <></>}</>

        }
          <Footer page={"Home"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
    </div>
}

export default Cart;