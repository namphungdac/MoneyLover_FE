import NavbarMyWallet from "../../components/layout/NavbarMyWallet";
import NestedModal from "../../components/modals/NestedModal";
import CardWallet from "../../components/layout/CardWallet";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MyWallet() {
    const [showModal, setShowModal] = useState(false);
    let allWallet = useSelector(state => state.wallet.allWallet);
    useEffect(() => {
        setShowModal(allWallet.length === 0);
    }, [allWallet]);

    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleSubmitModal = () => {
        setShowModal(false);
    }
    return (
        <>
            {showModal &&
                <>
                    <NavbarMyWallet />
                    <NestedModal is isOpen={showModal} onClose={handleCloseModal} onSubmit={handleSubmitModal} />
                </>
            }
            {!showModal && <CardWallet />}
        </>
    );
}