import { useState, useEffect } from "react";
import { addMenProduct, addToCart, addToWatchList, addToWishList, addWomenProduct } from "../redux/storeSlice";
import { doc, getDoc, getDocs, updateDoc,collection } from 'firebase/firestore';
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { store } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Component/Header";
import More_product_list from "../Component/More_product_list";
import Loading from "../Component/Loading";
import Footer from "../Component/Footer";
const WishList = () => {
    const [loading, setLoading] = useState(store.getState().storeSlice.checked);
    const dispatch = useDispatch();
    const [wishlistItem, setwishlistItem] = useState([]);
    const user = useSelector(state => state.storeSlice.user);
    const userAuthcheckingDone = store.getState().storeSlice.checked;
    const men_product = store.getState().storeSlice.men;
    const women_product = store.getState().storeSlice.women;
    useEffect(() => {
        if (userAuthcheckingDone) {
            setLoading(false);
        }
    }, [userAuthcheckingDone])

    useEffect(()=>{
        if(user.length>0){
            setwishlistItem([...store.getState().storeSlice.user[0].wishlist]);
        }
    },[user])

    useEffect(()=>{
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
    },[men_product.length,women_product.length,dispatch])

    const removeItem = (data,type) => {
        if(type==="cart"){
            setLoading(true);
                var newList = wishlistItem.filter((item) => {
                    if (item !== data) {
                        return item;
                    }
                });
                updateDoc(doc(db, "users", store.getState()?.storeSlice?.user[0].uid), { wishlist: newList }).then(snapshot => {
                    dispatch(addToWishList([...newList]));
                    setwishlistItem([...newList]);
                    setLoading(false);
                }).catch(error => {console.log("Error! Try again.");setLoading(false)})
        }else if(type==="remove"){
            var check = window.confirm("Are You Sure ? You want to remove.")
            if (check) {
                setLoading(true);
                var newList = wishlistItem.filter((item) => {
                    if (item !== data) {
                        return item;
                    }
                });
                updateDoc(doc(db, "users", store.getState()?.storeSlice?.user[0].uid), { wishlist: newList }).then(snapshot => {
                    dispatch(addToWishList([...newList]));
                    setwishlistItem([...newList]);
                    setLoading(false);
                    alert("Added to Cart .")
                }).catch(error => {console.log("Error! Try again.");setLoading(false)})
            }
        }
    }

    const add_to_cart=(data)=>{
        if(store.getState()?.storeSlice?.user.length>0){
            let cartItem = store.getState()?.storeSlice?.user[0].cart;
            var duplicateItem=false;
            setLoading(true);
            if(cartItem.length !== 0){
             cartItem.forEach(item => {
                if(item.id===data.id && item.size === data.size){
                      let newData = Object.assign({},item);
                      newData.quantity += parseInt(data.quantity);
                      newData.size = data.size;
                      let newArray = cartItem.filter(filter_item=>{
                          if(filter_item !== item){
                            return filter_item
                          }
                      });
                      newArray.push(newData);
                      updateDoc(doc(db,"users",store.getState()?.storeSlice?.user[0].uid),{
                        cart:newArray
                      }).then(val=>{dispatch(addToCart(newArray));removeItem(data,"cart")}).catch(error=>alert("Error! Try again."))
                      duplicateItem=true;
                }
                });
                if(duplicateItem===false){
                    let newArray = [...cartItem];
                    let newData = Object.assign({},data)
                    newData.quantity = data.quantity;
                    newData.size = data.size;
                    newArray.push(newData);
                    dispatch(addToCart(newArray));
                    updateDoc(doc(db,"users",store.getState()?.storeSlice?.user[0].uid),{
                        cart:newArray
                      }).then(val=>{dispatch(addToCart(newArray));removeItem(data,"cart")}).catch(error=>alert("Error! Try again."))
                }
            }else{
                let newArray = [...cartItem];
                if(duplicateItem===false){
                    let newData = Object.assign({},data)
                    newData.quantity = data.quantity;
                    newData.size = data.size;
                    newArray.push(newData);
             }
             dispatch(addToCart(newArray));
             updateDoc(doc(db,"users",store.getState()?.storeSlice?.user[0].uid),{
                cart:newArray
              }).then(val=>{dispatch(addToCart(newArray));removeItem(data,"cart")}).catch(error=>alert("Error! Try again."))
            }
        }
    }

    return <div className="relative min-h-screen pb-64">
        <Header totalcartItems={store.getState().storeSlice.user[0]?.cart.length} />
        {loading ? <Loading /> : <></>}
        {user.length > 0  ?
            <>
                {wishlistItem.length > 0 ?
                    <>
                        <div className="flex flex-col m-10 p-10 md:p-2 md:my-2 md:mx-1 md:mt-12 md:w-full mt-6">
                            <p className="text-left text-2xl text-slate-950 font-semibold md:text-lg">Your Wishlist <i className="fi fi-rr-cart-arrow-down"></i></p>
                            <div className="flex flex-row justify-center relative md:flex-col">
                                <span className="flex flex-col p-8 md:p-1 w-2/3 md:w-full relative ">
                                    <p className="  p-2 md:p-0 font-semibold border-b-2 border-slate-950 rounded-sm">Items</p>
                                    {wishlistItem.map((item, i) => {
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
                                                         <span className="flex-1 items-center justify-center text-center h-full w-6">{item.quantity}</span>
                                                         </span>
                                                </span>
                                                <p className="text-sm p-1 md:py-0 font-semibold">Size : {item.size}</p>
                                                <p className="text-sm p-1 md:py-0 font-semibold">Price : {item.price}</p>
                                            </span>
                                            <span className="flex flex-col items-center justify-between">
                                            <i className="fi fi-ss-trash p-1 cursor-pointer w-1/10 " onClick={() => { removeItem(item,"remove") }}></i>
                                            <i className="fi fi-sr-shopping-cart p-2 bg-slate-300 rounded-full cursor-pointer hover:text-green-700 hover:bg-green-200 duration-300" onClick={(e)=>{add_to_cart(item)}}>+</i>
                                            </span>
                                        </div>
                                    })}
                                </span>
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
          <Footer totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
    </div>
}

export default WishList;