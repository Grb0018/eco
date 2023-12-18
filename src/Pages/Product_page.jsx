

import { useDispatch } from 'react-redux';
import Header from '../Component/Header';
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { db } from "../firebase";
import { getDocs , collection, where, query} from "firebase/firestore";
import { addMenProduct, addWomenProduct } from "../redux/storeSlice";
import More_product_list from '../Component/More_product_list';
import Current_selected_product from '../Component/Current_selected_product';
import {store} from "../redux/store";
import Similar_product_list from '../Component/Similar_product_list';
import Loading from '../Component/Loading';
import Footer from '../Component/Footer';
const Product_Detail=()=>{
    const[loading,setLoading]=useState(true);
   const [totalcartItems,setTotalcartItems] = useState(store.getState().storeSlice.user[0]?.cart.length);
   const [selected_item,setSelected_item] = useState([]);
   const [loadSimilarProduct,setLoadSimilarProduct]=useState(false);
   const dispatch = useDispatch();
   var {itemId,type} = useParams();
   useEffect(()=>{
    let haveItem=false;
    if(type==="women"){
        if(store.getState().storeSlice?.women.length>0){
            haveItem=true;
        }
    }else if(type==="men"){
        if(store.getState().storeSlice?.men.length>0){
            haveItem=true;
        }
    }
    if(haveItem===false){
        try {
            getDocs(query(collection(db,"men"),where("id","==",itemId))).then(docsnap=>{
                let item=[];
                docsnap.forEach(element => {
                    item.push(element.data())
                });
                setSelected_item([...item]);
                setTimeout(()=>{
                    getDocs(collection(db,"men")).then(docsnap=>{
                        const products=[]
                        docsnap.forEach(element => {
                            products.push(element.data())
                        });
                        dispatch(addMenProduct([...products.filter(item=>item.gender==="men")]));
                        dispatch(addWomenProduct([...products.filter(item=>item.gender==="women")]));
                        setLoadSimilarProduct(true);
                        setLoading(false);
                    })
                },300)
            })
        
        } catch (error) {
            console.log(error)
        }
    }else{
        if(type==="women"){
            setSelected_item(store.getState().storeSlice?.women.filter(item =>{
                if(item.id===itemId) return item
            }))
        }else if(type==="men"){
            setSelected_item(store.getState().storeSlice?.men.filter(item =>{
                if(item.id===itemId) return item
            }))
        }
        setLoadSimilarProduct(true);
        setLoading(false);
    }
   },[itemId])
   useEffect(()=>{
    setTotalcartItems(store.getState().storeSlice.user[0]?.cart.length)
   },[store.getState().storeSlice.user[0]?.cart.length])
    return <div className='relative min-h-screen pb-64'>
        <Header totalcartItems={totalcartItems}/>
        {loading?<Loading />:<Current_selected_product selected_item={selected_item} setTotalcartItems={setTotalcartItems}/>}
        
        {loadSimilarProduct && !loading
        ?<>
        <Similar_product_list type={selected_item[0].type}  products={type==="women"?store.getState().storeSlice?.women:store.getState().storeSlice?.men}  currentId={selected_item[0].id} currentGender={selected_item[0].gender}/>
        <More_product_list item_List={[...store.getState().storeSlice?.men,...store.getState().storeSlice?.women]} selected_item={selected_item}/></>
       :<></>}
              <Footer page={"Home"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
    </div>
 }
 export default Product_Detail;