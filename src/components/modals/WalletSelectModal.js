import * as React from 'react';
import { Box, Modal } from '@mui/material';
import { useSelector } from 'react-redux';
import { WalletService } from '../../services/wallet.service';

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

export default function WalletSelectModal({ walletDesSelect }) {
    const [open, setOpen] = React.useState(false);
    const allWallet = useSelector(state => state.wallet.allWallet);
    const walletSelect = useSelector(state => state.wallet.walletSelect)
    const [allDestinationWallet, setAllDestinationWallet] = React.useState([]);
    const [walletDestinationSelect, setDestinationWalletSelect] = React.useState();
    React.useEffect(() => {
        WalletService.getAllWallet().then(res => {
            let walletList = res.data.walletList
            let wallets = walletList.filter(item => (item.walletRoles[0].role === 'using' || item.walletRoles[0].role === 'owner') && !item.walletRoles[0].archived && item.id !== walletSelect?.id);
            setAllDestinationWallet(wallets)
        })
    }, [walletDestinationSelect, walletSelect]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSelectWallet = (id) => {
        let wallet = allDestinationWallet.find(item => (item.id === id));
        if (wallet) {
            setDestinationWalletSelect(wallet);
            walletDesSelect(wallet);
            setOpen(false);
        }
    }
    return (
        <React.Fragment>
            <button onClick={handleOpen}>
                <p className='text-[12px] pb-[3px] text-slate-400 text-start'>Destination Wallet</p >
                <div className='wrap-text-icon'>
                    <div onClick={handleSelectWallet} className='flex justify-center items-center'>
                        {walletDestinationSelect ?
                            (<>
                                <img src={walletDestinationSelect?.icon.icon} className="w-6 h-6 object-cover mr-4 rounded-full" alt='icon-flag' />
                                <span className="text-input text-start">{walletDestinationSelect?.name}</span>
                            </>
                            ) :
                            (<>
                                <img src='https://static.moneylover.me/img/icon/icon.png' className="w-6 h-6 object-cover mr-4 rounded-full" alt='icon-flag' />
                                <span className="text-input text-slate-400 ml-4">Select Wallet</span>
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
                        <span className='tracking-wide font-medium text-[20px] ml-4'>Destination Wallet</span>
                    </div>
                    <div className='grid grid-cols-1 scroll-smooth mt-2'>
                        {allDestinationWallet?.map(wallet => (
                            <div key={wallet.id} className='flex justify-start items-center p-2 cursor-pointer hover:bg-lime-50 pl-6' onClick={() => handleSelectWallet(wallet.id)}>
                                <img id={wallet.id} src={wallet.icon.icon} className='object-cover w-8 h-8' alt="" />
                                <div className='flex-col items-center ml-5'>
                                    <p className='text-sm font-medium'>{wallet.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}