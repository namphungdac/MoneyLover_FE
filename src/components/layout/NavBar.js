import { Button, IconButton, Slide } from "@mui/material";
import { Search } from '@mui/icons-material';
import SelectWallets from "./SelectWallets";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../redux/languageSice";
import { setMonthSelect } from "../../redux/transactionSlice";
export default function NavBar({ onClickAddBtn }) {
    const { i18n } = useTranslation()
    const language = useSelector(state => state.lang.lang)
    localStorage.setItem('lang', language)

    const dispatch = useDispatch();

    const handleLanguageChange = (event) => {
        i18n.changeLanguage(event.target.value)
        if (event) {
            dispatch(setLanguage(event.target.value))
        }
    };
    useEffect(() => {
        if (language === "Vi") {
            dispatch(setLanguage("Vi"))
            localStorage.setItem('lang', language)
        } else {
            dispatch(setLanguage("En"))
            localStorage.setItem('lang', language)
        }
    }, [language])
    const { t } = useTranslation();
    
    const handleSelectMonth = () => {
        let currentDate = new Date();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear()
        dispatch(setMonthSelect({month, year}));
    }

    return (
        <>
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                <div className="navbar">
                    {/* <div style={{ float: "left", height: "66px", margin: "15px", }}>
                        <img src="logo.jpg" style={{ height: "66px", marginTop: "-15px" }} alt="" />
                    </div>
                    <div style={{ float: "left", height: "66px", }}>
                        <SelectWallets />
                    </div>
                    <div style={{ float: "right", height: "66px", margin: "15px"  ,paddingLeft:'60px'}}>
                        <select onChange={handleLanguageChange} value={language}>
                            <option value={"En"} >En</option>
                            <option value={"Vi"} >Vi</option>
                        </select>
                        
                        <Link to="/search">
                            <IconButton aria-label="delete" sx={{ color: "black", marginRight: "35px" }}>
                                <Search />
                            </IconButton>
                        </Link>
                        <Button onClick={onClickAddBtn} variant="contained" sx={{ backgroundColor: "#1aa333" }} disableElevation>
                            <b>{t("addTrasactions")}</b>
                        </Button>
                    </div> */}
                    <div className="flex justify-between h-[66px]">
                        <div className="flex justify-start">
                            <img src="logo.jpg" className="h-[66px] object-cover" alt="" />
                            <SelectWallets />
                        </div>
                        <div className="flex justify-end items-center mr-5 gap-2">
                            <div>
                                <select onChange={handleLanguageChange} value={language}>
                                    <option value={"En"} >En</option>
                                    <option value={"Vi"} >Vi</option>
                                </select>
                            </div>
                            <div onClick={handleSelectMonth} className="ml-3 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:stroke-lightgreen">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                            </div>
                            <Link to="/search">
                                <IconButton aria-label="delete" sx={{ color: "black", marginRight: "30px" }}>
                                    <Search />
                                </IconButton>
                            </Link>
                            <div>
                                <Button onClick={onClickAddBtn} variant="contained" sx={{ backgroundColor: "#1aa333" }} disableElevation>
                                    <b>{t("addTrasactions")}</b>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Slide>
        </>
    )
}