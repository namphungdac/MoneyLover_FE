import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { WalletService } from "../../services/wallet.service";
import { useDispatch } from "react-redux";
import { getAllWallet, setWalletSelect } from "../../redux/walletSlice";
import { useTranslation } from "react-i18next";
import { transactionLogout } from '../../redux/transactionSlice';
import ClipLoader from "react-spinners/ClipLoader";

const override = {
    position: "absolute",
    bgcolor: '#fff',
    left: "50%",
    top: "50%",
    transform: 'translate(-50%, -50%)',
};


export default function ModalDeleteWallets({ idWallet, onClose }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation()
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        setIsLoading(true);
        WalletService.deleteWallet(idWallet).then(() => {
            dispatch(transactionLogout())
            WalletService.getAllWallet().then(res => {
                let walletList = res.data.walletList;
                dispatch(getAllWallet(walletList));
                dispatch(setWalletSelect(walletList[0]))
                setIsLoading(false);
                handleClose();
                onClose();
            }).catch(err => console.log(err.message));
        }).catch(err => console.log(err.message));
    }

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
                {"Bạn có chắc muốn xóa ví này?"}
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
            <div className='flex justify-center gap-4 py-2'>
                <Button color="success" variant="outlined" onClick={handleClose} autoFocus>{t("Cancel")}</Button>
                <Button color="error" variant="contained" onClick={() => {
                    handleDelete()
                }}>
                    {t("DELETE")}
                </Button>
            </div>
        </Dialog>
    </div>);
}