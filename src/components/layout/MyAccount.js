import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ClearIcon from '@mui/icons-material/Clear';
import {Avatar, Stack} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import ModalDeleteUser from "../modals/ModalDeleteUser";
import ModalUpdateUser from '../modals/ModalUpdateUser';
import { walletLogout } from '../../redux/walletSlice';
import {useTranslation} from "react-i18next";
import { transactionLogout } from '../../redux/transactionSlice';

const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: "10px",
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MyAccount() {
    const {t}=useTranslation()
    const dispatch = useDispatch();
    const navigate =useNavigate()
    const user = useSelector(state => state.auth.login.currentUser)
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const socket = useSelector(state => state.wallet.socket);
    const handleSignOut = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        dispatch(walletLogout());
        dispatch(transactionLogout());
        navigate('/login');
        socket.emit('logout');
        socket.disconnect();
    }

    return (
        <div>
            <Button onClick={handleOpen}>
                <div style={{width: "364px", color: "#747474"}} className='pr-4'>
                    <div style={{float: "left", marginRight: "40px"}}>
                        <PersonIcon sx={{fontSize: "40px", marginLeft: "20px"}}/>
                    </div>
                    <div style={{paddingTop: "9px", textAlign: "left"}}>
                        {t("My Account")}
                        <ArrowForwardIosIcon sx={{fontSize: "14px", float: "right", marginRight: "10px"}}/>
                    </div>
                    <hr/>
                </div>
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <Button sx={{color: "black"}} onClick={handleClose}><ClearIcon sx={{float: "left"}}/></Button>
                        <Stack direction="row" sx={{float: "right"}} spacing={2}>
                            <Button onClick={handleSignOut} color="success"><b>{t("SIGN OUT")}</b></Button>
                        </Stack>
                        <b style={{marginLeft: "30px"}}>{t("My Account")}</b>
                    </div>
                    <br/>
                    <hr/>
                    <br/>
                    <Avatar sx={{margin: "auto", width: 70, height: 70}} size="large">T</Avatar>
                    <p style={{color: "black", textAlign: "center"}}>{user.email} </p>
                    <div style={{marginTop:"100px"}}>
                        <Stack direction="row" sx={{float: "left"}} spacing={2}>
                        <ModalUpdateUser/>
                        </Stack>
                        <Stack direction="row-reverse" spacing={2}>
                            <ModalDeleteUser sx={{ height: "402px" }}/>
                        </Stack>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}