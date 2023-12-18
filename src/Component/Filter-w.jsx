import { useEffect, useRef, useState } from "react";

const FilterW = (props) => {
    const {products, setkurtas, setjacket , setkurtasCollection , setjacketCollection , kurtasCollection, jacketCollection}=props;
    const [show,setShow]=useState(false);
    const [kurtas,setFilterKurtas]=useState(false);
    const [jackets,setFilterJackets]=useState(false);
    const filter = useRef();
    const [brands,setBrands]=useState([]);
    const [price_l_to_h,setPrice_l_to_h]=useState(false);
    const [price_h_to_l,setPrice_h_to_l]=useState(false);
    const [bransList,setBrandlist]=useState([]);


    useEffect(()=>{
        if(show){
                filter.current.style.width="12rem";
                setTimeout(()=>{
                if(window.innerHeight<430){
                    filter.current.style.height="250px"; 
                }else{
                    filter.current.style.height="30rem";
                }
                filter.current.style.overflow="hidden auto";
                },500)
            
        }else{
            filter.current.style.height="3rem";
            setTimeout(()=>{
            filter.current.style.width="2.65rem";
            filter.current.style.overflow="hidden";
            },500)
        }
    },[show,filter])

    useEffect(()=>{
        let array=[];
        products.forEach(item=>{
            let haveitem=false;
            array.forEach(child=>{
                 if(child.brand === item.company){
                    child.no = child.no+1;
                    haveitem=true;
                 }
            });
            if(haveitem===false){
                array.push({brand:item.company,no:1})
            } 
        })
        setBrands(array);
    },[products])

    const handleCategory=(e,type)=>{
        if(type==="kurtas"){
            setFilterKurtas(e.target.checked);
            setkurtas(e.target.checked);
            setjacket(jackets);
        }else if(type==="jacket"){
            setFilterJackets(e.target.checked);
            setkurtas(kurtas);
            setjacket(e.target.checked);
        }
    }

    const sort_by_price_l_h=(e,type)=>{
        if(type==="l_to_h"){
            setPrice_h_to_l(false);
            setPrice_l_to_h(true);
            var filteredproductListKurta = kurtasCollection.filter(item=>item.type==="kurtas").sort((a,b)=>parseInt(a.price)-parseInt(b.price)) ;
            var filteredproductListtJacket = jacketCollection.filter(item=>item.type==="jacket").sort((a,b)=>parseInt(a.price)-parseInt(b.price)) ;
            setkurtasCollection(filteredproductListKurta);
            setjacketCollection(filteredproductListtJacket);
        }else{
            setPrice_l_to_h(false);
            setPrice_h_to_l(true);
            var filteredproductListKurta = kurtasCollection.filter(item=>item.type==="kurtas").sort((a,b)=>parseInt(b.price)-parseInt(a.price)) ;
            var filteredproductListtJacket = jacketCollection.filter(item=>item.type==="jacket").sort((a,b)=>parseInt(b.price)-parseInt(a.price)) ;
            setkurtasCollection(filteredproductListKurta);
            setjacketCollection(filteredproductListtJacket);
        }
    }

    const sort_by_brand=(e,brand)=>{
        let newBrandList=[];
        let newKurtasList=[];
        let newJacketsList=[];
        // adding or removing brand from list
        if(e.target.checked){
            if(bransList.indexOf(brand)===-1){
                newBrandList=[...bransList,brand];
                setBrandlist(newBrandList);
            }
        }else{
            newBrandList=[...bransList];
            newBrandList= newBrandList.filter(item=>item!==brand);
            setBrandlist(newBrandList);
        }
        if(newBrandList.length>0){
            newBrandList.forEach(brand_name=>{
            
                products.filter(item=>item.type==="kurtas"&&item.company===brand_name).forEach(filtered_item=>{
                    newKurtasList.push(filtered_item);
                })
                products.filter(item=>item.type==="jacket"&&item.company===brand_name).forEach(filtered_item=>{
                    newJacketsList.push(filtered_item);
                })
            })
        }else{
            newKurtasList = products.filter(item=>item.type==="kurtas");
            newJacketsList = products.filter(item=>item.type==="jacket");
        }


        if(price_l_to_h){
            var filteredproductListKurta = newKurtasList.filter(item=>item.type==="kurtas").sort((a,b)=>parseInt(a.price)-parseInt(b.price)) ;
            var filteredproductListtJacket = newJacketsList.filter(item=>item.type==="jacket").sort((a,b)=>parseInt(a.price)-parseInt(b.price)) ;
            setkurtasCollection(filteredproductListKurta);
            setjacketCollection(filteredproductListtJacket);
        }
        else if(price_h_to_l){
            var filteredproductListKurta = newKurtasList.filter(item=>item.type==="kurtas").sort((a,b)=>parseInt(b.price)-parseInt(a.price)) ;
            var filteredproductListtJacket = newJacketsList.filter(item=>item.type==="jacket").sort((a,b)=>parseInt(b.price)-parseInt(a.price)) ;
            setkurtasCollection(filteredproductListKurta);
            setjacketCollection(filteredproductListtJacket);
        }else{
            setkurtasCollection(newKurtasList);
            setjacketCollection(newJacketsList);
        }

    }
    return <>
        <div ref={filter} className={"flex flex-col fixed top-28 right-0 bg-white shadow-sm shadow-slate-400 z-10 overflow-x-hidden w-11 p-4 rounded-md rounded-tr-none rounded-br-none transition-all duration-500"}>
            <div className="flex flex-row justify-between items-center gap-2 ">
            <span className="pb-2 font-semibold" onClick={()=>{setShow(!show)}}>
                <span><i className="fi fi-rr-filter"></i></span>
            </span>
            <span onClick={()=>{setShow(!show)}}><i className="fi fi-rr-angle-small-down cursor-pointer"></i></span>
            </div>
            <hr />
            {/* Sorting price low to high */}
            <div className="flex flex-col gap-2 mb-4 text-sm">
                <span className="font-semibold">Sort By</span>
                <span className="flex flex-col justify-start gap-4 text-xs">
                    <span className="flex flex-row justify-start gap-2 items-center">
                        <input type="checkbox" checked={price_l_to_h} onClick={e=>sort_by_price_l_h(e,"l_to_h")}/>
                        <span>Price low to high</span>
                    </span>
                    <span className="flex flex-row justify-start gap-2 items-center">
                        <input type="checkbox" checked={price_h_to_l} onClick={e=>sort_by_price_l_h(e,"h_to_l")}/>
                        <span>Price high to low</span>
                    </span>
                </span>
            </div>
            {/* Sorting Category */}
            <div className="flex flex-col gap-2 mb-4 text-sm">
                <span className="font-semibold">Category</span>
                <span className="flex flex-col justify-start gap-4 text-xs">
                    <span className="flex flex-row justify-start gap-2 items-center">
                        <input type="checkbox" onChange={(e)=>{handleCategory(e,"kurtas")}}/>
                        <span>Kurtas</span>
                    </span>
                    <span className="flex flex-row justify-start gap-2 items-center">
                        <input type="checkbox" onChange={(e)=>{handleCategory(e,"jacket")}}/>
                        <span>Jackets</span>
                    </span>
                </span>
            </div>

                {/* Sorting Price Range */}
                <div className="flex flex-col gap-2 mb-4 text-sm">
                <span className="font-semibold">Brands</span>
                <span className="flex flex-col justify-start gap-4 text-xs">
                    {brands.map(item=>{
                        return <span className="flex flex-row justify-start gap-2 items-center">
                        <input type="checkbox" onClick={(e)=>{sort_by_brand(e,item.brand)}}/>
                        <span>{item.brand} ( {item.no}  )</span>
                    </span>
                    })}
                </span>
            </div>
        </div>
    </>
}

export default FilterW;