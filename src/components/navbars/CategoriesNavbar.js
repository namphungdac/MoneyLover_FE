import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import SelectWallets from '../layout/SelectWallets';
import { useTranslation } from 'react-i18next';

export default function CategoriesNavbar() {
    const navigate = useNavigate();
    const walletSelect = useSelector(state => state.wallet.walletSelect)
    const handleClose = () => {
        navigate('/')
    }
    const { t } = useTranslation()

    return (
        <AppBar sx={{ position: 'relative', backgroundColor: "white", color: "black" }}>
            <Toolbar>
                <div className='w-full flex justify-center items-center'>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {t("Categories")}
                    </Typography>
                    {/* <div className="flex items-center">
                        <img src={walletSelect?.icon.icon} className="w-10 h-10 object-cover mr-2" alt="" />
                        <SelectWallets />
                    </div> */}
                </div>
            </Toolbar>
        </AppBar>
    );
}