import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as Yup from "yup";
import {useFormik} from "formik";
import {UserService} from "../services/user.service";

export const validateInput = Yup.object({
    email: Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email address invalid'),
})
export default function ResetPassword() {
    // const navigate = useNavigate();
    const [emailResetPassword, setEmailResetPassword] = useState();
    const [checkResetPassword, setCheckResetPassword] = useState(false);
    const handleChange = (e) => {
        const {name} = e.target;
        formik.setFieldTouched(name, true, false);
        formik.handleChange(e);
    }
    const formik = useFormik({
        initialValues: {email: ''},
        validationSchema: validateInput,
        onSubmit: values => {
            console.log(values)
            UserService.resetPassword(values).then((res)=>{
                console.log(res.data)
                setEmailResetPassword(res.data.user.email)
                setCheckResetPassword(true)
                // navigate("/login")
            })
        },
    });

    useEffect(() => {
        // Xử lý sự kiện click bất kỳ đâu ở background
        const handleClickOutside = (event) => {
            const notifyMessageReset = document.getElementById("resetPassword")
            if (notifyMessageReset && !notifyMessageReset.contains(event.target)) {
                setCheckResetPassword(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="bg-darkgreen h-[312px]">
                <img src="../logo.png" className=" object-cover w-[230px] h-[230px] mx-auto" alt="logo"/>
            </div>
            <div className="absolute top-[33%] left-1/2 transform -translate-x-1/2">
                <div id="wrapper" className="shadow-md bg-white rounded-[50px] px-10 pt-[30px] pb-10">
                    <div className='text-center'>
                        <form method="post" className=" border-slate-500 mb-4 pl-[12px]"
                              onSubmit={formik.handleSubmit}>
                            <div className="font-bold text-4xl mb-[15px] ">Forgot Password</div>
                            <div className="text-base mb-[30px] max-w-[500px] text-center ">Enter the email address you used to register, and we will send you an email to recover your password in no time.</div>
                            <div className="mb-[30px]">
                                <input onChange={handleChange} type="email" name="email" value={formik.values.email}
                                       placeholder="Email"
                                       className="min-w-[300px] p-4 py-[16px] bg-neutral-100 rounded-lg focus:outline-green-400"
                                       required/>
                                {formik.touched.email && formik.errors.email ? (
                                    <p className="text-red-500 text-xs mr-48 mt-2 ">{formik.errors.email}</p>) : null}
                            </div>
                            <div className="mb-[10px]">
                                <button
                                    className="bg-normalgreen uppercase w-full font-semibold text-white rounded-lg max-w-[300px] p-4 py-[6px]" type={"submit"}>Submit
                                </button>
                            </div>
                            <div className="mb-[10px]">
                                <span className="text-lightgreen hover:text-green-600"><Link to={'/login'}>Back To Login</Link></span>
                                <span> or </span>
                                <span className="text-lightgreen hover:text-green-600"><Link to={'/register'}>Creat Account</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
                {(checkResetPassword) ? <div id="resetPassword" className="mx-auto text-center bg-black text-amber-50 mt-12 rounded shadow-md px-8 py-3 w-max">The new password sent to {emailResetPassword} </div> : null}
            </div>
        </>
    )
}