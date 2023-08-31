
import * as React from 'react';
import { Box, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrencies } from '../../redux/walletSlice';
import { WalletService } from '../../services/wallet.service';
import {useTranslation} from "react-i18next";

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

export default function CurrencyModal({selectCurrency, currencyBeforeUpdate}) {
    const [open, setOpen] = React.useState(false);
    const currencies = useSelector(state => state.wallet.currencies);
    const [currencySelect, setCurrencySelect] = React.useState(currencyBeforeUpdate ? currencyBeforeUpdate : null);
    const dispatch = useDispatch();

    React.useEffect(() => {
        WalletService.getCurrency().then(res => {
            dispatch(getCurrencies(res.data.currencyList))
        })
    },[])
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSelectCurrency = (id) => {
        let currency = currencies.find(item => item.id === id);
        if (currency) {
            setCurrencySelect(currency);
            selectCurrency(currency);
            setOpen(false);
        }
    }
    const {t}=useTranslation()
    return (
        <React.Fragment>
            <button onClick={handleOpen}>
                <p className='text-[12px] pb-[3px] text-slate-400 text-start'>{t("Currency")}</p  >
                <div className='wrap-text-icon'>
                    <div onClick={handleSelectCurrency} className='flex justify-center items-center'>
                        {currencySelect ?
                            (<>
                                <img src={currencySelect.icon} className="w-6 h-6 object-cover mr-4 rounded-full" alt='icon-flag' />
                                <span className="text-input text-start">{currencySelect.name}</span>
                            </>
                            ) :
                            (<>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-input text-slate-400 ml-4">{t("Select Currency")}</span>
                            </>)
                        }
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
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
                <Box sx={{ ...style, width: 496, minHeight: 500 }}>
                    <div className='flex items-center border-b-[1px] py-2'>
                        <span onClick={handleClose} className='mt-1 w-12 h-12 flex justify-center items-center cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </span>
                        <span className='tracking-wide font-medium text-[20px] ml-4'>{t("Currency")}</span>
                        <div className='relative'>
                            <input type='search' className='ml-10 px-12 py-2 border rounded-3xl bg-neutral-100 focus:outline-none' placeholder="Search..." />
                            <svg className='absolute top-3 left-14 w-5 h-5' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 scroll-smooth mt-2'>
                        {currencies && currencies.map(currency => (
                            <div key={currency.id} className='flex justify-start items-center p-2 cursor-pointer hover:bg-lime-50 pl-6' onClick={() => handleSelectCurrency(currency.id)}>
                                <img id={currency.id} src={currency.icon} className='object-cover w-8 h-8' alt="" />
                                <div className='flex-col items-center ml-5'>
                                    <p className='text-sm font-medium'>{currency.name}</p>
                                    <span className='text-xs'>
                                        {currency.subname}-{currency.sign}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}