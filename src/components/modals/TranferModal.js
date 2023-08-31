
import * as React from 'react';
import { Box, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { WalletService } from '../../services/wallet.service';
import { getAllWallet, setWalletSelect } from '../../redux/walletSlice';
import WalletSelectModal from './WalletSelectModal';
import CurrencyInput from 'react-currency-input-field';
import { formatDate } from '../datePick/datePick';
import PacmanLoader from 'react-spinners/PacmanLoader';
import Swal from 'sweetalert2';

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

export default function TranferModal({ isOpen, onClose, onSubmit }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isValid, setIsValid] = React.useState(true);
    const [walletReceived, setWalletReceived] = React.useState(null);
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const [moneyInput, setMoneyInput] = React.useState(null);
    const [checkMoney, setCheckMoney] = React.useState(true);
    const dispatch = useDispatch();

    // React.useEffect(() => {
    //     WalletService.getAllWallet().then(res => {
    //         dispatch(getAllWallet(res.data.walletList));
    //     })
    // }, [])

    const handleSelectWallet = (wallet) => {
        setWalletReceived(wallet);
    }

    const handleChangeAmount = (value, name) => {
        console.log('====================================');
        console.log(walletSelect);
        console.log('====================================');
        if (name === 'money') {
            setMoneyInput(value);
            (value > walletSelect?.amountOfMoney) ? setCheckMoney(false) : setCheckMoney(true);
        }
    }

    React.useEffect(() => {
        if (moneyInput > 0 ) setIsValid(true)
        else setIsValid(false);
    }, [moneyInput])

    const handleSubmit = () => {
        setIsLoading(true);
        let walletIDReceived = walletReceived.id;
        let money = +moneyInput;
        let date = formatDate(new Date())
        WalletService.tranferMoney(walletSelect?.id, { walletIDReceived, money, date }).then((res) => {
            if (res.data.message === 'Money transfer success!') {
                let walletTranfer = res.data.walletTransfer;
                WalletService.getAllWallet().then(res => {
                    dispatch(setWalletSelect(walletTranfer));
                    dispatch(getAllWallet(res.data.walletList));
                    setIsLoading(false);
                    onSubmit();
                    setMoneyInput(0);
                })
            } else if (res.data.message === "Money transfer failed!") {
                Swal.fire({
                    title: 'Đăng nhập thất bại',
                    text: 'Vui lòng kiểm tra thông tin đăng nhập.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else alert('Money not enough')
            setWalletReceived(null);
        }).catch(err => console.log(err.message));
    }
    const handleCancel = () => {
        setCheckMoney(true);
        setWalletReceived(null)
        setMoneyInput(0);
        onSubmit()
    }

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 496 }}>
                    <div className='px-6 py-5 border-b-[1px] border-gray-300'>
                        <p className='text-xl font-semibold'>Transfer money to another wallet</p>
                    </div>
                    <div className='p-6'>
                        <div className='flex items-center justify-center mb-6'>
                            <div className='w-64 mr-4 py-1 pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500 hover:cursor-pointer'>
                                <WalletSelectModal walletDesSelect={handleSelectWallet} />
                            </div>
                            <div className='w-44 py-[7.25px] pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500'>
                                <p className='text-[12px] pb-[3px] text-slate-400'>Amount Of Money</p>
                                <div className='pb-1'>
                                    {/* <input onChange={handleChangeAmount} className='inputAdd w-full h-[26px] text-[17px] focus:outline-none' tabIndex="-1" type="number" placeholder='0' name="money" value={moneyInput} required /> */}
                                    <CurrencyInput className='inputAdd w-full h-[26px] text-[17px] focus:outline-none'
                                        suffix={' ' + walletSelect?.currency.sign}
                                        id="input-money-tranfer"
                                        name="money"
                                        value={moneyInput}
                                        placeholder="0"
                                        decimalsLimit={2}
                                        onValueChange={(value, name) => handleChangeAmount(value, name)}
                                        allowNegativeValue={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className=' text-center'>{!checkMoney ? (<p className="text-red-500 text-sm mt-3">Số tiền chuyển phải nhỏ hơn số dư!</p>) : null}</div>
                        <div className='pt-[13px] pb-5 flex text-center'>
                            <input className='w-4 h-4 hover: cursor-pointer mt-1' type="checkbox" name="vehicle1" value="Bike" required />
                            <div className='ml-3'>
                                <p>Chấp nhận điều khoản</p>
                            </div>
                        </div>
                    </div>
                    {isLoading && <div className='flex justify-center'>
                        <PacmanLoader
                            size={25}
                            loading={isLoading}
                            aria-label="Loading Spinner"
                            color="#2db84c"
                        />
                    </div>
                    }
                    <div className='py-[14px] px-6 flex justify-end'>
                        <button type='button' onClick={handleCancel} className='bg-slate-400 text-white text-sm font-medium py-2 px-8 uppercase rounded mr-3'>Cancel</button>
                        <button type='button' onClick={handleSubmit} className='bg-lightgreen text-white text-sm font-medium py-2 px-8 uppercase rounded disabled:bg-slate-400' disabled={!isValid || !checkMoney || !walletReceived}>Save</button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
