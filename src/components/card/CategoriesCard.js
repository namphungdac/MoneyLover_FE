import { Button, Card, Slide, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ModalDeleteCategory from "../modals/ModalDeleteCategory";
import UpdateCategory from "../modals/UpdateCategory";
import { setDataCategory } from "../../redux/transactionSlice";

export function getCategoryListBySubType(listCategory) {
    let subTypeArr = [];
    let categoryListBySubType = [];
    listCategory.forEach(category => {
        let index = subTypeArr.indexOf(category.subType);
        if (index === -1) {
            subTypeArr.push(category.subType)
        }
    });

    subTypeArr.forEach(item => {
        let data = listCategory.filter(category => category.subType === item);
        categoryListBySubType.push({ subType: item, data })
    })
   return categoryListBySubType;
}

export default function CategoriesCard() {
    const allCategory = useSelector(state => state.transaction.allCategory);
    const dataCategory = useSelector(state => state.transaction.dataCategory);
    const [categorySelect, setCategorySelect] = useState();
    const [checked, setChecked] = useState(false);
    const [openFormUpdate, setOpenFormUpdate] = useState(false);
    const dispatch = useDispatch();

    const { t } = useTranslation()

    useEffect(() => {
        let categoryListBySubType = getCategoryListBySubType(allCategory);
        dispatch(setDataCategory(categoryListBySubType));
    }, [allCategory]);

    const handleSelectCategory = (category) => {
        handleOpenSlide();
        setCategorySelect(category)
    }
    const handleOpenSlide = () => {
        setChecked(true);

    };
    const handleCloseSlide = () => {
        setChecked(false);
    };

    const handleOpenFormUpdate = () => {
        setOpenFormUpdate(true);
    }
    const handleCloseFormUpdate = () => {
        setOpenFormUpdate(false);
    }
    const handleSubmitFormUpdate = (categorySelectNew) => {
        setCategorySelect(categorySelectNew)
        setOpenFormUpdate(false);
        setChecked(true);
    }

    return (
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
            <div className='px-4 my-8'>
                <div className='flex justify-center gap-4'>
                    <div className="min-w-[350px] md:w-[550px] min-h-[70px] bg-white rounded shadow-lg overflow-hidden">
                        <div className="">
                            {dataCategory?.length > 0 && dataCategory.map(item => (
                                <div id="type-category">
                                    <div className=" bg-zinc-100 py-2 px-4">
                                        <span className="text-sm text-graynew">{t(`${item?.subType}`)}</span>
                                    </div>
                                    {item.data.length > 0 && item.data.map(category => (
                                        <a href="#">
                                            <div onClick={() => handleSelectCategory(category)} className="px-4 py-2 border-t flex justify-start items-center gap-4 cursor-pointer hover:bg-lightlime">
                                                <img className="w-10 h-10 object-cover" src={category.icon} alt="" />
                                                <span className="text-textcolor">
                                                    {t(`${category.name}`)}
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {(categorySelect && checked && dataCategory?.length > 0) ?
                        <div className=''>
                            <Slide direction="left" in={checked} mountOnEnter unmountOnExit>
                                <Card variant="outlined" className='md:w-[650px] min-h-[200px]'>
                                    <div className='flex text-center justify-between mx-3 py-2 border-b'>
                                        <div className='text-center'>
                                            <Button sx={{ color: "black" }}
                                                onClick={handleCloseSlide}><ClearIcon
                                                    sx={{ float: "left" }} /></Button>
                                            <span className='ml-4 font-semibold text-xl h-[37px] '>{t("Category details")}</span>
                                        </div>
                                        {categorySelect?.subType === "My categories" ?
                                            <Stack direction="row" sx={{ float: "right" }} spacing={2}>
                                                <ModalDeleteCategory sx={{ height: "402px" }}
                                                    idCategory={categorySelect?.id}
                                                    onClose={handleCloseSlide} />
                                                <Button onClick={handleOpenFormUpdate} color='success'>{t("edit")}</Button>
                                            </Stack>
                                            : null
                                        }
                                    </div>
                                    <div className="p-4 flex items-center">
                                        <div className='flex justify-start items-center gap-4'>
                                            <img src={categorySelect?.icon}
                                                className="w-14 h-14"
                                                alt="" />
                                            <div className='flex-col gap-2'>
                                                <div className="font-normal text-xl">
                                                    {t(`${categorySelect?.name}`)}
                                                </div>
                                                <span className={`text-center font-medium rounded-2xl text-xs mt-2 px-2 text-white ${categorySelect?.type === 'expense' ? 'bg-red-500' : 'bg-lightgreen'}`}>
                                                    {categorySelect?.type === "expense" ? t('Expense') : t('Income')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Slide>
                        </div>
                        :
                        null
                    }
                    <UpdateCategory isOpen={openFormUpdate} onClose={handleCloseFormUpdate}
                        onSubmit={handleSubmitFormUpdate} categorySelect={categorySelect}/>
                </div>
            </div>
        </Slide>
    )
}