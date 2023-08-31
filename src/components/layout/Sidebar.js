import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import ReorderIcon from '@mui/icons-material/Reorder';
import { Avatar } from "@mui/material";
import MyAccount from "./MyAccount";
import MyWallets from "./MyWallets";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TollIcon from '@mui/icons-material/Toll';
import { useSelector } from 'react-redux';
import Slide from "@mui/material/Slide";
import Notifycation from "./Notifycation";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import CategoriesNav from './CategoriesNav';

export default function Sidebar() {

    const {t}=useTranslation()
    const user = useSelector(state => state.auth.login.currentUser)
    const [state, setState] = React.useState({
        left: false,
    });

    const [messageCount, setMessageCount] = useState(0);
    const [message, setMessage] = useState();
    const socket = useSelector(state => state.wallet.socket);

    useEffect(() => {
        socket?.on('forwardMessage', async (data) => {
            setMessage(data);
            setMessageCount(savedMessages.length);
        });
        const savedMessagesJSON = localStorage.getItem(`${user.id}_receivedMessages`);
        const savedMessages = savedMessagesJSON ? JSON.parse(savedMessagesJSON) : [];
        setMessageCount(savedMessages.length);
    }, [message]);

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (

        <div style={{ width: "364px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <Avatar sx={{ margin: "auto", marginTop: "50px" }}>T</Avatar>
                <h4>{user.email}</h4>
            </div>
            <hr />
            {messageCount > 0 && <Notifycation numOfMessage={messageCount} />}
            <MyAccount />
            <MyWallets />
            <CategoriesNav/>
        </div>);
    return (
        <div className='h-[66px]'>
            <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                <div className="sidebar">
                    <div>
                        <React.Fragment key={"left"}>
                            <Button onClick={toggleDrawer("left", true)}><ReorderIcon sx={{ color: "#282828" }} />
                                {messageCount > 0 &&
                                    <>
                                        <span className="w-2 h-2 bg-red-500 rounded-xl absolute  mb-3 ml-4"></span>
                                    </>
                                }
                            </Button>
                            <SwipeableDrawer
                                anchor={"left"}
                                open={state["left"]}
                                onClose={toggleDrawer("left", false)}
                                onOpen={toggleDrawer("left", true)}
                            >
                                {list("left")}
                            </SwipeableDrawer>
                        </React.Fragment>
                        <Link to={'/'}>
                            <div className="iconSideBar">
                                <Button><AccountBalanceWalletIcon className="colorIcon" /></Button>
                                <span className="colorIcon">{t('Trasactions')}</span>
                            </div>
                        </Link>
                        <Link to={'/reports'}>
                            <div className="iconSideBar">
                                <Button><AnalyticsIcon className="colorIcon" /></Button>
                                <span className="colorIcon">{t("Report")}</span>
                            </div>
                        </Link>
                        <div className="iconSideBar">
                            <Button><TollIcon className="colorIcon" /></Button>
                            <span className="colorIcon">{t('Budget')}</span>
                        </div>
                        <hr style={{
                            margin: "10px -10px",
                            border: "none",
                            height: "2px",
                            backgroundColor: "rgba(0,0,0,.12)"
                        }} />
                    </div>
                </div>
            </Slide>
        </div>
    )
}