
import Header from "../Component/Header"
import { store } from "../redux/store"
import Footer from "../Component/Footer"

    const About=()=>{

        return<div className="relative min-h-screen pb-64">
        <Header page={"AboutUs"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>

        <div className="flex flex-col gap-4 md:m-4 decoration-solid m-20 ">
        <span>
        Welcome to CartY, your one-stop-shop for all your online shopping needs! We are a leading e-commerce platform that offers a wide range of products at affordable prices. Our aim is to provide our customers with a seamless shopping experience, from browsing to checkout.
        </span>

        <span>
        At CartY, we believe in quality, affordability, and convenience. We understand that online shopping can be overwhelming, which is why we have made it our mission to simplify the process for you. Our user-friendly interface allows you to easily navigate through our product categories and find what you need in just a few clicks.
        </span>

        <span>
        We offer a diverse range of products, including electronics, fashion, beauty, home and garden, and much more. Our team of experts carefully selects each product to ensure that it meets our high standards of quality and affordability.
        </span>

        <span>
        We pride ourselves on our exceptional customer service. Our dedicated support team is available 24/7 to assist you with any queries or concerns you may have. We also offer fast and reliable shipping options to ensure that your order arrives on time.
        </span>

        <span>
        At CartY, we are committed to providing our customers with the best possible shopping experience. We value your feedback and suggestions, so please feel free to contact us with any comments or suggestions you may have.
        </span>

        <span>
        Thank you for choosing CartY as your preferred online shopping destination. We look forward to serving you!
        </span>

        </div>
        <Footer page={"AboutUs"} totalcartItems={store.getState().storeSlice.user[0]?.cart.length}/>
        </div>
    }

    export default About;