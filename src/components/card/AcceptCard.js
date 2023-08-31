import {Button, Card, Slide} from "@mui/material";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {WalletService} from "../../services/wallet.service";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";
import numeral from "numeral";

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#fff',
    borderRadius: 1,
    boxShadow: 24,
};

export default function AcceptCard() {
    const socket = useSelector(state => state.wallet.socket);
    const navigate = useNavigate();
    const [receivedMessages, setReceivedMessages] = useState([]);
    const user = useSelector(state => state.auth.login.currentUser);

    useEffect(() => {
        const savedMessagesJSON = localStorage.getItem(`${user.id}_receivedMessages`);
        const savedMessages = savedMessagesJSON ? JSON.parse(savedMessagesJSON) : [];
        setReceivedMessages(savedMessages);
    }, []);
    // console.log(receivedMessages);
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaa");

    const handleReject = (messageId) => {
        // Tải danh sách tin nhắn hiện tại từ localStorage
        const savedMessagesJSON = localStorage.getItem(`${user.id}_receivedMessages`);
        const savedMessages = savedMessagesJSON ? JSON.parse(savedMessagesJSON) : [];
        const messageIndexToReject = savedMessages.findIndex(message => message.id === messageId);
        const messageReject = savedMessages[messageIndexToReject];
        const senderEmail = messageReject.senderEmail;
        const walletID = +messageReject.walletInfo.id;
        socket.emit('responseMessage', {
            response: 'reject',
            senderEmail: `${user.email}`,
            receiverEmail: `${senderEmail}`,
            walletID: walletID
        });
        // Xóa message dựa trên id
        if (messageIndexToReject !== -1) {
            savedMessages.splice(messageIndexToReject, 1);
            localStorage.setItem(`${user.id}_receivedMessages`, JSON.stringify(savedMessages));
            setReceivedMessages(savedMessages);
        }
    }

    const handleAccept = (messageId) => {
        const savedMessagesJSON = localStorage.getItem(`${user.id}_receivedMessages`);
        const savedMessages = savedMessagesJSON ? JSON.parse(savedMessagesJSON) : [];
        const messageIndexToAccept = savedMessages.findIndex(message => message.id === messageId);
        const messageAccept = savedMessages[messageIndexToAccept];
        WalletService.createDetailWallet({
            walletID: messageAccept.walletInfo.id,
            role: messageAccept.permission
        }).then((res) => {
            console.log(res.data.newWallet);
        });
        const senderEmail = messageAccept.senderEmail;
        const walletID = +messageAccept.walletInfo.id;
        socket.emit('responseMessage', {
            response: 'accept',
            senderEmail: `${user.email}`,
            receiverEmail: `${senderEmail}`,
            walletID: walletID
        });
        if (messageIndexToAccept !== -1) {
            savedMessages.splice(messageIndexToAccept, 1);
            localStorage.setItem(`${user.id}_receivedMessages`, JSON.stringify(savedMessages));
            setReceivedMessages(savedMessages);
        }
    }
    const handleClose = ()=> {
        navigate('/')
    }

    return (
        <div className="">
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                <AppBar sx={{ position: 'relative', backgroundColor: "white", color: "black" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <p className="font-semibold text-lg ml-3">Awaiting shared wallet</p>
                    </Toolbar>
                </AppBar>
            </Slide>
            {receivedMessages.length > 0 ?
                (receivedMessages.map(message => (
                        <Card variant="outlined" className='md:w-[650px] mx-auto mt-10 pb-4'>
                            <div className='flex text-center justify-between mx-3 my-4 px-4'>
                                <div className='text-center flex items-center'>
                                    <div>
                                        <img src="https://static.moneylover.me/img/icon/icon.png" className='w-12 h-12'
                                             alt=""/>
                                    </div>
                                    <div className="flex-col justify-items-center text-start ml-4">
                                        <div className=' font-semibold text-lg'>{message?.senderEmail}</div>
                                        <div
                                            className=' font-semibold text-xs text-graynew'>{message?.senderEmail}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        className="px-8 py-2 bg-slate-200 rounded text-lightgreen font-semibold"
                                        onClick={() => handleReject(message?.id)}>REJECT
                                    </button>
                                    <button className="px-8 py-2 bg-lightgreen rounded text-white font-semibold"
                                            onClick={() => handleAccept(message?.id)}>ACCEPT
                                    </button>
                                </div>
                            </div>
                            <div className="border rounded ml-28 mr-10 mt-4 p-2 px-4">
                                <div className='text-center flex items-center pb-2'>
                                    <div>
                                        <img src={message?.walletInfo.icon.icon} className='w-10 h-10' alt=""/>
                                    </div>
                                    <div className="flex-col justify-items-center text-start ml-4">
                                        <p className=' font-semibold text-base'>{message?.walletInfo.name}</p>
                                        <p className=' font-semibold text-xs text-graynew'>{numeral(message?.walletInfo.amountOfMoney).format(0,0) } {message?.walletInfo.currency.sign}</p>
                                    </div>
                                </div>
                                <div className="mb-4">{message?.message}</div>
                            </div>
                        </Card>
                    ))
                )
                :
                (<div className="mt-20 text-center text-lg">No shared wallet invitations</div>)}
        </div>
    )
}