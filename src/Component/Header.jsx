import { Link } from "react-router-dom";

const Header=(props)=>{
    const{page,totalcartItems}=props;
    return <>
    <div className="flex flex-col items-center justify-center w-full">
    <h1 className=" text-center bold m-4 text-4xl text-black sm:text-3xl">CartY <i className="fi fi-tr-clothes-hanger text-rose-800"></i></h1>
    <div className="flex justify-center sm:text-sm">
        <Link to={"/"}><span className={`text-grey-600 mx-4 sm:mx-2 ${page==="Home"? "text-rose-700 font-semibold":""}`}>Home</span></Link>
        <Link to={"/men"}><span className={`text-grey-600 mx-4 sm:mx-2 ${page==="Men"? "text-rose-700 font-semibold":""}`}>Men</span></Link>
        <Link to={"/women"}><span className={`text-grey-600 mx-4 sm:mx-2 ${page==="Women"? "text-rose-700 font-semibold":""}`}>Women</span></Link>
        <Link to={"/about"}><span className={`text-grey-600 mx-4 sm:mx-2 ${page==="AboutUs"? "text-rose-700 font-semibold":""}`}>About Us</span></Link>
        <Link to={"/user"}><span className={`text-grey-600 mx-4 sm:mx-2 ${page==="User"? "text-rose-700 font-semibold":""}`}><i className="fi fi-rr-user"></i></span></Link>
        <Link to={"/cart"}><span className={`text-grey-600 mx-4 sm:mx-2 ${page==="Cart"? "text-rose-700 font-semibold":""}`}><i className="fi fi-rr-shopping-cart">{totalcartItems>0?totalcartItems:""}</i></span></Link>
    </div>
    </div>
    </>
}

export default Header;