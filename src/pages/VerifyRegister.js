// import {UserService} from "../services/user.service";
// import {Link, useParams} from "react-router-dom";
// import {useEffect, useState} from "react";
// import * as React from "react";
//
// export default function VerifyRegister() {
//     const token = useParams().token
//         UserService.verifyEmail(token)
//     return (
//         <>
//             <div className="bg-darkgreen h-[312px]">
//                 <img src="../logo.png" className=" object-cover w-[230px] h-[230px] mx-auto" alt="logo"/>
//             </div>
//             <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2">
//                 <div id="wrapper" className="shadow-md bg-white rounded-[50px] px-10 pt-[40px] pb-10">
//                     <h3>Verified email successfully! ^^</h3>
//                     <div className='text-center'>Please <Link to="/login"><span
//                         className='text-blue-500 underline underline-offset-4 hover:cursor-pointer'>
//                         Log in
//                     </span> </Link> to use.
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }


import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {UserService} from "../services/user.service";

export default function VerifyRegister() {
    const {token} = useParams();
    const [verifyMessage, setVerifyMessage] = useState('')
    useEffect(()=>{
        UserService.verifyEmail(token).then(res=>{
                setVerifyMessage(res.data.message)
        }).catch(()=>{
            setVerifyMessage("Email was not existed")
        })
    },[token])

    return (
        <>
            <div className="bg-darkgreen h-[312px]">
                <img src="../logo.png" className=" object-cover w-[230px] h-[230px] mx-auto" alt="logo"/>
            </div>
            <div className="absolute top-[33%] left-1/2 transform -translate-x-1/2">
                <div id="wrapper" className="shadow-md bg-white rounded-[50px] px-10 pt-[40px] pb-10">
                    <div className='text-center'>
                    <h3>{verifyMessage}</h3>
                    Please <span
                        className='text-blue-500 underline underline-offset-4 hover:cursor-pointer'>
                         Back to Sign in MoneyLover
                    </span>
                    </div>
                </div>
            </div>
        </>
    )
}