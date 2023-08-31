import { Card, Slide } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import numeral from 'numeral';
import DoughnutChartIncome from "../chart/DoughnutChartIncome";
import {useTranslation} from "react-i18next";


export default function InComeCard({ balance, isOpen, onClose }) {
    const [openTransModal, setOpenTransModal] = useState(false);
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const dataCalculated = useSelector(state => state.report.dataCalculated);
    const [dataForChart, setDataForChart] = useState ({listIncome: [], totalIncome: 0});

    useEffect(() => {
        let totalIncome = 0;
        let listIncome = dataCalculated?.listIncome;
        listIncome.forEach(item => {
            totalIncome += item.totalAmount
        })
        setDataForChart({listIncome, totalIncome})
    }, [dataCalculated])

    const handleCloseSlide = () => {
        onClose();
    }
    const handleOpenTrans = (date) => {
        setOpenTransModal(true)
    }

    const handleCloseTrans = () => {
        setOpenTransModal(false)
    }
    const {t}=useTranslation()

    return (
        <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
            <div className=''>
                <Card variant="outlined" className='md:w-[700px]'>
                    <div className="px-6 py-4 border-b flex justify-between items-center">
                        <div className="flex justify-center">
                            <button onClick={handleCloseSlide} className="mr-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#757575" className="hover:stroke-black w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <span className="font-semibold text-xl">{t("Income")}</span>
                        </div>
                        <div className="flex gap-4 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#757575" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#757575" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                            </svg>

                        </div>
                    </div>
                    <div className="border-y grid grid-cols-2 pb-8 pl-8">
                        <div className="w-full">
                            <div className='w-full flex justify-center'>
                                <DoughnutChartIncome data={dataForChart} />
                            </div>
                        </div>
                        <div className="text-3xl flex justify-end items-center mr-20 text-sky-500">
                            <span>
                                +{numeral(balance?.totalIncome).format('0,0')} {walletSelect?.currency.sign}
                            </span>
                        </div>
                    </div>
                    <div className="pb-6 text-sm font-medium mt-2 text-textgray">
                        {dataCalculated?.listIncome.length > 0 && dataCalculated.listIncome.map(item => {
                            return (
                                <div onClick={() => handleOpenTrans(item)}  className="hover:bg-lightlime cursor-pointer">
                                    <div className="flex justify-between mx-12 border-b px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <img src= {item.icon} className='w-10 h-10' alt="" />
                                            <p>{t(`${item.categoryName}`)}</p>
                                        </div>
                                        <div className="flex justify-around items-center w-14 p-2 px-4 gap-2">
                                            <div className="text-sky-500 flex gap-1 justify-end">
                                                <span>+{numeral(item.totalAmount).format('0,0')}</span>
                                                <span>{walletSelect?.currency.sign}</span>
                                            </div>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#757575" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </Card>
                {/* <TransByDateModal onOpen={openTransModal} onClose={handleCloseTrans} data={dataOneDate}/> */}
            </div>
        </Slide>
    );

}