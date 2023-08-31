import ReportsCard from "../../components/card/ReportsCard";
import Sidebar from "../../components/layout/Sidebar";
import ReportsNavBar from "../../components/navbars/ReportsNavbar";

export default function Reports() {
    return (
        <>
        <ReportsNavBar />
        <div>
            <Sidebar/>
            <ReportsCard/>
        </div>
    </>
    );
}