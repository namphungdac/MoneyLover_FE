import { Slide } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSelector } from "react-redux";
import SelectWallets from "../layout/SelectWallets";
import SelectTimeRangeModal from "../modals/SelectTimeRangeModal";
import { useState } from "react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";


export default function ReportsNavBar() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const dateSelect = useSelector(state => state.report.dateSelect);
    const {t}=useTranslation()

    const handleOpenTimeRangeModal = () => {
        setIsOpenModal(true);
    }
    const handleCloseTimeRangeModal = () => {
        setIsOpenModal(false)
    }
    return (
        <>
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                <div className="navbar">
                    <div className="px-6">
                        <div className="flex justify-between h-full items-center">
                            <div className="flex items-center">
                                <img src={walletSelect?.icon.icon} className="w-10 h-10 object-cover mr-2" alt="" />
                                <SelectWallets />
                            </div>
                            <div onClick={handleOpenTimeRangeModal} className="flex-col hover:cursor-pointer">
                                <div>
                                    <span className=" font-bold text-sm">{t(`${dateSelect?.name}`)}</span>
                                    <ArrowDropDownIcon sx={{ fontSize: '16px' }} />
                                </div>
                                <span className="text-xs font-normal text-zinc-400">{dateSelect?.firstDay} - {dateSelect?.lastDay}</span>
                            </div>
                            <div className="w-[230px] flex justify-end">
                                <Link to="/search">
                                    <SearchTwoToneIcon sx={{ fontSize: '28px', color:'gray'}} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Slide>
            <SelectTimeRangeModal onOpen={isOpenModal} onClose={handleCloseTimeRangeModal}/>
        </>
    )
}