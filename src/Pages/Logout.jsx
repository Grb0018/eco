import { useState } from "react";

const Logout =()=>{

    const[eye,setEye]= useState(false);
    const[password,setPassword]=useState("");
    const[mail,setMail]=useState("");

    return <>
    <div className="flex flex-col justify-center items-center bg-slate-50 min-h-screen w-full">
    <form className="p-10 bg-white shadow-sm w-[27rem] h-max flex flex-col gap-3 py-10" >
    <h1 className=" text-center bold m-4 text-4xl text-black mb-8">CartY <i className="fi fi-tr-clothes-hanger"></i></h1>
        <span className="text-center w-full -mt-8">Sign Up</span>
        <label htmlFor="mail" className="font-semibold">Email address</label>
        <input type="mail" name="mail" id="mail" className="mb-4 py-1 px-2 rounded-md border-2 w-[88%]" onKeyUp={(e)=>setMail(e.currentTarget.value)}/>
        <label htmlFor="password"  className="font-semibold">Password</label>
        <span className="mb-4 flex flex-row justify-center items-center">
        <input  type={eye===true?"text":"password"} onKeyUp={e=>setPassword(e.currentTarget.value)} name="password" id="password" className=" w-[88%] py-1 px-2 rounded-md border-2" />
        {eye===true?<i className="fi fi-rr-eye mx-2" onClick={(e)=>{setEye(!eye)}}></i>:<i className="fi fi-rs-crossed-eye px-2" onClick={(e)=>{setEye(!eye)}}></i>}
        </span>
        
        <button className="text-center p-1 py-2 border-2 bg-slate-700 text-slate-300 mx-1 rounded-md hover:shadow-md">Submit</button>
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

export default Logout;