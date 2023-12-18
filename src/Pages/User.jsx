import { useEffect, useState } from "react";
import Header from "../Component/Header";
import { country_list } from "../Component/dataList";
import { store } from "../redux/store";
import { Link } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../redux/storeSlice";
import Loading from "../Component/Loading";
import Footer from "../Component/Footer";

const User = () => {
    const [user,setUser]=useState(store.getState().storeSlice?.user);
    const [totalcartItems,setTotalcartItems]=useState(store.getState().storeSlice.user[0]?.cart.length);
    const [fname, setfName] = useState("");
    const [lname, setlName] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [country, setCountry] = useState("");
    const [textEditable, setTextEditable] = useState(false);
    const [loading,setLoading]=useState(true);
    const dispatch = useDispatch();
    const userAuthcheckingDone = useSelector(state=>state.storeSlice.checked);
    useEffect(() => {
        if (userAuthcheckingDone) {
            setLoading(false);
            setUser(store.getState().storeSlice?.user);
            setTotalcartItems(store.getState().storeSlice?.user[0]?.cart.length);
        }
    }, [userAuthcheckingDone])

    useEffect(() => {
        if (user.length > 0) {
            setfName(user[0].name.substring(0, user[0].name.indexOf(" ")));
            setlName(user[0].name.substring(user[0].name.indexOf(" "), user[0].name.length));
            setPhone(user[0].phone_number);
            setMail(user[0].email);
            setCity(user[0].city);
            setState(user[0].state);
            setPincode(user[0].pincode);
            setCountry(user[0].country);
        }
    }, [user])

    const updateInfo = () => {
        updateDoc(doc(db, "users", user[0].uid), {
            name: fname + " " + lname,
            phone_number: phone,
            email: mail,
            city: city,
            state: state,
            pincode: pincode,
            country: country
        }).then(val => {
            alert("update succesfull");
            setTextEditable(false);
        }).catch(error => {
            console.log(error)
        })
    }

    const logout =()=>{
        let confirm = window.confirm("Are you want to logout ?");
        if(confirm){
            signOut(auth).then(val=>{
                dispatch(setLogout([]));
            });
            setUser([]);
            setTotalcartItems("");
            alert("Signed out Successfully");
        }
    }


    return <div className="relative min-h-screen pb-64">
        <Header page={"User"} totalcartItems={totalcartItems}/>
        {loading?<Loading/>:<></>}
        {user.length > 0 && !loading ?
         <div className="flex flex-col gap-4 items-center p-4 md:p-2 md:mt-10">
                <span className="w-3/4 md:w-[98%] mx-20 md:mx-2 font-semibold text-lg">
                    USER DETAILS ,
                </span>
                <section className="w-4/6 md:w-[98%] flex flex-row">
                    <span>
                        <span className="text-lg flex gap-2 justify-center items-center px-4 py-2 w-20 h-20 rounded-2xl bg-zinc-50">
                            <i className="fi fi-ss-user-check text-rose-700 font-semibold text-xl"></i>
                        </span>
                    </span>

                    <span className="flex flex-col justify-evenly mx-6 md:text-sm md:mx-2">
                        <span>
                            Total Order - 0
                        </span>
                        <span>
                            Total Item In Cart - {store.getState().storeSlice.user[0].cart.length}
                        </span>
                    </span>
                </section>
                <section className="w-4/6 md:w-[98%] flex flex-row md:flex-col md:gap-4 justify-between items-start">
                    <span className="flex flex-col">
                        <span className="font-semibold text-sm">
                            {user[0].name}
                        </span>
                        <span className="font-semibold text-sm">
                            {user[0].email}
                        </span>
                        <button className="text-xs bg-slate-200 rounded-md my-1 py-2 px-3 text-slate-800" onClick={()=>{logout()}}>Log Out</button>
                    </span>
                    <span className="flex flex-col md:flex-col gap-2 md:w-full md:px-10">
                    <Link to={"/wishlist"} className="w-30 h-10 md:w-full select-none cursor-pointer bg-orange-200 px-5 py-2 text-center text-sm shadow-sm rounded-md text-zinc-800 font-semibold hover:shadow-lg">
                            Wish List Items 
                        </Link>
                        <Link to={"/order"} className="w-30 h-10 md:w-full select-none cursor-pointer bg-rose-200 px-5 py-2 text-center text-sm shadow-sm rounded-md text-zinc-800 font-semibold hover:shadow-lg">
                            Check Previous Orders <i className="fi fi-rr-truck-side text-md px-1"></i>
                        </Link>
                        {
                            textEditable ?
                                <span className="w-30 h-10 md:w-full select-none cursor-pointer bg-rose-700 px-5 py-2 text-center text-sm shadow-sm rounded-md text-zinc-50 font-semibold hover:shadow-lg" onClick={() => { updateInfo() }}>
                                    Save Info
                                </span>

                                :
                                <span onClick={(e) => { setTextEditable(true) }} className="w-30 md:w-full h-10 select-none cursor-pointer bg-zinc-200 px-5 py-2 text-center text-sm shadow-sm rounded-md text-zinc-800 font-semibold hover:shadow-lg">
                                    Update Info
                                </span>
                        }
                    </span>

                </section>
                <span className=" w-4/6 md:w-[98%] h-max p py-12 shadow-md flex flex-col items-center justify-center bg-zinc-50 rounded-2xl ">
                    <section className="flex flex-row w-full justify-evenly md:items-center">
                        <span className="flex flex-col items-start my-2 w-2/5  md:w-[46%]">
                            <label className="text-black text-md font-semibold md:text-sm " htmlFor="fnameTag">
                                <i className="fi fi-rr-circle-f mx-2"></i>
                                First Name : </label>
                            <input value={fname} onChange={(e) => { setfName(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`} type="text" id="fnameTag" />
                        </span>
                        <span className="flex flex-col items-start gap-1 my-2 w-2/5  md:w-[46%]">
                            <label className="text-black text-md font-semibold md:text-sm" htmlFor="lnameTag">
                                <i className="fi fi-rr-circle-l mx-2"></i>
                                Last Name : </label>
                            <input value={lname} onChange={(e) => { setlName(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`} type="text" id="lnameTag" />
                        </span>
                    </section>
                    <section className="flex flex-row w-full justify-evenly md:items-center">
                        <span className="flex flex-col items-start gap-1 my-2 w-2/5  md:w-[46%]">
                            <label className="text-black text-md font-semibold md:text-sm" htmlFor="phnNoTag">
                                <i className="fi fi-rr-phone-flip mx-2"></i>
                                Phone Number : </label>
                            <input value={phone} onChange={(e) => { setPhone(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`} type="number" id="phnNoTag" />
                        </span>
                        <span className="flex flex-col items-start gap-1 my-2 w-2/5  md:w-[46%]">
                            <label className="text-black text-md font-semibold md:text-sm" htmlFor="mailTag">
                                <i className="fi fi-rr-envelope mx-2"></i>
                                Mail : </label>
                            <input value={mail} onChange={(e) => { setMail(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`} type="mail" id="mailTag" />
                        </span>
                    </section>
                    <section className="flex flex-row w-full justify-evenly md:items-center">
                        <span className="flex flex-col items-start gap-1 my-2 w-2/5  md:w-[46%]">
                            <label className="text-black text-md font-semibold md:text-sm" htmlFor="cityTag">
                                <i className="fi fi-rr-house-building mx-2"></i>
                                City : </label>
                            <input value={city} onChange={(e) => { setCity(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`} type="text" id="cityTag" />
                        </span>
                        <span className="flex flex-col items-start gap-1 my-2 w-2/5  md:w-[46%]">
                            <label className="text-black text-md font-semibold md:text-sm" htmlFor="stateTag">
                                <i className="fi fi-rr-map-marker mx-2"></i>
                                State : </label>
                            <input value={state} onChange={(e) => { setState(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`} type="text" id="stateTag" />
                        </span>
                    </section>
                    <section className="flex flex-row w-full justify-evenly md:items-center">
                        <span className="flex flex-col items-start gap-1 my-2 w-2/5  md:w-[46%]">
                            <label className="text-black text-md font-semibold md:text-sm" htmlFor="pinTag">
                                <i className="fi fi-rr-marker mx-2"></i>
                                Pincode : </label>
                            <input value={pincode} onChange={(e) => { setPincode(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`} type="text" id="pinTag" />
                        </span>
                        <span className="flex flex-col items-start gap-1 my-2 w-2/5  md:w-[46%] ">
                            <label className="text-black text-md font-semibold md:text-sm" htmlFor="countryTag">
                                <i className="fi fi-rr-flag mx-2"></i>
                                Country : </label>
                            <select id="countryTag" value={country} onChange={(e) => { setCountry(e.target.value) }} disabled={textEditable ? false : "disabled"} className={`w-full focus:outline-none bg-white text-black  text-sm p-2 px-2 md:text-xs ${textEditable ? "border-rose-300 border-2" : "border-b-slate-500 border-b-2"}`}>
                                <option value={""}> </option>
                                {country_list.map(country => {
                                    return <option key={country} value={country}>
                                        {country}
                                    </option>
                                })}
                            </select>
                        </span>
                    </section>
                </span>
            </div>
            : <>
            {userAuthcheckingDone?<>
                <div className="flex flex-row gap-2 w-full justify-center items-center my-16">
                    <span>Please </span>
                    <Link className="font-semibold text-2xl" to="/signin"> SignIn </Link>
                    <span>to continue .</span>
                </div>
            </>:<></>}
            </>
        }

<Footer />
    </div>
}
export default User;