import { Card, Slide } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import numeral from 'numeral';
import StackedBarChart from "../chart/BarChart";
import { convertDate } from "../datePick/datePick";
import TransByDateModal from "../modals/TransByDateModal";
import {useTranslation} from "react-i18next";

function getDataOneDate(data, date) {
    return data.filter(item => item.date === date);
}

export default function NetInComeCard({ balance, dayArr, isOpen, onClose }) {
    const [openTransModal, setOpenTransModal] = useState(false);
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const dataByDate = useSelector(state => state.report.dataByDate);
    const [dateSelect, setDateSelect] = useState(dataByDate[0]?.date);
    const [dataOneDate, setDataOneDate] = useState(getDataOneDate(dataByDate, dateSelect))

    useEffect(() => {
        let data = getDataOneDate(dataByDate, dateSelect);
        console.log(data);
        setDataOneDate(data);
    }, [dateSelect])

    const handleCloseSlide = () => {
        onClose();
    }
    const handleOpenTrans = (date) => {
        setOpenTransModal(true)
        setDateSelect(date)
    }

    const handleCloseTrans = () => {
        setOpenTransModal(false)
    }
    const {t}=useTranslation()

    return (
        <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
            <div className=''>
                <Card variant="outlined" className='md:w-[700px]'>
                    <div className="px-6 py-4 border-b flex items-center">
                        <button onClick={handleCloseSlide} className="mr-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#757575" className="hover:stroke-black w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                        </button>
                        <span className="font-semibold text-xl">{t("Net Income")}</span>
                    </div>
                    <div className="border-y">
                        <div className="w-full">
                            <div className="py-2 text-center">
                                <p className="text-graynew">{t("Net Income")}</p>
                                <p className="text-2xl">
                                    {(balance?.totalIncome + balance?.totalExpense) > 0 ? '+' : ''}
                                    {numeral(balance?.totalIncome + balance?.totalExpense).format('0,0')}
                                    {" " + walletSelect?.currency.sign}
                                </p>
                            </div>
                            <div className='w-full h-[240px] flex justify-center'>
                                <StackedBarChart label={dayArr.data} />
                            </div>
                        </div>
                    </div>
                    <div className="pb-6 text-sm font-medium mt-2 text-textgray">
                        {dataByDate?.length > 0 && dataByDate.map(item => {
                            return (
                                <div onClick={() => handleOpenTrans(item.date)}  className="hover:bg-lightlime cursor-pointer">
                                    <div className="flex justify-between mx-12 border-b px-4">
                                        <span className="mt-2">{t(`${convertDate(item?.date).dayOfWeek}`)}, {t(`${convertDate(item?.date).month}`)} {convertDate(item?.date).year}</span>
                                        <div className="flex justify-around items-center w-14 p-2 px-4 gap-2">
                                            <div className="text-right">
                                                <div className="text-sky-500 flex gap-1 justify-end">
                                                    <span>+{numeral(item.totalIncome).format('0,0')}</span>
                                                    <span>{walletSelect?.currency.sign}</span>
                                                </div>
                                                <div className="text-red-500 flex gap-1 justify-end">
                                                    <span>{numeral(item.totalExpense).format('0,0')}</span>
                                                    <span>{walletSelect?.currency.sign}</span>
                                                </div>
                                                <div>{numeral(item.totalIncome + item.totalExpense).format('0,0')} {walletSelect?.currency.sign}</div>
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
                <TransByDateModal onOpen={openTransModal} onClose={handleCloseTrans} data={dataOneDate}/>
            </div>
        </Slide>
    );

}