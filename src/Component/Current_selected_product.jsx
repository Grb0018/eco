import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../redux/store';
import { addToCart, addToWishList } from "../redux/storeSlice";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Thumb_view from "./thumb_view";
import Loading from "./Loading";
const Current_selected_product=(props)=>{
    const[loading,setLoading]=useState(false);
    const [quantity,setQuantity] = useState(0);
    const [size,setSize] = useState("S");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state=>state.storeSlice.user);
    const add_to_cart=(data)=>{
        if(store.getState()?.storeSlice?.user.length===0){
        alert("Please Sign in to continue")
        navigate("/signin");
        }else if(store.getState()?.storeSlice?.user.length>0 && quantity>0){
            let cartItem = store.getState()?.storeSlice?.user[0].cart;
            var duplicateItem=false;
            setLoading(true);
            if(cartItem.length !== 0){
             cartItem.forEach(item => {
                if(item.id===data.id && item.size === size){
                      let newData = Object.assign({},item);
                      newData.quantity += parseInt(quantity);
                      newData.size = size;
                      let newArray = cartItem.filter(filter_item=>{
                          if(filter_item !== item){
                            return filter_item
                          }
                      });
                      newArray.push(newData);
                      updateDoc(doc(db,"users",store.getState()?.storeSlice?.user[0].uid),{
                        cart:newArray
                      }).then(val=>{dispatch(addToCart(newArray));props.setTotalcartItems(newArray.length);setLoading(false);alert("Added to Cart.")}).catch(error=>{alert("Error! Try again.");setLoading(false);})
                      duplicateItem=true;
                }
                });
                if(duplicateItem===false){
                    let newArray = [...cartItem];
                    let newData = Object.assign({},data)
                    newData.quantity = quantity;
                    newData.size = size;
                    newArray.push(newData);
                    dispatch(addToCart(newArray));
                    updateDoc(doc(db,"users",store.getState()?.storeSlice?.user[0].uid),{
                        cart:newArray
                      }).then(val=>{dispatch(addToCart(newArray));props.setTotalcartItems(newArray.length);setLoading(false);alert("Added to Cart.")}).catch(error=>{alert("Error! Try again.");setLoading(false)})
                }
            }else{
                let newArray = [...cartItem];
                if(duplicateItem===false){
                    let newData = Object.assign({},data)
                    newData.quantity = quantity;
                    newData.size = size;
                    newArray.push(newData);
             }
             dispatch(addToCart(newArray));
             updateDoc(doc(db,"users",store.getState()?.storeSlice?.user[0].uid),{
                cart:newArray
              }).then(val=>{dispatch(addToCart(newArray));props.setTotalcartItems(newArray.length);setLoading(false);alert("Added to Cart.")}).catch(error=>{alert("Error! Try again.");setLoading(false)})
            }
        }
    };

    const get_percentage=(price,actual_price)=>{
        let diff = parseInt(actual_price)-parseInt(price);
        return `${parseInt((diff/parseInt(actual_price))*parseInt(100))}% off`;
    }

    const setToWishList=(data)=>{
        if(store.getState()?.storeSlice?.user.length===0){
            alert("Please Sign in to continue")
            navigate("/signin");
            }else if(store.getState()?.storeSlice?.user.length>0 && quantity>0){ 
                setLoading(true);
                let wishList = [...store.getState().storeSlice.user[0].wishlist];
                let haveItem=false;
                wishList.forEach(item=>{
                    if(item.id===data.id && item.size === size){
                        haveItem=true;
                    }
                });
                if(haveItem===false){
                    let newData = Object.assign({},data);
                      newData.quantity = parseInt(quantity);
                      newData.size = size;
                    wishList.push(newData);
                }
                updateDoc(doc(db,"users",user[0].uid),{wishlist:[...wishList]}).then(val=>{
                    dispatch(addToWishList([...wishList]));
                    setLoading(false);
                    alert("Successfully Added to Wishlist.");
                }).catch(error=>{setLoading(false);alert("Error ! Please try again.")})
               
            }
    }

    return <>
    {loading?<Loading />:<></>}
            <div className='mx-4 mt-10 font-semibold text-sm flex flex-row items-center gap-2 md:text-md md:flex-wrap'>
            <Link to={"/"} className='text-xs'>Home /</Link>
            {props.selected_item[0]?.gender==="men"?
            <Link to={"/men"} className='text-xs'> Men /</Link>
            : <Link to={"/women"} className='text-xs'> Women /</Link>
            }
           
            <span className='text-sm font-semibold'>{props.selected_item[0]?.name}</span>
        </div>
        <div className='flex flex-row gap-10 m-14 md:flex-col md:mx-2 md:my-2'>
         <div className=' w-[50%] md:w-[98%] relative flex items-start mt-3 md:mt-1 justify-end'>
            {props.selected_item.length>0
            ?<Thumb_view imageList={[props.selected_item[0]?.images1,props.selected_item[0]?.images2,props.selected_item[0]?.images3]}/>
            :<></>
            }
            
         {/* <img src={`${props.selected_item[0]?.images1}`}  className='w-[26rem] mr-5'/> */}
         </div>
         <div className=' w-[45%] md:w-full relative flex flex-col items-start justify-start'>
            <h2 className='font-bold text-3xl my-1 md:text-lg'>{props.selected_item[0]?.company}</h2>
            <h3 className='my-2 text-lg md:text-sm md:mb-2'>{props.selected_item[0]?.name}</h3>
          
            <p className='text-md mt-4 font-bold md:text-sm md:my-2'>PRODUCT DETAILS :</p>
            <p className='w-[70%] text-sm md:text-sm md:mb-2'>{props.selected_item[0]?.details}</p>
            <p className='text-md mt-4 font-bold md:text-sm md:my-2'>MATERIAL :</p>
            <p className='w-[70%] text-sm md:text-sm md:mb-2'>{props.selected_item[0]?.material}</p>
            <p className='text-md mt-4 font-bold md:text-sm md:my-2'>Size and fit :</p>
            <p className='w-[70%] text-sm md:text-sm md:mb-2'>{props.selected_item[0]?.size_and_fit}</p>
            <span className="flex flex-col gap-2 items-start mt-4 w-44">
            <p className='text-md  font-bold md:text-sm md:my-2'>Type :</p>
            <p className='w-[70%] text-sm md:text-sm md:mb-2'>{props.selected_item[0]?.type.toUpperCase()} ( {props.selected_item[0]?.gender.toUpperCase()} )</p>
            </span>
            
            <span className='flex flex-row justify-center items-center gap-2 mt-4'>
            <p className='font-bold text-md md:text-sm md:my-2'>Price.</p>
            <p className='ml-5 text-lg md:text-md md:mb-2'>₹{props.selected_item[0]?.price} <s className="ml-2 text-slate-800">{props.selected_item[0]?.actual_price}</s> <span className="font-semibold text-sm">({get_percentage(props.selected_item[0]?.price,props.selected_item[0]?.actual_price)})</span></p>
            </span>
            <span className='flex flex-row justify-center items-center gap-2 mt-4'>
            <p className='text-md font-bold md:text-sm md:my-2'>Select Size :</p>
            <select className='font-bold text-sm bg-purple-100 p-2' onChange={(e)=>{setSize(e.currentTarget.value)}}>
               <option value="S">S</option>
               <option value="M">M</option>
               <option value="L">L</option>
               <option value="XL">XL</option>
            </select>
            </span>
            <span className='flex flex-row justify-center items-center gap-2 mt-4'>
            <p className='font-bold text-md md:text-sm md:my-2'>Quantity : </p>
            
            <span className='flex items-center'>
            <button className='btn hover:bg-slate-600 hover:text-slate-200 w-8 mx-1  text-[1.4rem]' onClick={()=>{setQuantity(quantity===0?0:quantity-1)}}>-</button>
            <p className='text-xl font-semibold'>{quantity}</p>
            <button className='btn hover:bg-slate-600 hover:text-slate-200 w-8 mx-1 text-[1.2rem]' onClick={()=>{setQuantity(quantity+1)}}>+</button></span>
            </span>
            <span className='flex gap-6 my-4 justify-evenly flex-row md:w-full'>
               <button className=' bg-cyan-950 text-white font-semibold px-8 py-3 hover:shadow-md hover:shadow-slate-600 md:text-sm' onClick={()=>{add_to_cart(props.selected_item[0])}} > Add To Cart <i className="fi fi-tr-cart-shopping-fast"></i></button>
               <button className='px-4 py-1  bg-slate-200 text-slate-900 hover:shadow-md md:text-sm md:px-6' onClick={()=>{setToWishList(props.selected_item[0])}}><i className="fi fi-rr-heart"></i>Add Wishlist</button>
            </span>
         </div>
        </div>
    </>

}
export default Current_selected_product;