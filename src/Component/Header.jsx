import { Link } from "react-router-dom";

const Header=()=>{

    return <>
    <div className="flex flex-col items-center justify-center w-full">
    <h1 className=" text-center bold m-4 text-4xl text-black">ThE</h1>
    <div className="flex justify-center">
        <Link to={"/"}><span className="text-grey-600 mx-4">Home</span></Link>
        <Link to={"/men"}><span className="text-grey-600 mx-4">Men</span></Link>
        <Link to={"/women"}><span className="text-grey-600 mx-4">Women</span></Link>
        <Link to={"/about"}><span className="text-grey-600 mx-4">About Us</span></Link>
    </div>
    </div>
    </>
}

export default Header;