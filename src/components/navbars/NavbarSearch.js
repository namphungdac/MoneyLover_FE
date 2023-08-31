import {AppBar, IconButton, Slide, Toolbar, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import * as React from "react";
import {Link} from "react-router-dom";
import {setWalletSelect} from "../../redux/walletSlice";
import WalletSelectTransactionModal from "../transactions/WalletSelectTransaction";
import {useDispatch, useSelector} from "react-redux";
import CategorySelectModal from "../transactions/CategorySelectModal";
import {useEffect, useState} from "react";
import SelectTimeRangeModal from "../modals/SelectTimeRangeModal";
import {TransactionService} from "../../services/transaction.service";
import {getListTransactionSearch} from "../../redux/searchSlice";
import {Range} from "react-range";
import {useTranslation} from "react-i18next";

export default function NavbarSearch() {
    const dispatch = useDispatch();
    const [categorySelect, setCategorySelect] = React.useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const dateSelect = useSelector(state => state.report.dateSelect);
    const [dataInput, setDataInput] = React.useState({note: ''});
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const allTransaction = useSelector(state => state.transaction.allTransaction);
    const [minObject,setMinObject] = useState(allTransaction[0]?.amount||0)
    const [maxObject,setMaxObject] = useState(allTransaction[0]?.amount||100)
    const [values, setValues] = useState([minObject, maxObject]);

    function convertDateFormat(inputDate) {
        const parts = inputDate.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const newDate = `${year}-${month}-${day}`;
        return newDate;
    }

    useEffect(() => {
        allTransaction?.forEach((item) => {
            if (item.amount < minObject) {
                setMinObject(item.amount)
            }
            if (item.amount > maxObject) {
                setMaxObject(item.amount)
            }
        })
        setValues([minObject, maxObject])

    }, [walletSelect, allTransaction]);
    useEffect(() => {

    }, [minObject, maxObject]);
    if (minObject === maxObject) {
        let max = minObject + 100
        setMaxObject(max)
    }
    const handleChange = (newValues) => {
        setValues(newValues);
    };

    useEffect(() => {
        let firstDay = convertDateFormat(dateSelect?.firstDay);
        let lastDay = convertDateFormat(dateSelect?.lastDay);
        TransactionService.searchTransactionsByTimeRangeAndCategory(walletSelect?.id, firstDay, lastDay,categorySelect?.id,values[0],values[1]).then(res => {
            let transactionList = res.data.transactionList;
            dispatch(getListTransactionSearch(transactionList))
        }).catch(err => console.log(err.message))
    }, [dateSelect, walletSelect,categorySelect,values]);





    const handleSelectWallet = (wallet) => {
        dispatch(setWalletSelect(wallet));

    }
    const handleSelectCategory = (category) => {
        setCategorySelect(category)
    }
    const handleOpenTimeRangeModal = () => {
        setIsOpenModal(true);
    }
    const handleCloseTimeRangeModal = () => {
        setIsOpenModal(false)
    }
    const handleChangeAdd = (e) => {
        let data = {...dataInput, [e.target.name]: e.target.value};
        setDataInput(data);
        // handleCheckValid(e);
    }
    const {t}=useTranslation()


    return (<div className="navbarSearch">
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <AppBar sx={{position: 'relative', backgroundColor: "white", color: "black"}}>
                <Toolbar>
                    <Link to="/">
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="close"
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                    </Link>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        {t("Search for transaction")}
                    </Typography>
                </Toolbar>
                <div>
                    <div className=" mx-20 my-5 grid grid-cols-4 gap-2">
                        <div
                            className='w-[300px] mr-4 py-1 pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500 hover:cursor-pointer'>
                            <WalletSelectTransactionModal walletTransSelect={handleSelectWallet}/>
                        </div>
                        <div
                            className='w-[300px] mr-4 py-1 pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500 hover:cursor-pointer'>
                            <CategorySelectModal checkAllCategory={true} selectCategory={handleSelectCategory}/>
                        </div>
                        <button onClick={handleOpenTimeRangeModal}>
                            <div
                                className='w-[300px] py-[7.25px] pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500'>
                                <p className='text-[12px] pb-[3px] text-slate-400 text-start'>{t("Date")}</p>
                                <div className='wrap-text-icon'>
                                    <div className='flex justify-center items-center'>
                                        <span
                                            className="text-input text-start">{dateSelect?.firstDay} - {dateSelect?.lastDay}</span>

                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </button>
                        <div
                            className='w-[300px] py-[7.25px] pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500'>
                            <p className='text-[12px] pb-[3px] text-slate-400'>{t("Note")}</p>
                            <div className='pb-1'>
                                <input onChange={handleChangeAdd}
                                       className='inputAdd w-full h-[26px] text-[17px] focus:outline-none' tabIndex="-1"
                                       type="text" placeholder={t('Note')} name="note" value={dataInput.note}/>
                            </div>
                        </div>
                    </div>
                    <div className=" mx-20 my-5 grid grid-cols-2 gap-2">
                        <div style={{margin: '20px'}}>
                            <h2>{t('Amount')}</h2>
                            <Range
                                values={values}
                                step={1}
                                min={minObject}
                                max={maxObject}
                                onChange={handleChange}
                                renderTrack={({props, children}) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: '4px',
                                            width: '100%',
                                            backgroundColor: '#666666'
                                        }}
                                    >
                                        {children}
                                    </div>
                                )}
                                renderThumb={({props}) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: '20px',
                                            width: '20px',
                                            backgroundColor: '#e4e4e4',
                                            borderRadius: '50%'
                                        }}
                                    />
                                )}
                            />
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span>{values[0]}</span>
                                <span>{values[1]}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <SelectTimeRangeModal onOpen={isOpenModal} onClose={handleCloseTimeRangeModal}/>
            </AppBar>
        </Slide>
    </div>)
}