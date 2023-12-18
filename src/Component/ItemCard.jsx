import { Link } from "react-router-dom"
const ItemCard=(props)=>{
    const {item}=props;
    return <>
    <Link to={"/"+item.gender+"/"+item.id} >
    <div className=" relative min-w-[14rem] bg-cover h-72 " style={{backgroundImage: `url("${item.images2}")`}} >
        <div className=" flex flex-col justify-start items-start gap-2 absolute bottom-0 p-2">
            <span className="text-white font-semibold bg-[#0b0d0e2b] text-lg">{item.company}</span>
            <span className="text-sm text-white  [text-shadow:_0px_1px_7px_black]  ">{item.name}</span>
        </div>
    </div>
    </Link>
    </>
}

export default ItemCard;