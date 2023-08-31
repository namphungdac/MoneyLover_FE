import { Slide } from "@mui/material";
import StackedBarChart from "../chart/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TransactionService } from "../../services/transaction.service";
import { getDataBarChart, setDataByDate, setDataCalculated } from "../../redux/reportSlice";
import { parseDate } from "../datePick/datePick";
import numeral from 'numeral';
import DoughnutChart from "../chart/DoughnutChart";
import NetInComeCard from "./NetInComeCard";
import InComeCard from "./InComeCard";
import ExpenseCard from "./ExpenseCard";
import { useTranslation } from "react-i18next";
import ClipLoader from 'react-spinners/ClipLoader';


//chuyển từ dd/mm/yyyy -> date object
function convertFormatDate(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

//chuyển từ dd/mm/yyyy -> yyyy-mm-dd
function convertDateFormat(inputDate) {
    const parts = inputDate.split('/');
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const newDate = `${year}-${month}-${day}`;
    return newDate;
}

//chuyển từ yyyy-mm-dd -> dd/mm/yyyy 
export function convertDateFormatNew(inputDate) {
    const parts = inputDate.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const newDate = `${day}/${month}/${year}`;
    return newDate;
}

//lấy tất cả ngày( hoặc tháng) từ ngày bắt đầu đến kết thúc:
function getAllDayOrMonth(firstDay, lastDay) {
    const startDate = convertFormatDate(firstDay);
    const endDate = convertFormatDate(lastDay);
    const allDates = [];
    const startMonth = startDate.getMonth() + 1;
    const endMonth = endDate.getMonth() + 1;
    if (startMonth !== endMonth) {
        for (let i = startMonth; i <= endMonth; i++) {
            allDates.push(i)
        }
        return { tag: 'month', data: allDates };
    }
    while (startDate <= endDate) {
        allDates.push(startDate.getDate());
        startDate.setDate(startDate.getDate() + 1);
    }
    return { tag: 'day', data: allDates }
}

//lấy dữ liệu income, expense cho bar chart:
function getDataBar(dayArr, data) {
    let dataInCome = [];
    let dataExpense = [];
    dayArr.data.forEach(day => {
        let date;
        let income = 0;
        let expense = 0;
        data.forEach(trans => {
            if (dayArr.tag === 'day') {
                date = parseDate(trans.date).getDate();
            } else {
                date = parseDate(trans.date).getMonth() + 1;
            }
            if (day === date) {
                if (trans.category.type === 'income') {
                    income += trans.amount
                } else {
                    expense -= trans.amount
                }
            }
        })
        dataInCome.push(income);
        dataExpense.push(expense);
    })
    return { dataInCome, dataExpense }
}

//lấy dữ liệu số dư đầu kỳ, số dư cuối kỳ, totalIncome, totalExpense:
function viewBalance(dataIntime, dataBefore) {
    let totalIncome = 0;
    let totalExpense = 0;
    let openingBalance = 0;
    let endingBalance = 0;
    if (dataBefore.length === 0) openingBalance = 0
    else {
        dataBefore.forEach(trans => {
            if (trans.category.type === 'income') {
                openingBalance += trans.amount
            } else {
                openingBalance -= trans.amount
            }
        });
    }
    dataIntime.forEach(trans => {
        if (trans.category.type === 'income') {
            totalIncome += trans.amount
        } else {
            totalExpense -= trans.amount
        }
    })
    endingBalance = openingBalance + totalIncome + totalExpense;
    return { totalIncome, totalExpense, openingBalance, endingBalance };
}


//lọc dữ liệu theo loại (income/expense):
function filerByCategory(data, type) {
    let listData = [];
    let listNameCategory = [];
    data.forEach(trans => {
        if (trans.category.type === type) {
            listData.push(trans);
            listNameCategory.push(trans.category.name);
        }
    })
    return { listData, listNameCategory };
}

//tính toán income, expense theo category lấy dữ liệu cho dougnutChart:
export function calculatorAmountByCategory(dataIntime) {
    let dataInComeCategory = filerByCategory(dataIntime, 'income');
    let dataExpenseCategory = filerByCategory(dataIntime, 'expense');
    let listIncome = [];
    let listExpense = [];
    let listIncomeCategoryInDataUnique = Array.from(new Set(dataInComeCategory.listNameCategory));
    let listExpenseCategoryInDataUnique = Array.from(new Set(dataExpenseCategory.listNameCategory));
    listIncomeCategoryInDataUnique.forEach(item => {
        let totalAmount = 0;
        let icon = '';
        dataInComeCategory.listData.forEach(trans => {
            if (item === trans.category.name) {
                totalAmount += trans.amount
                icon = trans.category.icon
            }
        })
        listIncome.push({ categoryName: item, icon, totalAmount })
    })
    listExpenseCategoryInDataUnique.forEach(item => {
        let totalAmount = 0;
        let icon = '';
        dataExpenseCategory.listData.forEach(trans => {
            if (item === trans.category.name) {
                totalAmount += trans.amount
                icon = trans.category.icon
            }
        })
        listExpense.push({ categoryName: item, icon, totalAmount })
    })
    return { dataInComeCategory, dataExpenseCategory, listIncome, listExpense }
}

//sắp xếp theo ngày tăng dần:
function compareDates(a, b) {
    const dateA = new Date(parseDate(a.date));
    const dateB = new Date(parseDate(b.date));
    return dateA - dateB;
}

//lấy dữ liệu giao dịch theo ngày:
export function getTransByDate(transactions) {
    let transactionsByDate = [];
    const uniqueDates = [];
    for (const item of transactions) {
        if (!uniqueDates.includes(item.date)) {
            uniqueDates.push(item.date);
        }
    }
    uniqueDates.forEach(date => {
        const listData = { date: date, trans: [], totalIncome: 0, totalExpense: 0 };
        for (const trans of transactions) {
            if (date === trans.date) {
                listData.trans.push(trans);
                if (trans.category.type === "income") listData.totalIncome += trans.amount
                else listData.totalExpense -= trans.amount
            }
        }
        transactionsByDate.push(listData);
    })

    transactionsByDate.sort(compareDates);
    return transactionsByDate;
}

const override = {
    position: "absolute",
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 5,
    left: "50%",
    top: "50%",
    transform: 'translate(-50%, -50%)',
};

export default function ReportsCard() {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation()
    const [openNetInCome, setOpenNetInCome] = useState(false);
    const [openInCome, setOpenInCome] = useState(false);
    const [openExpense, setOpenExpense] = useState(false);
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const dateSelect = useSelector(state => state.report.dateSelect);
    const dataCalculated = useSelector(state => state.report.dataCalculated);
    const [dayArr, setDayArr] = useState(getAllDayOrMonth(dateSelect?.firstDay, dateSelect?.lastDay));
    const [balance, setBalance] = useState();
    const dispatch = useDispatch();
    useEffect(() => {
        setIsLoading(true);
        let firstDay = convertDateFormat(dateSelect?.firstDay);
        let lastDay = convertDateFormat(dateSelect?.lastDay);
        if (walletSelect) {
            TransactionService.getTransactionsByTimeRange(walletSelect?.id, firstDay, lastDay).then(res => {
                let transactionList = res.data.transactionList;
                let transactionListBefore = res.data.transactionListBefore;
                let days = getAllDayOrMonth(dateSelect?.firstDay, dateSelect?.lastDay);
                let data = getDataBar(days, transactionList);
                let balance = viewBalance(transactionList, transactionListBefore);
                let dataCalculated = calculatorAmountByCategory(transactionList);
                let dataByDate = (getTransByDate(transactionList));
                setBalance(balance);
                setDayArr(days);
                dispatch(getDataBarChart(data));
                dispatch(setDataByDate(dataByDate))
                dispatch(setDataCalculated(dataCalculated));
                setIsLoading(false);
            }).catch(err => console.log(err.message));
        }
    }, [dateSelect, walletSelect]);

    const handleOpenNetInCard = () => {
        setOpenNetInCome(true);
        setOpenInCome(false);
        setOpenExpense(false);
    }
    const handleCloseNetInCard = () => {
        setOpenNetInCome(false);
    }
    const handleOpenInCard = () => {
        setOpenInCome(true);
        setOpenNetInCome(false);
        setOpenExpense(false);
    }
    const handleCloseInCard = () => {
        setOpenInCome(false);
    }
    const handleOpenExpenseCard = () => {
        setOpenExpense(true);
        setOpenNetInCome(false);
        setOpenInCome(false);
    }
    const handleCloseExpenseCard = () => {
        setOpenExpense(false);
    }

    return (
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <div className='ml-[92px] px-4 my-8'>
                <div className='flex justify-center gap-4'>
                    <div className={`component`} >
                        <div className="min-w-[350px] md:w-[665px] min-h-[70px] bg-white rounded shadow-lg overflow-hidden">
                            <div className="p-6">
                                <div className="grid grid-cols-2">
                                    <div className="text-center">
                                        <p className=" text-graynew">{t("Opening balance")}</p>
                                        <p className="font-medium">{numeral(balance?.openingBalance).format('0,0')} {walletSelect?.currency.sign}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className=" text-graynew">{t("Ending balance")}</p>
                                        <p className="font-medium">{numeral(balance?.endingBalance).format('0,0')} {walletSelect?.currency.sign}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-y">
                                <button onClick={handleOpenNetInCard} className="hover:bg-lightlime w-full">
                                    <div className="py-2">
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
                                </button>
                            </div>
                            <div className="grid grid-cols-2">
                                <button onClick={handleOpenInCard} className="hover:bg-lightlime w-full z-5">
                                    <div className="py-2">
                                        <p className="text-graynew">{t("Income")}</p>
                                        <p className="text-md text-sky-500">+{numeral(balance?.totalIncome).format('0,0')} {walletSelect?.currency.sign}</p>
                                        <div className="">
                                            <div className="flex justify-center">
                                                <DoughnutChart data={dataCalculated?.listIncome} />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button onClick={handleOpenExpenseCard} className="hover:bg-lightlime w-full z-5">
                                    <div className="py-2">
                                        <p className="text-graynew">{t("Expense")}</p>
                                        <p className="text-md text-red-500">{numeral(balance?.totalExpense).format('0,0')} {walletSelect?.currency.sign}</p>
                                        <div className="">
                                            <div className="flex justify-center">
                                                <DoughnutChart data={dataCalculated?.listExpense} />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="pb-6 text-sm font-semibold text-graynew">
                                <div className="flex justify-between px-12 py-[7px] border-t hover:bg-lightlime cursor-pointer">
                                    <span>{t("Debt")}</span>
                                    <div className="flex justify-around items-center w-14">
                                        <span className="text-sky-500">0đ</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#757575" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between px-12 py-[7px] border-t hover:bg-lightlime cursor-pointer">
                                    <span>{t("Loan")}</span>
                                    <div className="flex justify-around items-center w-14">
                                        <span className="text-red-500">0đ</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#757575" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between px-12 py-[7px] border-t hover:bg-lightlime cursor-pointer">
                                    <span>{t("Other")}</span>
                                    <div className="flex justify-around items-center w-14">
                                        <span className="">0đ</span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#757575" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isLoading && 
                        <ClipLoader
                            size={55}
                            loading={isLoading}
                            cssOverride={override}
                            aria-label="Loading Spinner"
                            color="#2db84c"
                        />
                    }
                    {openNetInCome && <NetInComeCard balance={balance} dayArr={dayArr} isOpen={openNetInCome} onClose={handleCloseNetInCard} />}
                    {openInCome && <InComeCard balance={balance} isOpen={openInCome} onClose={handleCloseInCard} />}
                    {openExpense && <ExpenseCard balance={balance} isOpen={openExpense} onClose={handleCloseExpenseCard} />}
                </div>
            </div>
        </Slide>
    );
}