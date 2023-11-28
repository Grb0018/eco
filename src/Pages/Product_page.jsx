

import { useDispatch, useSelector } from 'react-redux';
import Header from '../Component/Header';
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { db } from "../firebase";
import { getDocs , collection} from "firebase/firestore";
import { addMenProduct } from "../redux/storeSlice";
import More_product_list from '../Component/More_product_list';
import Current_selected_product from '../Component/Current_selected_product';
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
        <Current_selected_product selected_item={selected_item} />
        <More_product_list item_List={all_men_product} selected_item={selected_item}/>
    </div>
 }
 export default Product_Detail;