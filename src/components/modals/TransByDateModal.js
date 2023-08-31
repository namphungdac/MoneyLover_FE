import * as React from 'react';
import { Box, Modal } from '@mui/material';
import numeral from 'numeral';
import { convertDate } from '../datePick/datePick';
import { convertDateFormatNew } from '../card/ReportsCard';
import { useSelector } from 'react-redux';
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

export default function TransByDateModal({ onOpen, onClose, data }) {
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const {t}=useTranslation()

    const handleClose = () => {
        onClose();
    };

    return (
        <div>
            <Modal
                open={onOpen}
                onClose={onClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                {data?.length > 0 ? 
                    <Box sx={{ ...style, width: 496, minHeight: 500, backgroundColor: '#f4f4f4', overflow: "hidden" }}>
                    <div className='flex justify-start items-center bg-white border-b-2'>
                        <span onClick={handleClose} className='mt-1 w-12 h-12 flex justify-center items-center cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </span>
                        <span className='tracking-wide font-medium text-[18px] ml-4'>{t(`${convertDate(data[0]?.date).dayOfWeek}`)}  {convertDateFormatNew(data[0]?.date)}</span>
                    </div>
                    <div className='scroll-smooth'>
                        <div className='w-full py-2 text-sm font-medium text-grayne bg-white'>
                            <div className='px-4 py-2 flex justify-between'>
                                <span>{t("Inflow")}</span>
                                <span className='text-sky-500'>+{numeral(data[0]?.totalIncome).format('0,0')} {walletSelect?.currency.sign}</span>
                            </div>
                            <div className='px-4 py-2 flex justify-between'>
                                <span>{t("Outflow")}</span>
                                <span className='text-red-500'>{numeral(data[0]?.totalExpense).format('0,0')} {walletSelect?.currency.sign}</span>
                            </div>
                        </div>
                        <div className="mt-8 bg-white">
                            <div>
                                <div className='flex justify-between items-center px-4 py-2 border-'>
                                    <div className='flex justify-start items-center'>
                                        <span className='mr-4 text-4xl font-normal text-black'>{convertDate(data[0]?.date).day}</span>
                                        <span className='text-start'>
                                            <div className='text-xs font-medium text-graynew'>{t(`${convertDate(data[0]?.date).dayOfWeek}`)}</div>
                                            <div className='text-xs text-zinc-400 font-normal'>{t(`${convertDate(data[0]?.date).month}`)} {convertDate(data[0]?.date).year}</div>
                                        </span>
                                    </div>
                                    <span>
                                        {numeral((data[0]?.totalIncome + data[0]?.totalExpense)).format('0,0')} {walletSelect?.currency.sign}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {data[0]?.trans.length > 0 && data[0].trans.map(item => (
                                    <div className='flex justify-between items-center px-4 py-2 border-t hover:bg-lightlime cursor-pointer'>
                                        <div className='flex justify-start items-center'>
                                            <img src= {item.category.icon} className='w-10 h-10' alt="" />
                                            <span className='ml-4 mb-2 font-semibold text-sm'>
                                               {t(`${item.category.name}`)}
                                            </span>
                                        </div>
                                        <span className={`${item.category.type === 'income'? 'text-sky-500' : 'text-red-500'}`}>
                                            {item.category.type === 'income' ? ("+" + numeral(item.amount).format(0,0)) : ("-" + numeral(item.amount).format(0,0))} {walletSelect?.currency.sign}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Box>
                : 
                <p>No data</p>
                }
            </Modal>
        </div>
    );
}