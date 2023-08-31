
import * as React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    AppBar, Box, Card, Container, Grid, IconButton, Slide, Stack, Toolbar, Typography
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import ClearIcon from "@mui/icons-material/Clear";
import ModalDeleteWallets from './ModalDeleteWallets';
import { WalletService } from '../../services/wallet.service';
import { getAllWallet, setWalletSelect } from '../../redux/walletSlice';
import UpdateModal from '../modals/UpdateModal';
import NestedModal from '../modals/NestedModal';
import { useNavigate } from 'react-router-dom';
import TranferModal from '../modals/TranferModal';
import ShareWallet from "../modals/ShareWallet";
import numeral from 'numeral';
import { useTranslation } from "react-i18next";
import ClipLoader from 'react-spinners/ClipLoader';

const override = {
    position: "absolute",
    bgcolor: '#fff',
    left: "50%",
    top: "50%",
    transform: 'translate(-50%, -50%)',
};

export default function CardWallet() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingLeave, setIsLoadingLeave] = React.useState(false);
    const { t } = useTranslation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [checked, setChecked] = React.useState(false);
    const [openFormCreate, setOpenFormCreate] = React.useState(false);
    const [openFormUpdate, setOpenFormUpdate] = React.useState(false);
    const [openFormTranfer, setOpenFormTranfer] = React.useState(false);
    const [openShareWallet, setOpenShareWallet] = React.useState(false);
    const [allUsersOfTheWallet, setAllUsersOfTheWallet] = React.useState([]);
    const allWallet = useSelector(state => state.wallet.allWallet);
    const walletSelect = useSelector(state => state.wallet.walletSelect);

    const handleOpenSlide = (idWallet) => {
        setChecked(false);
        setIsLoading(true);
        WalletService.getInfoWallet(idWallet).then(res => {
            dispatch(setWalletSelect(res.data.wallet));
            setAllUsersOfTheWallet(res.data.allUsersOfTheWallet);
            setIsLoading(false);
            setChecked(true);
        });
    };

    const handleCloseSlide = () => {
        setChecked(false);
    };
    const handleClose = () => {
        navigate('/');
    }

    const handleOpenFormCreate = () => {
        setOpenFormCreate(true);
    }
    const handleCloseFormCreate = () => {
        setOpenFormCreate(false);
    }
    const handleSubmitFormCreate = () => {
        handleCloseFormCreate();
        setChecked(true);
    }
    const handleOpenShare = () => {
        setOpenShareWallet(true)
    }
    const handleCloseShare = () => {
        setOpenShareWallet(false)
    }

    const handleOpenFormUpdate = () => {
        setOpenFormUpdate(true);
    }
    const handleCloseFormUpdate = () => {
        setOpenFormUpdate(false);
    }
    const handleSubmitFormUpdate = () => {
        handleCloseFormUpdate();
        setChecked(true);
    }
    const handleCheckboxChange = () => {
        WalletService.archivedWallet(walletSelect.id).then(() => {
            handleOpenSlide(walletSelect?.id)
        })
    };

    const handleOpenFormTranfer = () => {
        setOpenFormTranfer(true);
    }
    const handleCloseFormTranfer = () => {
        setOpenFormTranfer(false);
    }
    const handleSubmitFormTranfer = () => {
        handleCloseFormTranfer();
        setChecked(true);
    }
    const handleLeave = () => {
        setIsLoadingLeave(true);
        WalletService.leaveWallet(walletSelect?.walletRoles[0].id, '').then(res => {
            if (res.data.message === 'Leave wallet success!') {
                WalletService.getAllWallet().then(res => {
                    setIsLoadingLeave(false);
                    dispatch(getAllWallet(res.data.walletList))
                })
            }
            setChecked(false);
        }).catch(err => console.log(err.message));

    }

    return (<div>
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <div>
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
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {t("My Wallets")}
                        </Typography>
                        <Button onClick={handleOpenFormCreate} variant="contained" sx={{ backgroundColor: "#1aa333" }}
                            disableElevation>
                            <b>{t("ADD WALLET")}</b>
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        </Slide>
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <Container>
                <Box sx={{ margin: " 50px auto" }}>
                    <Grid container justifyContent="center" spacing={2}>
                        <Grid item xs={4}>
                            <Card sx={{ maxWidth: 578 }} variant="outlined">
                                <Box sx={{
                                    position: 'relative',
                                    backgroundColor: "#f4f4f4",
                                    color: "black",
                                    height: "40px",
                                }}>
                                    <p style={{ padding: "5px 10px" }}>{t("excludedFromTotal")}</p>
                                </Box>
                                <>
                                    {allWallet?.length > 0 && allWallet?.map(wallet => (
                                        <div key={wallet.id}>
                                            <Button onClick={() => handleOpenSlide(wallet.id)} variant="outlined"
                                                fullWidth color="success"
                                                sx={{ color: "black", paddingX: 0 }}>
                                                <div className='w-full flex justify-between'>
                                                    <div className='flex items-center gap-4 ml-4 py-4'>
                                                        <img src={wallet.icon.icon}
                                                            className='w-10 h-10'
                                                            alt="" />
                                                        <div className='text-start'>
                                                            <span className='lowercase'>{wallet.name}</span><br />
                                                            <span>{numeral(wallet.amountOfMoney).format(0.0)} </span>
                                                            <span className='lowercase'>{wallet.currency.sign} </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className={` lowercase text-white text-xs px-1 py-1 font-semibold rounded-sm mt-1 mr-2 ${wallet?.walletRoles[0].role === 'owner' ? 'bg-orange-400' : `${wallet?.walletRoles[0].role === 'using' ? 'bg-lightgreen' : 'bg-sky-400'}`}`}>{wallet?.walletRoles[0].role}</span>
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                    ))}
                                </>
                            </Card>
                        </Grid>
                        {isLoading && <Grid item xs={8}>
                            <div className='relative w-full h-full'>
                                <ClipLoader
                                    size={35}
                                    loading={isLoading}
                                    cssOverride={override}
                                    aria-label="Loading Spinner"
                                    color="#2db84c"
                                />
                            </div>
                        </Grid>
                        }
                        {walletSelect && checked && <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                            < Grid item xs={8}>
                                <Card variant="outlined">
                                    <Box sx={{
                                        position: 'relative',
                                        color: "black",
                                        height: "50px",
                                        borderBottom: "1px solid #ececec"
                                    }}>
                                        <div style={{ padding: "6px 10px", }}><Button sx={{ color: "black" }}
                                            onClick={handleCloseSlide}><ClearIcon
                                                sx={{ float: "left" }} /></Button>
                                            <b style={{ marginLeft: "30px" }}>{t("walletDetails")}</b>
                                            <Stack direction="row" sx={{ float: "right" }}
                                                spacing={2}>
                                                {walletSelect?.walletRoles && walletSelect?.walletRoles[0].role === 'owner' ?
                                                    <ModalDeleteWallets
                                                        sx={{ height: "402px" }}
                                                        idWallet={walletSelect?.id}
                                                        onClose={handleCloseSlide}
                                                    />
                                                    :
                                                    <Button onClick={handleLeave}
                                                        color='error'>{t("leave")}</Button>
                                                }
                                                {walletSelect?.walletRoles && walletSelect?.walletRoles[0].archived === false && walletSelect?.walletRoles[0].role !== 'viewer' ?
                                                    <Button onClick={handleOpenFormUpdate}
                                                        color='success'>{t("edit")}</Button>
                                                    :
                                                    null
                                                }
                                                {isLoadingLeave &&
                                                    <ClipLoader
                                                        size={35}
                                                        loading={isLoadingLeave}
                                                        cssOverride={override}
                                                        aria-label="Loading Spinner"
                                                        color="#2db84c"
                                                    />
                                                }
                                            </Stack>
                                        </div>
                                    </Box>
                                    <div
                                        style={{ color: "black", justifyContent: "left", textAlign: "left" }}>
                                        <div>
                                            <img src={walletSelect?.icon.icon} className='w-12 h-12 float-left mx-4' alt="" />
                                            <div style={{ textAlign: "left", margin: "15px" }}>
                                                <span className='lowercase'>{walletSelect?.name}</span><br />
                                                <span>{numeral(walletSelect?.amountOfMoney).format(0, 0)} </span>
                                                <span className='lowercase'>{walletSelect?.currency.sign} </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border-t px-16 pt-2 pb-4'>
                                        <p className='pb-2 font-medium text-graynew'>{t("User Account")}</p>
                                        <div className=''>
                                            {allUsersOfTheWallet?.length > 0 && allUsersOfTheWallet.map(item => (
                                                <div key={item.id} className='flex gap-3 py-2'>
                                                    <img className='w-12 h-12' src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="ảnh" />
                                                    <div>
                                                        <div className='flex gap-3 mb-1'>
                                                            <span className='font-semibold'>{item.email}</span>
                                                            <span className={` text-white text-xs px-1 font-semibold rounded-sm mt-1 ${item.role === 'owner' ? 'bg-orange-400' : `${item.role === 'using' ? 'bg-lightgreen' : 'bg-sky-400'}`}`}>{item.role}</span>
                                                        </div>
                                                        <p className='text-xs text-graynew'>{item.email}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* 
                                                <>
                                                    {messageUser?.walletInfo.id === walletSelect?.id ?
                                                        <div className='flex gap-3 py-2'>
                                                            <img className='w-12 h-12' src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" alt="ảnh" />
                                                            <div>
                                                                <div className='flex gap-3 mb-1'>
                                                                    <span className='font-semibold'>{messageUser.receivedEmail}</span>
                                                                    <span className={` text-white text-xs px-1 font-semibold rounded-sm mt-1 bg-graynew `}>Waiting...</span>
                                                                </div>
                                                                <p className='text-xs text-graynew'>{messageUser.receivedEmail}</p>
                                                            </div>
                                                        </div>
                                                        :
                                                        null
                                                }
                                                </> */}

                                        </div>
                                    </div>
                                    {walletSelect?.walletRoles && walletSelect?.walletRoles[0].role !== 'viewer' ?
                                        <>
                                            {walletSelect?.walletRoles[0].role === 'owner' ?
                                                <>
                                                    {walletSelect?.walletRoles[0].archived === false ? (<>
                                                        <Button sx={{ borderTop: "1px solid #ececec", color: "green" }}
                                                            fullWidth
                                                            onClick={handleCheckboxChange}>
                                                            <Grid item xs={12}>
                                                                <b>{t("archived")}</b>
                                                            </Grid>
                                                        </Button>
                                                        <Button disabled={(walletSelect?.amountOfMoney <= 0) || (allWallet?.length <= 1)} onClick={handleOpenFormTranfer}
                                                            fullWidth
                                                            sx={{ borderTop: "1px solid #ececec", color: "green" }}>
                                                            <Grid item xs={12}>
                                                                <b>{t("transferMoney")}</b>
                                                            </Grid>
                                                        </Button>
                                                        <Button fullWidth sx={{ borderTop: "1px solid #ececec", color: "green" }} onClick={handleOpenShare}>
                                                            <Grid item xs={12}>
                                                                <b>{t("shareWallet")}</b>
                                                            </Grid>
                                                        </Button>
                                                    </>) : (
                                                        <>
                                                            <Button sx={{ borderTop: "1px solid #ececec", color: "green" }}
                                                                fullWidth
                                                                onClick={handleCheckboxChange}>
                                                                <Grid item xs={12}>
                                                                    <b>{t("unarchived")}</b>
                                                                </Grid>
                                                            </Button>
                                                        </>
                                                    )}
                                                </>
                                                :
                                                <>
                                                    {walletSelect?.walletRoles[0].archived === false ?

                                                        <Button sx={{ borderTop: "1px solid #ececec", color: "green" }}
                                                            fullWidth
                                                            onClick={handleCheckboxChange}>
                                                            <Grid item xs={12}>
                                                                <b>{t("archived")}</b>
                                                            </Grid>
                                                        </Button>

                                                        :
                                                        <Button sx={{ borderTop: "1px solid #ececec", color: "green" }}
                                                            fullWidth
                                                            onClick={handleCheckboxChange}>
                                                            <Grid item xs={12}>
                                                                <b>{t("unarchived")}</b>
                                                            </Grid>
                                                        </Button>
                                                    }
                                                </>
                                            }
                                        </>
                                        :
                                        null
                                    }
                                </Card>
                            </Grid>
                        </Slide>}
                    </Grid>
                    <UpdateModal isOpen={openFormUpdate} onClose={handleCloseFormUpdate}
                        onSubmit={handleSubmitFormUpdate} />
                    <NestedModal isOpen={openFormCreate} onClose={handleCloseFormCreate}
                        onSubmit={handleSubmitFormCreate} />
                    <TranferModal isOpen={openFormTranfer} onClose={handleCloseFormTranfer}
                        onSubmit={handleSubmitFormTranfer} />
                    <ShareWallet isOpen={openShareWallet} onClose={handleCloseShare} />
                </Box>
            </Container>
        </Slide>
    </div >);
}
