import * as React from 'react';
import { Box, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionService } from '../../services/transaction.service';
import { getAllCategory, getAllExpense, getAllIncome } from '../../redux/transactionSlice';
import { useTranslation } from "react-i18next";
import AddMyCategoryModal from '../modals/AddMyCategoryModal';

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

export default function CategorySelectModal({ selectCategory, categoryBefore, checkAllCategory }) {
    const { t } = useTranslation()
    const [open, setOpen] = React.useState(false);
    const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
    const allCategory = useSelector(state => state.transaction.allCategory);
    const allIncome= useSelector(state => state.transaction.allIncome);
    const allExpense= useSelector(state => state.transaction.allExpense);
    const [selectInCome, setSelectIncome] = React.useState(false);
    const [categorySelect, setCategorySelect] = React.useState(categoryBefore ? categoryBefore : null);
    const dispatch = useDispatch();
    React.useEffect(() => {
        TransactionService.getAllCategory().then(res => {
            let categoryList = res.data.categoryList;
            let inComeList = categoryList.filter(category => category.type === 'income');
            let expenseList = categoryList.filter(category => category.type === 'expense');
            dispatch(getAllCategory(categoryList));
            dispatch(getAllIncome(inComeList));
            dispatch(getAllExpense(expenseList));
        })
    }, [])

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSelectExpense = () => {
        setSelectIncome(false);
    }
    const handleSelectInCome = () => {
        setSelectIncome(true);
    }
    const handleSelectCategory = (idCategory) => {
        let category = allCategory?.find(category => category.id === idCategory);
        if (category) {
            setCategorySelect(category);
            selectCategory(category);
            setOpen(false);
        }
    }

    const handleSelectAllCategory = () => {
        selectCategory('all');
        setOpen(false);

    }

    const handleOpenAddCategoryModal = () => {
        setOpenCategoryModal(true);
    }
    const handleCloseCategoryModal = () => {
        setOpenCategoryModal(false);
    }
    const handleSubmitAddCategoryModal = () => {
        setOpenCategoryModal(false);
    }
    
    return (<React.Fragment>
        <button onClick={handleOpen}>
            <p className='text-[12px] pb-[3px] text-slate-400 text-start'>{t("Category")}</p>
            <div className='wrap-text-icon'>
                <div onClick={handleSelectCategory} className='flex justify-center items-center'>
                    {categorySelect && categorySelect !== 'all' ? (<>
                        <img src={categorySelect.icon} className="w-6 h-6 object-cover mr-4 rounded-full"
                            alt='icon-flag' />
                        <span className="text-input text-start">{t(`${categorySelect.name}`)}</span>
                    </>) : <>
                        {
                            checkAllCategory ?
                                <>
                                    <img src='https://static.moneylover.me/img/icon/ic_category_all.png'
                                        className="w-6 h-6 object-cover mr-4 rounded-full" alt='icon-flag' />
                                    <span className="text-input text-slate-400 ml-4">{t("All Category")}</span>
                                </>
                                : <>
                                    <img src='https://static.moneylover.me/img/icon/icon_not_selected.png'
                                        className="w-6 h-6 object-cover mr-4 rounded-full" alt='icon-flag' />
                                    <span className="text-input text-slate-400 ml-4">{t("Select Category")}</span>
                                </>
                        }</>}
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                            stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{ ...style, width: 600, maxHeight: 500, overflowY: 'auto' }}>
                <div>
                    <div className=' border-b-[1px] sticky top-0 bg-white'>
                        <div className='py-2'>
                            <div className='flex justify-between items-center'>
                                <span onClick={handleClose}
                                    className='mt-1 w-12 h-12 flex justify-center items-center cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                        stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </span>
                                <span className='tracking-wide font-medium text-[20px] ml-4'>{t("Select Category")}</span>
                                <div className='relative mr-4'>
                                    <input type='search'
                                        className='ml-10 px-12 py-2 border rounded-3xl bg-neutral-100 focus:outline-none'
                                        placeholder="Search..." />
                                    <svg className='absolute top-3 left-14 w-5 h-5' xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className=" h-[48px] fomt-normal border-t flex justify-center mx">
                                <button onClick={handleSelectExpense}
                                    className={`w-full py-[15px] uppercase leading-4 text-sm font-semibold border-b ${!selectInCome ? "border-lightgreen text-lightgreen" : "text-zinc-400" } `}>{t("Expense")}
                                </button>
                                <button onClick={handleSelectInCome}
                                    className={`w-full py-[15px] uppercase leading-4 text-sm font-semibold ${selectInCome ? "border-lightgreen text-lightgreen" : "text-zinc-400" } `}>{t("Income")}
                                </button>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 scroll-smooth mt-2'>
                        {selectInCome ? allIncome?.length > 0 && allIncome.map(category => (<div key={category.id}
                            className='flex justify-start items-center p-2 cursor-pointer hover:bg-lime-50 pl-6'
                            onClick={() => handleSelectCategory(category.id)}>
                            <img id={category.id} src={category.icon} className='object-cover w-8 h-8'
                                alt="" />
                            <div className='flex-col items-center ml-5'>
                                <p className='text-sm font-medium'>{t(`${category.name}`)}</p>
                            </div>
                        </div>)) : <>
                            {checkAllCategory ? <div key={"category"}
                                className='flex justify-start items-center p-2 cursor-pointer hover:bg-lime-50 pl-6'
                                onClick={() => handleSelectAllCategory()}>
                                <img id='category'
                                    src='https://static.moneylover.me/img/icon/ic_category_all.png'
                                    className='object-cover w-8 h-8' alt="" />
                                <div className='flex items-center ml-5'>
                                    <p className='text-sm font-medium'>{t("All category")}</p>
                                </div>
                            </div> : null}
                            {allExpense.length > 0 && allExpense.map(category => (
                                <div>
                                    <div key={category.id}
                                        className='flex justify-between items-center'
                                        onClick={() => handleSelectCategory(category.id)}>
                                        <div className='flex justify-start cursor-pointer w-full p-2 pl-6 hover:bg-lime-50'>
                                            <img id={category.id} src={category.icon}
                                                className='object-cover w-8 h-8' alt="" />
                                            <div className='flex items-center ml-5'>
                                                <p className='text-sm font-medium'>{t(`${category.name}`)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                        }
                    </div>
                </div>
                <div onClick={handleOpenAddCategoryModal} className='flex justify-center py-4 px-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="#000000" className="w-12 h-12 cursor-pointer hover:stroke-lightgreen">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </Box>
        </Modal>
        <AddMyCategoryModal isOpen={openCategoryModal} onClose={handleCloseCategoryModal} onSubmit={handleSubmitAddCategoryModal} selectType={selectInCome} />
    </React.Fragment>);
}