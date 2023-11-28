

import { useDispatch, useSelector } from 'react-redux';
import Header from '../Component/Header';
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { db } from "../firebase";
import { getDocs , collection} from "firebase/firestore";
import { addMenProduct } from "../redux/storeSlice";
import { Link } from 'react-router-dom';
const Product_Detail=()=>{
   const [quantity,setQuantity] = useState(0);
   const [size,setSize] = useState("S");
   const [totalcartItems,setTotalcartItems] = useState(0);
   const [selected_item,setSelected_item] = useState([]);
   const dispatch = useDispatch();
   var all_men_product = useSelector(state => state.storeSlice.men);
   var {itemId} = useParams();

   useEffect(()=>{
    if(all_men_product.length<1){
        try {
            getDocs(collection(db,"men")).then(docsnap=>{
                const products=[]
                docsnap.forEach(element => {
                    products.push(element.data())
                });
                dispatch(addMenProduct([...products]));
                setSelected_item(products.filter(item =>{
                    if(item.id===itemId) return item
                }))
            })
            console.log(selected_item[0])
        } catch (error) {
            console.log(error)
        }
    }else{
        setSelected_item(all_men_product.filter(item =>{
            if(item.id===itemId) return item
        }))
        console.log(selected_item[0])
    }
   },[])

   



//    const aaddToCart=(data)=>{
//      let cartItem = store.getState()?.ReduxStore?.cart;
//      var duplicateItem=false;
//      if(cartItem.length != 0){
//       cartItem.forEach(item => {
//          if(item.name===data.name){
//                let newData = Object.assign({},item);
//                newData.quantity += parseInt(quantity);
//                newData.size = size;
//                let newArray = cartItem.filter(filter_item=>{
//                    if(filter_item.name != data.name){
//                      return filter_item
//                    }
//                });
//                newArray.push(newData);
//                dispatch(addToCart(newArray));
//                duplicateItem=true;
//                setTotalcartItems(store.getState()?.ReduxStore?.cart.length);
//          }
//          });
//          if(duplicateItem===false){
//              let newArray = [...cartItem];
//              let newData = Object.assign({},data)
//              newData.quantity = quantity;
//              newData.size = size;
//              newArray.push(newData);
//              dispatch(addToCart(newArray));
//              setTotalcartItems(store.getState()?.ReduxStore?.cart.length);
//          }
//      }else{
//          let newArray = [...cartItem];
//          if(duplicateItem===false){
//              let newData = Object.assign({},data)
//              newData.quantity = quantity;
//              newData.size = size;
//              newArray.push(newData);
//       }
//             dispatch(addToCart(newArray));
//             setTotalcartItems(store.getState()?.ReduxStore?.cart.length);
//      }

//    };

    return <div>
        <Header totalcartItems={totalcartItems}/>
        <div className='mx-4 mt-10 font-semibold text-sm'>Home / Men / {selected_item[0]?.name}</div>
        <div className='flex flex-row gap-10 m-14'>
         <div className=' w-[50%] relative flex items-start mt-3 justify-end'>
         <img src={`${selected_item[0]?.images1}`}  className='w-[26rem] mr-5'/>
         </div>
         <div className=' w-[45%] relative flex flex-col items-start justify-start'>
            <h2 className='my-2 text-xl'>{selected_item[0]?.name}</h2>
            <h3 className='font-bold text-3xl my-1'>{selected_item[0]?.company}</h3>
            <br/>
            <p className='text-md mt-4 font-bold'>PRODUCT DETAILS :</p>
            <p className='w-[70%]'>{selected_item[0]?.details}</p>
            <p className='text-md mt-4 font-bold'>MATERIAL :</p>
            <p className='w-[70%]'>{selected_item[0]?.material}</p>
            <br/>
            <span className='flex flex-row justify-center items-center gap-2 mt-4'>
            <p className='font-bold text-md'>Price.</p>
            <p className='ml-5 text-md'>₹{selected_item[0]?.price}</p>
            </span>
            <span className='flex flex-row justify-center items-center gap-2 mt-4'>
            <p className='text-md font-bold'>Select Size :</p>
            <select className='font-bold text-sm bg-slate-200 p-2' onChange={(e)=>{setSize(e.currentTarget.value)}}>
               <option value="S">S</option>
               <option value="M">M</option>
               <option value="L">L</option>
               <option value="XL">XL</option>
            </select>
            </span>
            <span className='flex flex-row justify-center items-center gap-2 mt-4'>
            <p className='font-bold text-md'>Quantity : </p>
            <p className='ml-2 text-md'>{quantity}</p>
            <span className='flex gap-1'><button className='btn hover:bg-slate-900 text-[1.4rem]' onClick={()=>{setQuantity(quantity-1)}}>-</button><button className='btn hover:bg-slate-900 text-[1.2rem]' onClick={()=>{setQuantity(quantity+1)}}>+</button></span>
            </span>
            <span className='flex gap-6 my-4'>
               <button className=' bg-orange-200 font-semibold btn' ><i class="fi fi-ts-bags-shopping"></i> Add Product</button>
               <button className='btn bg-blue-950 text-gray-100'><i class="fi fi-rr-heart"></i>Add Wishlist</button>
            </span>
         </div>
        </div>
        <div className='my-4 '>
            <hr />
            <span className='px-4 my-5 block font-semibold'>More Men's Product</span>
            <div className="flex min-w-full  overflow-y-hidden relative px-10 flex-row gap-4 justify-evenly">
        {
            all_men_product.map((item,i)=>{
                if(i<5){
                    return <>
                    <Link to={"/product/"+item.id} >
                    <div className=" relative min-w-[14rem] bg-cover h-72 " style={{backgroundImage: `url("${item.images1}")`}} >
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
 }
 export default Product_Detail;