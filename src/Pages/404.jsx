import { Link } from "react-router-dom"
import Header from "../Component/Header"
import Footer from "../Component/Footer";

const No_page =()=>{
    return <div className="relative min-h-screen pb-64">
    <div className="flex flex-col justify-center items-center">
        <Header />
        <br />
        <span>Sorry, Page not found</span>
        <span className="flex flex-row items-center gap-3">
            click to visit, 
            <Link to={"/"}  className="font-semibold text-2xl my-4 block">CartY</Link>
        </span>
    </div>
    <Footer />
    </div>
}

export default No_page;