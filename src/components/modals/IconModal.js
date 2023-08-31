import * as React from 'react';
import {Box, Modal} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {getIcon} from '../../redux/walletSlice';
import {WalletService} from '../../services/wallet.service';

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

export default function IconModal({selectIcon, iconBeforeUpdate}) {
    const [open, setOpen] = React.useState(false);
    const iconWallets = useSelector(state => state.wallet.icons);
    const [iconSelect, setIconSelect] = React.useState(iconBeforeUpdate ? iconBeforeUpdate : null);
    const dispatch = useDispatch();

    React.useEffect(() => {
        WalletService.getIcon().then(res => {
            dispatch(getIcon(res.data.iconWalletList))
        })
    }, [])
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChoosenIcon = (idIcon) => {
        let iconWallet = iconWallets.find(icon => icon.id === idIcon);
        if (iconWallet) {
            setIconSelect(iconWallet);
            selectIcon(iconWallet);
            setOpen(false);
        }
    }

    return (
        <React.Fragment>
            <button onClick={handleOpen}>
                <div
                    className='flex justify-center items-center mr-4 py-[11px] pl-4 pr-3 border-[1px] border-gray-300 rounded-lg hover:border-gray-500'>
                    <img src={iconSelect ? iconSelect.icon : 'https://static.moneylover.me/img/icon/icon.png'}
                         className='object-cover w-10 h-10 mr-[10px]' alt=""/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                    </svg>
                </div>
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{...style, width: 496, minHeight: 500}}>
                    <div className='flex justify-start items-center'>
            <span onClick={handleClose} className='mt-1 w-12 h-12 flex justify-center items-center cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </span>
                        <span className='tracking-wide font-medium text-[20px] ml-4'>Select icon</span>
                    </div>
                    <div className='flex justify-center items-center border-b-[0.5px] border-slate-300'>
                        <span
                            className='uppercase text-sm px-6 py-2 text-lightgreen font-medium cursor-pointer'>Basic</span>
                    </div>
                    <div className='grid grid-cols-8 scroll-smooth'>
                        {iconWallets && iconWallets.map(icon => (
                            <span key={icon.id} className='flex justify-center p-2 cursor-pointer hover:bg-lime-50'
                                  onClick={() => handleChoosenIcon(icon.id)}>
                <img id={icon.id} src={icon.icon} className='object-cover w-10 h-10' alt=""/>
              </span>
                        ))}
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}