import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from "react-redux";
import { TransactionService } from '../../services/transaction.service';
import { getAllTransaction, setTransactionSelect } from '../../redux/transactionSlice';
import {getAllWallet, setWalletSelect} from '../../redux/walletSlice';
import {WalletService} from "../../services/wallet.service";
import {useTranslation} from "react-i18next";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
    position: "absolute",
    bgcolor: '#fff',
    left: "50%",
    top: "50%",
    transform: 'translate(-50%, -50%)',
};

export default function ModalDeleteTrans({ idWallet, onClose }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    let transactionSelect= useSelector(state => state.transaction.transactionSelect);
    let walletSelect = useSelector(state => state.wallet.walletSelect);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        setIsLoading(true);
        TransactionService.deleteTransaction(idWallet, transactionSelect?.id).then((res) => {
            if (res.data.message === 'Delete transaction success!') {
                let newMoney;
                if (transactionSelect.category.type === 'expense') {
                    newMoney = walletSelect.amountOfMoney + transactionSelect.amount
                } else newMoney = walletSelect.amountOfMoney - transactionSelect.amount
                dispatch(setWalletSelect({...walletSelect, amountOfMoney: newMoney}))
                TransactionService.getAllTransactionOfWallet(idWallet).then(res => {
                    let transactionList = res.data.transactionList;
                    dispatch(getAllTransaction(transactionList));
                    dispatch(setTransactionSelect(transactionList[0]))
                    WalletService.getAllWallet().then(res => {
                        dispatch(getAllWallet(res.data.walletList));
                    })
                    setIsLoading(false);
                    onClose();

                }).catch(err => console.log(err.message));
            } else {
                alert('không có quyền xóa');
            }
            handleClose();
        }).catch(err => console.log(err.message));
    }
    const {t}=useTranslation()

    return (<div>
        <Button color="error" onClick={handleClickOpen}>
            {t("DELETE")}
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {t("Are you sure want to delete this Transaction?")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                <ClipLoader
                        size={25}
                        loading={isLoading}
                        cssOverride={override}
                        aria-label="Loading Spinner"
                        color="#2db84c"
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="success" variant="outlined" onClick={handleClose} autoFocus>{t("Cancel")}</Button>
                <Button color="error" variant="contained" onClick={() => {
                    handleDelete();
                }}>
                    {t("DELETE")}
                </Button>
            </DialogActions>
        </Dialog>
    </div>);
}