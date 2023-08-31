import NavbarSearch from "../components/navbars/NavbarSearch";
import Sidebar from "../components/layout/Sidebar";
import SearchCard from "../components/layout/search/SearchCard";
import {useState} from "react";

export default function PageSearch() {
    const [isModalVisible, setModalVisible] = useState(false);
    const handleOpenModal = () => {
        setModalVisible(true);
    };
    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <>

            <SearchCard openModal = {isModalVisible} closeModal={handleCloseModal}/>
        </>
    )
}