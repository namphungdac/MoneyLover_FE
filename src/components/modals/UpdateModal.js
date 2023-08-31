import * as React from 'react';
import { Box, Modal } from '@mui/material';
import CurrencyModal from './CurrencyModal';
import IconModal from './IconModal';
import { useDispatch, useSelector } from 'react-redux';
import { WalletService } from '../../services/wallet.service';
import { getAllWallet, setWalletSelect } from '../../redux/walletSlice';
import { useTranslation } from "react-i18next";
import CurrencyInput from 'react-currency-input-field';
import { formatDate } from "../datePick/datePick";
import PacmanLoader from 'react-spinners/PacmanLoader';

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

export default function UpdateModal({ isOpen, onClose, onSubmit }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const { t } = useTranslation()
    const [isValid, setIsValid] = React.useState(false);
    const walletSelect = useSelector(state => state.wallet.walletSelect);
    const allWallet = useSelector(state => state.wallet.allWallet);
    const [currencySelect, setCurrencySelect] = React.useState(walletSelect?.currency);
    const [iconSelect, setIconSelect] = React.useState(walletSelect?.icon);
    const [dataInput, setDataInput] = React.useState({ name: walletSelect?.name, amountOfMoney: walletSelect?.amountOfMoney });
    const dispatch = useDispatch();
    const [checkName, setCheckName] = React.useState(true);
    const [checkMoney, setCheckMoney] = React.useState(true);

    React.useEffect(() => {
        setIconSelect(walletSelect?.icon);
        setCurrencySelect(walletSelect?.currency);
        setDataInput({ name: walletSelect?.name, amountOfMoney: walletSelect?.amountOfMoney })
    }, [walletSelect]);
    React.useEffect(() => {
        WalletService.getAllWallet().then(res => {
            dispatch(getAllWallet(res.data.walletList));
        })
    }, [])
    const handleSelectIcon = (icon) => {
        setIconSelect(icon);
    }
    const handleSelectCurrency = (currency) => {
        setCurrencySelect(currency);
    }
    const handleFocus = () => {
        document.getElementById("note").focus();
    };
    const handleChange = (e) => {
        let name = '';
        let data = { ...dataInput, [e.target.name]: e.target.value };
        setDataInput(data);
        if (e.target.name === 'name') {
            name = e.target.value;
            let walletListCheck = allWallet.filter(item => item.name !== walletSelect?.name);
            let wallet = walletListCheck.find(item => item.name === name);
            wallet ? setCheckName(false) : setCheckName(true);
        }
    }
    const handleChangeAmount = (value, name) => {
        if (name === 'amountOfMoney') {
            setDataInput({ ...dataInput, amountOfMoney: value });
            (value > 1000000000) ? setCheckMoney(false) : setCheckMoney(true);
        }
    }

    React.useEffect(() => {
        if (dataInput.name && currencySelect) setIsValid(true)
        else setIsValid(false);
    }, [dataInput])

    const handleSubmit = () => {
        setIsLoading(true);
        let name = dataInput.name;
        let iconID = iconSelect?.id;
        let currencyID = currencySelect?.id;
        let amountOfMoney = dataInput.amountOfMoney;
        let date = formatDate(new Date())
        WalletService.updateWallet(walletSelect?.id, { name, iconID, currencyID, amountOfMoney, date }).then((res) => {
            let updatedWallet = res.data.updatedWallet;
            dispatch(setWalletSelect(updatedWallet));
            WalletService.getAllWallet().then(res => {
                let walletList = res.data.walletList;
                dispatch(getAllWallet(walletList));
                setIsLoading(false)
                onSubmit();
            })
        }).catch(err => console.log(err.message));
    }
    const handleCancel = () => {
        setCheckName(true);
        setDataInput({ name: walletSelect?.name, amountOfMoney: walletSelect?.amountOfMoney })
        onClose();
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
                        <p className='text-xl font-semibold'>{t("Edit Wallet")}</p>
                    </div>
                    <div className='p-6'>
                        <div className='flex item-center justify-center'>
                            <div className='w-1/3'>
                                <IconModal selectIcon={handleSelectIcon} iconBeforeUpdate={walletSelect?.icon} />
                            </div>
                            <div onClick={handleFocus} className='mb-4 py-[5px] px-[15px] border w-full border-gray-300 rounded-lg hover:border-gray-500 hover: cursor-pointer'>
                                <p className='text-[12px] pb-[3px] text-slate-400'>{t("Wallet Name")}</p>
                                <div className='pb-1'>
                                    <input onChange={handleChange} className='inputAdd w-full h-[27px] text-[17px] focus:outline-none' tabIndex="-1" type="text" name="name" value={dataInput.name} placeholder="Your wallet name?" id="note" />
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-center mb-6'>
                            <div className='w-64 mr-4 py-1 pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500 hover:cursor-pointer'>
                                <CurrencyModal selectCurrency={handleSelectCurrency} currencyBeforeUpdate={walletSelect?.currency} />
                            </div>
                            <div className='w-44 py-[7.25px] pl-4 pr-3 border border-gray-300 rounded-lg hover:border-gray-500'>
                                <p className='text-[12px] pb-[3px] text-slate-400'>{t("Initial Balance")}</p>
                                <div className='pb-1'>
                                    {/* <input onChange={handleChange} className='inputAdd w-full h-[26px] text-[17px] focus:outline-none' tabIndex="-1" type="number" placeholder='0' name="amountOfMoney" value={dataInput.amountOfMoney} required /> */}
                                    <CurrencyInput className='inputAdd w-full h-[26px] text-[17px] focus:outline-none'
                                        suffix={' ' + currencySelect?.sign}
                                        id="input-money-update"
                                        name="amountOfMoney"
                                        value={dataInput.amountOfMoney}
                                        placeholder="0"
                                        decimalsLimit={2}
                                        onValueChange={(value, name) => handleChangeAmount(value, name)}
                                        allowNegativeValue={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className=' text-center'>{!checkName ? (<p className="text-red-500 text-sm mt-3">{t("Duplicate Wallet Name")}</p>) : null}</div>
                        <div className=' text-center'>{!checkMoney ? (<p className="text-red-500 text-sm mt-3">Số tiền giao dịch phải nhỏ hơn 1 tỷ đồng!</p>) : null}</div>
                        <div className='pt-[13px] pb-5 flex text-center'>
                            <input className='w-4 h-4 hover: cursor-pointer mt-1' type="checkbox" name="vehicle1" value="Bike" required />
                            <div className='ml-3'>
                                <p>{t("Accept Terms")}</p>
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
                        <button type='button' onClick={handleCancel} className='bg-slate-400 text-white text-sm font-medium py-2 px-8 uppercase rounded mr-3'>{t("Cancel")}</button>
                        <button type='button' onClick={handleSubmit} className='bg-lightgreen hover:opacity-80 text-white text-sm font-medium py-2 px-8 uppercase rounded disabled:bg-slate-400' disabled={!isValid || !checkName || !checkMoney}>{t("Save")}</button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
