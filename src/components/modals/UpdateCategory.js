import { Box } from "@mui/material";
import * as React from "react";
import Modal from "@mui/material/Modal";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TransactionService } from "../../services/transaction.service";
import { getAllCategory, getAllExpense, getAllIncome } from "../../redux/transactionSlice";

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

export default function UpdateCategory({ isOpen, onClose, onSubmit, categorySelect }) {
    const [isValid, setIsValid] = useState(false);
    const [input, setInput] = useState('');
    const [checkName, setCheckName] = React.useState(true);
    const allCategory = useSelector(state => state.transaction.allCategory);
    const dispatch = useDispatch();

    const { t } = useTranslation()

    const handleCheckValid = (e) => {
        let input = e.target.value;
        (input) ? setIsValid(true) : setIsValid(false);
    }
    React.useEffect(() => {
        let nameCheck = allCategory?.find(item => item.name === input);
        nameCheck ? setCheckName(false) : setCheckName(true);
    }, [input])

    const handleChangeInput = (e) => {
        let name = e.target.value
        setInput(name);
        handleCheckValid(e);
    }
    const handleUpdateCategory = () => {
        TransactionService.updateMyCategory(categorySelect?.id, { name: input }).then(res => {
            if (res.data.message === "Update category success!") {
                TransactionService.getAllCategory().then(res => {
                    let categoryList = res.data.categoryList;
                    let inComeList = categoryList.filter(category => category.type === 'income');
                    let expenseList = categoryList.filter(category => category.type === 'expense');
                    dispatch(getAllCategory(categoryList));
                    dispatch(getAllIncome(inComeList));
                    dispatch(getAllExpense(expenseList));
                    let categorySelectNew = categoryList.find(item => item.id === categorySelect?.id);
                    if (categorySelectNew) {
                        onSubmit(categorySelectNew);
                    } else{
                        onClose();
                    }
                }).catch(err => console.log(err.message));
            }
        }).catch(err => console.log(err.message));
        setCheckName(true);
        setIsValid(false);
        setInput('');
    }

    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 496 }}>
                    <div className='px-6 py-5 border-b-[1px] border-gray-300'>
                        <p className='text-xl font-semibold'>{t("Update category")}</p>
                    </div>
                    <div className='p-6'>
                        <div className="">
                            <div className='flex item-center justify-center'>
                                <div
                                    className='mb-4 py-[5px] px-[15px] border w-full border-gray-300 rounded-lg hover:border-gray-500 hover: cursor-pointer'>
                                    <p className='text-[12px] pb-[3px] text-slate-400'>Email </p>
                                    <div className='pb-1'>
                                        <input onChange={handleChangeInput}
                                            className='inputAdd w-full h-[27px] text-[17px] focus:outline-none'
                                            tabIndex="-1" type="name" name="name" value={input}
                                            placeholder={t("Category name")} id="name" />
                                    </div>
                                </div>
                            </div>

                        </div>
                        {!checkName ? <p className="text-red-500 text-xs text-center">Tên đã tồn tại!</p> : null}
                    </div>
                    <div className='py-[14px] px-6 flex justify-end'>
                        <button onClick={handleUpdateCategory} type='button' disabled={!isValid || !checkName}
                            className='bg-lightgreen text-white text-sm font-medium py-2 px-8 uppercase rounded disabled:bg-slate-400'>{t("Save")}
                        </button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}