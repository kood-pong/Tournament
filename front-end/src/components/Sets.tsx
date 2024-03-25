import Header from "./BasicElements/Header";
import TableEntity from "./BasicElements/TableLBEntity";
import TableHeader from "./BasicElements/TableLBHeader";

type Props = {
    match: any;
}


const Sets = ({match}: Props) => {
    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className="top-line big-title">
                    Matches
                </div>
                <TableHeader />
                <div style={{ height: '15px' }}></div>
                {/*  */}
                <button className="btn-1" style={{marginTop: '50px'}}>Done</button>
            </div>
        </div>
    )
}

export default Sets;