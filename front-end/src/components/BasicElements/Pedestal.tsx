import './pedestal.css';

type Props = {
    winers: any[];
    name: string;
}

const Pedestal = ({ winers, name }: Props) => {
    return (
        <>
            <div className='pedestals-cont'>
                <div className='pedestal-column'>
                    <a className="user-link-cont" href={`/user/${winers[1].id}`}>
                        <div className='usr-img-holder img-holder'>
                            {/* TODO check real picture */}
                            <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                        </div>
                        <p className='text'> {winers[1].first_name} {winers[1].last_name}</p>
                    </a>
                    <div className="pedestal num-2">
                        <div className='big-title'>2</div>
                        <div className='text points'>{winers[1].points}</div>
                    </div>
                </div>
                <div className='pedestal-column'>
                    <a className="user-link-cont" href={`/user/${winers[0].id}`}>
                        <div className='usr-img-holder img-holder'>
                            {/* TODO check real picture */}
                            <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                        </div>
                        <p className='text'> {winers[0].first_name} {winers[0].last_name}</p>
                    </a>
                    <div className="pedestal num-1">
                        <div className='big-title'>1</div>
                        <div className='text points'>{winers[0].points}</div>
                    </div>
                </div>
                <div className='pedestal-column'>
                    <a className="user-link-cont" href={`/user/${winers[2].id}`}>
                        <div className='usr-img-holder img-holder'>
                            {/* TODO check real picture */}
                            <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                        </div>
                        <p className='text'> {winers[2].first_name} {winers[2].last_name}</p>
                    </a>
                    <div className="pedestal num-3">
                        <div className='big-title'>3</div>
                        <div className='text points'>{winers[2].points}</div>
                    </div>
                </div>
            </div>
            <p className='big-title p-title'>{name}</p>
        </>
    );
}

export default Pedestal;