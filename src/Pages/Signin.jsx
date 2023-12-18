import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Footer from "../Component/Footer";
import Header from "../Component/Header";

const Signin =()=>{
    const[eye,setEye]= useState(false);
    const[password,setPassword]=useState("");
    const[mail,setMail]=useState("");
    const navigate = useNavigate();

    const login_byemailpassword=()=>{
        if(password.length>5 && mail.length>0 && mail.includes("@")){
            try {
                signInWithEmailAndPassword(auth,mail,password).then(user=>{
                    alert("Login Succesfully");
                    navigate("/");
                });
            } catch (error) {
                
            }
        }else if(mail.includes("@")===false){
            alert("Please enter correct mail address")
        }else if(password.length<6){
            alert('Password length cannot be less than 6')
        }
    }

    const login_bygoogle=()=>{
        var provide = new GoogleAuthProvider();
        signInWithPopup(auth,provide).then(user=>{
            getDoc(doc(db,"users",user.user.uid)).then(snapshot=>{
                if(snapshot===null){
                    setDoc(doc(db,"users",user.user.uid),
                    {
                        uid:user.user.uid,
                            email:user.user.email,
                            password:"",
                            city:"",
                            state:"",
                            pincode:"",
                            country:"",
                            name:user.user.displayName,
                            gender:"",
                            phone_number:"",
                            cart:[],
                            wishlist:[],
                            orders:[]
                    }
                    ).then(val=>{
                        alert("Login Succesfully");
                         navigate("/");
                    })
                }else{
                    alert("Login Succesfully");
                    navigate("/");
                }
            })
          

        }).catch(error=>console.log(error))
    }

    return <div className="relative min-h-screen pb-64">
        <Header />
    <div className="flex flex-col justify-center items-center bg-slate-50 min-h-[80vh] mt-5 w-full">
    <form className="p-10 bg-white shadow-sm w-[27rem] h-max flex flex-col gap-3 py-10" >
     <span className="text-center w-full -mt-8">Sign In</span>
        <label htmlFor="mail" className="font-semibold">Email address</label>
        <input type="mail" name="mail" id="mail" className="mb-4 py-1 px-2 rounded-md border-2 w-[88%]" onKeyUp={(e)=>setMail(e.currentTarget.value)}/>
        <label htmlFor="password"  className="font-semibold">Password</label>
        <span className="mb-4 flex flex-row justify-center items-center">
        <input  type={eye===true?"text":"password"} onKeyUp={e=>setPassword(e.currentTarget.value)} name="password" id="password" className=" w-[88%] py-1 px-2 rounded-md border-2" />
        {eye===true?<i className="fi fi-rr-eye mx-2" onClick={(e)=>{setEye(!eye)}}></i>:<i className="fi fi-rs-crossed-eye px-2" onClick={(e)=>{setEye(!eye)}}></i>}
        </span>
        
        <button className="text-center p-1 py-2 border-2 bg-slate-700 text-slate-300 mx-1 rounded-md hover:shadow-md" onClick={()=>{login_byemailpassword()}}>Submit</button>
        <span className="flex justify-between cursor-pointer text-slate-700 font-semibold text-xs">
            <Link to={"/signup"}>Create an account.</Link>
            <Link to={"/signin"}>Forget your password ?</Link>
           
        </span>
        <span className="flex flex-row justify-evenly items-center my-5">
            <span className="block w-1/6 h-[1px] bg-slate-400"></span>
            <span>Or continue with</span>
            <span className="block w-1/6 h-[1px] bg-slate-400"></span>
        </span>
        <span className="flex flex-row gap-2 text-white bg-sky-400 p-1 py-2 mx-1 rounded-md text-center justify-center cursor-pointer hover:shadow-md" onClick={()=>{login_bygoogle()}}>
        <i className="fi fi-brands-google"></i>
        Google
        </span>
    </form>

    </div>
    <Footer/>
    </div>
}

export default Signin;