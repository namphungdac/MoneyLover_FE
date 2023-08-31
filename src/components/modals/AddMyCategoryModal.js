import * as React from 'react';
import { Box, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionService } from '../../services/transaction.service';
import { getAllCategory, getAllExpense, getAllIncome } from '../../redux/transactionSlice';

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

export default function AddMyCategoryModal({ isOpen, onClose, onSubmit, selectType }) {
    const [input, setInput] = React.useState('');
    const [isVaid, setIsValid] = React.useState(false);
    const [checkName, setCheckName] = React.useState(true);
    const allCategory = useSelector(state => state.transaction.allCategory);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        let typeCategory = selectType ? 'income' : 'expense';
        TransactionService.createNewCategory({ type: typeCategory, name: input }).then(res => {
            if (res.data.message === "Create category success") {
                TransactionService.getAllCategory().then(res => {
                    let categoryList = res.data.categoryList;
                    let inComeList = categoryList.filter(category => category.type === 'income');
                    let expenseList = categoryList.filter(category => category.type === 'expense');
                    dispatch(getAllCategory(categoryList));
                    dispatch(getAllIncome(inComeList));
                    dispatch(getAllExpense(expenseList));
                })
            }
        }).catch(e => console.log(e.message));
        onSubmit();
        setInput('');
        setIsValid(false);
        setCheckName(true);
    }
    const handleCancel = () => {
        onSubmit()
    }
    const handleCheckValid = (e) => {
        const input = e.target.value;
        (input) ? setIsValid(true) : setIsValid(false);
    }
    React.useEffect(() => {
        let nameCheck = allCategory?.find(item => item.name === input);
        nameCheck ? setCheckName(false) : setCheckName(true);
    }, [input])

    const handleChange = (e) => {
        let name = e.target.value
        setInput(name);
        handleCheckValid(e);
    }

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 496 }}>
                    <div className='px-6 py-5 border-b-[1px] border-gray-300'>
                        <p className='text-xl font-semibold'>Add New Category</p>
                    </div>
                    <div className='m-4 py-[5px] px-[15px] border border-gray-300 rounded-lg hover:border-gray-500 hover: cursor-pointer'>
                        <p className='text-[12px] pb-[3px] text-slate-400'>Category Name</p>
                        <div className='pb-1'>
                            <input onChange={handleChange} className='inputAdd w-full h-[27px] text-[17px] focus:outline-none' tabIndex="-1" type="text" name="name" value={input} placeholder="Your category name?" id="name" />
                        </div>
                    </div>
                    <div className=' text-center'>{!checkName ? (<p className="text-red-500 text-sm mt-3">Tên đã tồn tại!</p>) : null}</div>
                    <div className='py-[14px] px-6 flex justify-end'>
                        <button type='button' onClick={handleCancel} className='bg-slate-400 text-white text-sm font-medium py-2 px-8 uppercase rounded mr-3'>Cancel</button>
                        <button type='button' onClick={handleSubmit} className='bg-lightgreen text-white text-sm font-medium py-2 px-8 uppercase rounded disabled:bg-slate-400' disabled={!isVaid || !checkName}>Save</button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
