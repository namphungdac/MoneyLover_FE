import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import Typography from '@mui/material/Typography';
import {blue} from '@mui/material/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getAllWallet, setAllWallet, setWalletSelect} from '../../redux/walletSlice';
import {useEffect, useState} from "react";
import numeral from 'numeral';
import {WalletService} from "../../services/wallet.service";
import {useTranslation} from "react-i18next";

function SimpleDialog(props) {
    const {t}=useTranslation()
    const {onClose, selectedValue, open} = props;
    let walletList = useSelector(state => state.wallet.allWallet);
    const walletSelect = useSelector(state => state.wallet.walletSelect)
    const [totalMoney, setTotalMoney] = useState(0)
    const transactionSelect = useSelector(state => state.transaction.transactionSelect);
    const allTransaction = useSelector(state => state.transaction.allTransaction);
    const dispatch = useDispatch();
    useEffect(() => {
        WalletService.getAllWallet().then(res => {
            dispatch(getAllWallet(res.data.walletList))
            dispatch(setWalletSelect(res.data.walletList[0]))
        })
    }, []);
    const handleClose = () => {
        onClose(selectedValue);
    };
    useEffect(() => {
        setTotalMoney(0)
         walletList.forEach(wallet => {
            setTotalMoney(prevTotal => prevTotal + wallet.amountOfMoney);
        })
    }, [transactionSelect, walletList, allTransaction]);
    const handleListItemClick = (value) => {
        if (value) {
            onClose(value);
            setWalletSelect(value)
        }
    };


    return (<Dialog onClose={handleClose} open={open}>
        <DialogTitle>{t("select Wallet")}</DialogTitle>
        <List sx={{pt: 0, width: "500px"}}>
            <ListItem disableGutters>
                <ListItemButton>
                    <ListItemAvatar>
                        <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                            <PersonIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={t("Total monney")}
                        secondary={
                            <React.Fragment>
                                <Typography variant="body2" color="text.secondary">
                                    {numeral(totalMoney).format(0, 0)} {walletSelect?.currency.sign}
                                </Typography>
                            </React.Fragment>
                        }
                    />
                </ListItemButton>
            </ListItem>
            {walletList?.length > 0 && walletList.map((wallet) => (
                <ListItem disableGutters>
                    <ListItemButton onClick={() => handleListItemClick(wallet)} key={wallet.id}>
                        <ListItemAvatar>
                            <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                                <img src={wallet.icon.icon} alt=""/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={wallet.name}
                            secondary={
                                <React.Fragment>
                                    <Typography variant="body2" color="text.secondary">
                                        {numeral(wallet.amountOfMoney).format(0, 0)} {wallet.currency.sign}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Dialog>);
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired, open: PropTypes.bool.isRequired, selectedValue: PropTypes.string.isRequired,
};

export default function SelectWallets() {
    const {t}=useTranslation()
    const [open, setOpen] = React.useState(false);
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    let walletList = useSelector(state => state.wallet.allWallet);
    const dispatch = useDispatch();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if (typeof value === "object" && value !== null) {
            dispatch(setWalletSelect(value))
            // dispatch(getAllWallet(value))
        }
    };

    return (
        <div>
            <Button sx={{color: "black", justifyContent: "left", textTransform: 'lowercase'}} onClick={handleClickOpen}>
                {walletSelect?.name}
            </Button>
            <Typography variant="subtitle1" component="div">
                {walletSelect?.amountOfMoney > 0 ? "+" : null} {numeral(walletSelect?.amountOfMoney).format(0, 0)} {walletSelect?.currency.sign}
            </Typography>
            <SimpleDialog
                selectedValue={walletSelect?.name}
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}