import Header from "./BasicElements/Header";
import TableEntity from "./BasicElements/TableREntity";
import TableHeader from "./BasicElements/TableRHeader";

const Requests = () => {
    const requests = [{
        id: 1,
        fullname: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        discord: 'SwiftPaddle',
    }, {
        id: 2,
        fullname: 'Alex Chen',
        email: 'spinmaster88@email.com',
        discord: 'SpinMaster88',
    }, {
        id: 3,
        fullname: 'Alex Borsch',
        email: 'aceattacker23@mail.net',
        discord: 'AceAttacker23',
    },{
        id: 4,
        fullname: 'David Rodriguez',
        email: 'paddlepro99@domain.org',
        discord: 'PaddlePro99',
    },{
        id: 5,
        fullname: 'Emily Smith',
        email: 'smashninja42@example.org',
        discord: 'SmashNinja42',
    }];

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className="top-line big-title">
                    Requests
                </div>
                <TableHeader />
                <div style={{ height: '15px' }}></div>
                {requests.map((request, index) => (
                    <TableEntity request={request} />
                ))}
            </div>
        </div>
    )
}

export default Requests;