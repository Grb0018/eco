import { useState } from "react";
import { Link } from 'react-router-dom';
const Current_selected_product=(props)=>{
    const [quantity,setQuantity] = useState(0);
    const [size,setSize] = useState("S");
    return <>
            <div className='mx-4 mt-10 font-semibold text-sm flex flex-row items-center gap-2'>
            <Link to={"/"} className='text-sm'>Home /</Link>
            <Link to={"/men"} className='text-sm'> Men /</Link>
            <span className='text-lg font-semibold'>{props.selected_item[0]?.name}</span>
        </div>
        <div className='flex flex-row gap-10 m-14'>
         <div className=' w-[50%] relative flex items-start mt-3 justify-end'>
         <img src={`${props.selected_item[0]?.images1}`}  className='w-[26rem] mr-5'/>
         </div>
         <div className=' w-[45%] relative flex flex-col items-start justify-start'>
            <h2 className='my-2 text-xl'>{props.selected_item[0]?.name}</h2>
            <h3 className='font-bold text-3xl my-1'>{props.selected_item[0]?.company}</h3>
            <br/>
            <p className='text-md mt-4 font-bold'>PRODUCT DETAILS :</p>
            <p className='w-[70%]'>{props.selected_item[0]?.details}</p>
            <p className='text-md mt-4 font-bold'>MATERIAL :</p>
            <p className='w-[70%]'>{props.selected_item[0]?.material}</p>
            <br/>
            <span className='flex flex-row justify-center items-center gap-2 mt-4'>
            <p className='font-bold text-md'>Price.</p>
            <p className='ml-5 text-md'>₹{props.selected_item[0]?.price}</p>
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
            
            <span className='flex items-center'>
            <button className='btn hover:bg-slate-600 hover:text-slate-200 w-8 mx-1  text-[1.4rem]' onClick={()=>{setQuantity(quantity===0?0:quantity-1)}}>-</button>
            <p className='text-xl font-semibold'>{quantity}</p>
            <button className='btn hover:bg-slate-600 hover:text-slate-200 w-8 mx-1 text-[1.2rem]' onClick={()=>{setQuantity(quantity+1)}}>+</button></span>
            </span>
            <span className='flex gap-6 my-4'>
               <button className=' bg-orange-600 text-slate-100 font-semibold px-4 py-1' ><i class="fi fi-ts-bags-shopping"></i> Add Product <i className="fi fi-tr-cart-shopping-fast"></i></button>
               <button className='px-4 py-1 bg-slate-800 text-gray-100'><i class="fi fi-rr-heart"></i>Add Wishlist</button>
            </span>
         </div>
        </div>
    </>

}
export default Current_selected_product;