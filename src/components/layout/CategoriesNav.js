import * as React from 'react';
import Button from '@mui/material/Button';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function CategoriesNav() {
    const { t } = useTranslation()
    const navigate = useNavigate();
    const handleClickOpen = () => {
        navigate('/category')
    };

    return (
        <div>
            <Button>
                <div onClick={handleClickOpen} style={{ width: "364px", color: "#747474" }} className='pr-4'>
                    <div style={{ float: "left", marginRight: "40px" }}>
                        <CategoryIcon sx={{ fontSize: "40px", marginLeft: "20px" }} />
                    </div>
                    <div style={{ paddingTop: "9px", textAlign: "left" }}>
                        {t("Catogories")}
                        <ArrowForwardIosIcon sx={{ fontSize: "14px", float: "right", marginRight: "10px" }} />
                    </div>
                    <hr />
                </div>
            </Button>
        </div>
    )
}