import * as React from 'react';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {useNavigate} from "react-router-dom";


export default function Notifycation({numOfMessage}) {
    const navigate = useNavigate();
    const handleClickOpen = () => {
        navigate('/awaiting-shared')
    };
    return (
        <div>
            <Button>
                <div onClick={handleClickOpen} style={{width: "364px", color: "#747474"}}>
                    <div className='pr-4 py-2'>
                        <span className='mr-3'>Awaiting shared wallet</span>
                        <span className='bg-red-400 rounded-full text-white w-16 h-16 px-1'>{
                            numOfMessage
                        }</span>
                        <ArrowForwardIosIcon sx={{fontSize: "14px", float: "right", marginRight: "10px"}}/>
                    </div>
                    <hr/>
                </div>
            </Button>
        </div>
    )
}