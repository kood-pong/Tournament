import { useEffect } from "react";
import Header from "./BasicElements/Header";
import Footer from "./BasicElements/Footer";
import './basic.css';
import './main.css';
import Announcement from "./BasicElements/Announcement";
import Pedestal from "./BasicElements/Pedestal";
import TableHeader from "./BasicElements/TableHeader";
import TableEntity from "./BasicElements/TableEntity";

interface Props {
    PORT: string;
}

const MainPage = ({ PORT }: Props) => {
    useEffect(() => {
        (async () => {
            console.log(PORT)
            try {
                const response = await fetch(`${PORT}/api/v1/users/all/approved`, {
                    method: 'GET',
                    credentials: 'include'
                })
                const json = await response.json()
                console.log(json)
            } catch (error) {
                console.log('error', error)
            }
        })()
    }, [])

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <Announcement text="Register Now for Our Upcoming Tournament!" btnsText={['Register']} />
                <Pedestal winers={[]} />
                <div className="table-cont">
                    <TableHeader />
                    <div style={{height:'15px'}}></div>
                    <TableEntity />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default MainPage;