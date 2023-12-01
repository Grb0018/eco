import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore"; 
import { addUser } from "../redux/storeSlice";
import { useDispatch } from "react-redux";
const Login =()=>{

    const[eye,setEye]= useState(false);
    const[password,setPassword]=useState("");
    const[mail,setMail]=useState("");
    const[name,setName]=useState("");
    const dispatch = useDispatch();

    const signin_method=()=>{
        if(password!=="" && mail!=="" && name!=="" && password.length>6){
            try {
                createUserWithEmailAndPassword(auth,mail,password).then(val=>{
                    if(val.user!==null){
                        let uid = val.user.uid;
                        var user_data = {
                            uid:uid,
                            email:mail,
                            password:password,
                            address:"",
                            name:name,
                            gender:"",
                            phone_number:"",
                            cart:[],
                            wishlist:[]
                        };
                        setDoc(doc(db,"users",uid),user_data).then(val=>{
                            alert("Sign In succesfull");
                            dispatch(addUser([{
                            uid:uid,
                            email:mail,
                            address:"",
                            name:name,
                            gender:"",
                            phone_number:"",
                            cart:[],
                            wishlist:[]
                            }]));
                        });
                    }
                })
            } catch (error) {
                console.log(error)
            }    
        }else if(password !=""){
            alert("Please enter password .")
        }
        else if(mail !=""){
            alert("Please enter mail .")
        }
        else if(name !=""){
            alert("Please enter name .")
        }
        else if(password.length<6){
            alert("Please enter mail .")
        }
    }

    return <>
    <div className="flex flex-col justify-center items-center bg-slate-50 min-h-screen w-full">
    <form className="p-10 bg-white shadow-sm w-[27rem] h-max flex flex-col gap-3 py-10" onSubmit={(e)=>e.preventDefault()}>
    <h1 className=" text-center bold m-4 text-4xl text-black mb-8">CartY <i className="fi fi-tr-clothes-hanger"></i></h1>
        <span className="text-center w-full -mt-8">Sign In</span>
        <label htmlFor="name" className="font-semibold">Your name</label>
        <input type="text" name="name" required id="name" className="mb-4 py-1 px-2 rounded-md border-2 w-[88%]" onKeyUp={(e)=>setName(e.currentTarget.value)}/>
        <label htmlFor="mail" className="font-semibold">Email address</label>
        <input type="mail" required name="mail" id="mail" className="mb-4 py-1 px-2 rounded-md border-2 w-[88%]" onKeyUp={(e)=>setMail(e.currentTarget.value)}/>
        <label htmlFor="password"  className="font-semibold">Password</label>
        <span className=" flex flex-row justify-center items-center">
        <input  type={eye===true?"text":"password"} required onKeyUp={e=>setPassword(e.currentTarget.value)} name="password" id="password" className=" w-[88%] py-1 px-2 rounded-md border-2" />
        {eye===true?<i className="fi fi-rr-eye mx-2" onClick={(e)=>{setEye(!eye)}}></i>:<i className="fi fi-rs-crossed-eye px-2" onClick={(e)=>{setEye(!eye)}}></i>}
        </span>
        <span className="flex justify-end cursor-pointer text-slate-700 font-semibold">Forget Password ?</span>
        <button className="text-center p-1 py-2 border-2 bg-slate-700 text-slate-300 mx-1 rounded-md hover:shadow-md" onClick={()=>{signin_method()}}>Submit</button>
        <span className="flex flex-row justify-evenly items-center my-5">
            <span className="block w-1/6 h-[1px] bg-slate-400"></span>
            <span>Or continue with</span>
            <span className="block w-1/6 h-[1px] bg-slate-400"></span>
        </span>
        <span className="flex flex-row gap-2 text-white bg-sky-400 p-1 py-2 mx-1 rounded-md text-center justify-center cursor-pointer hover:shadow-md">
        <i className="fi fi-brands-google"></i>
        Google
        </span>
    </form>
    </div>
    </>
}

export default Login;