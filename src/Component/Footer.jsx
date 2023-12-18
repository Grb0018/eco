import { Link } from "react-router-dom";

const Footer = (props) => {
    const{totalcartItems}=props;
    return <>
        <div className="flex flex-col items-center justify-between w-full bg-orange-50 mt-10 border-t-2 border-orange-100 absolute h-62 bottom-0">
            <div className="flex flex-col gap-4 m-6 p-5 sm:py-2">
                <span className=" flex flex-row gap-14 text-zinc-800 md:flex-wrap md:mx-8 sm:justify-center sm:items-center sm:text-sm sm:gap-3 sm:font-normal">
                    <Link className="font-semibold hover:text-rose-800" to={"/"}>Home</Link>
                    <Link className="font-semibold hover:text-rose-800" to={"/men"}>Men</Link>
                    <Link className="font-semibold hover:text-rose-800" to={"/women"}>Women</Link>
                    <Link className="font-semibold hover:text-rose-800" to={"/about"}>About Us</Link>
                    <Link className="font-semibold hover:text-rose-800" to={"/user"}><i className="fi fi-rr-user"></i></Link>
                    <Link className="font-semibold hover:text-rose-800" to={"/cart"}><i className="fi fi-rr-shopping-cart">{totalcartItems>0?totalcartItems:""}</i></Link>
                </span>
                <span>
                <h1 className=" text-center bold m-4 text-4xl text-black sm:text-3xl">CartY <i className="fi fi-tr-clothes-hanger text-rose-800"></i></h1>
                </span>

            </div>
            <div className="text-center h-10 bg-rose-600 text-white w-full flex items-center justify-center sm:text-xs">
                Copyright © Reserved {new Date().getFullYear()} | Created By Gourab Das
            </div>
            <a href="mailto:dasgrb18@gmail.com" className="absolute right-10 bottom-10"><i className="fi fi-sr-envelope text-xl sm:text-sm"></i></a> 
        </div>
    </>
}

export default Footer;