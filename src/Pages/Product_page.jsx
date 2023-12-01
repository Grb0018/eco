

import { useDispatch, useSelector } from 'react-redux';
import Header from '../Component/Header';
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { db } from "../firebase";
import { getDocs , collection} from "firebase/firestore";
import { addMenProduct } from "../redux/storeSlice";
import More_product_list from '../Component/More_product_list';
import Current_selected_product from '../Component/Current_selected_product';
import {store} from "../redux/store";
import { addUser } from "../redux/storeSlice";
const Product_Detail=()=>{

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
   },[itemId])




  

    return <div>
        <Header totalcartItems={totalcartItems}/>
        <Current_selected_product selected_item={selected_item} />
        <More_product_list item_List={all_men_product} selected_item={selected_item}/>
    </div>
 }
 export default Product_Detail;