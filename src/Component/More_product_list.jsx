import { Link } from "react-router-dom";

const More_product_list=(props)=>{
    const shuffle=(list)=>{
        var len = list.length;
        let i=0;
        let totalNoList=[];
        let productList=[];
        while (i<len) {
            var rand = Math.floor(Math.random()*len);
            if(totalNoList.indexOf(rand)===-1){
                totalNoList.push(rand);
                productList.push(list[rand]);
                i++;
            }
        };
        return productList;
   }


        return <>
        <div className='my-4 '>
            <hr />
            <span className='px-4 my-5 block font-semibold'>Also check these collection,</span>
            <div className="flex min-w-full  overflow-y-hidden relative px-10 flex-row gap-4 justify-evenly md:justify-start">
        {
            shuffle(props.item_List.filter(item=>item.id!==props.selected_item[0]?.id)).map((item,i)=>{
                if(i<5){
                    return <>
                    <Link to={"/"+item.gender+"/"+item.id} >
                    <div className=" relative min-w-[14rem] bg-cover h-72 " style={{backgroundImage: `url("${item.images1}")`}} >
                        <div className=" flex flex-col justify-start items-start gap-2 absolute bottom-0 p-2">
                            <span className="text-white font-semibold bg-[#0b0d0e2b] text-lg">{item.company}</span>
                            <span className="text-sm text-white  [text-shadow:_0px_1px_7px_black]  ">{item.name}</span>
                        </div>
                    </div>
                    </Link>
                    </>
                }
            })
        }
         </div>
        </div>
        </>
    }

    export default More_product_list;