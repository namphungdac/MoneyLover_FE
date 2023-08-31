import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { TransactionService } from '../../services/transaction.service';
import { getAllCategory, getAllExpense, getAllIncome } from '../../redux/transactionSlice';

export default function ModalDeleteCategory({ idCategory, onClose }) {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        TransactionService.deleteMyCategory(idCategory).then(res => {
            if (res.data.message === "Delete category success!") {
                TransactionService.getAllCategory().then(res => {
                    let categoryList = res.data.categoryList;
                    let inComeList = categoryList.filter(category => category.type === 'income');
                    let expenseList = categoryList.filter(category => category.type === 'expense');
                    dispatch(getAllCategory(categoryList));
                    dispatch(getAllIncome(inComeList));
                    dispatch(getAllExpense(expenseList));
                    onClose();
                }).catch(err => console.log(err.message));
            }
        }).catch(err => console.log(err.message));
        handleClose();
    }
    const { t } = useTranslation()

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
                {t("Are you sure want to delete this Category?")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {t("Delete can't get it back ^^")}
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