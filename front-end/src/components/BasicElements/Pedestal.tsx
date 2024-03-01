import './pedestal.css';

type Props = {
    winers: any[]; // TODO fix type
}

const Pedestal = ({winers}: Props) => {
    console.log(winers)
    return (
        <>
            <div className='pedestals-cont'>
                <div className='pedestal-column'>
                    <div className='usr-img-holder'>
                        {/* TODO check real picture */}
                        <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                    </div>
                    {/* TODO put real name */}
                    <p> {winers[1].first_name} {winers[1].last_name}</p>
                    <div className="pedestal num-2">
                        <div className='num'>2</div>
                        <div className='points'>{winers[1].points}</div>
                    </div>
                </div>
                <div className='pedestal-column'>
                    <div className='usr-img-holder'>
                        {/* TODO check real picture */}
                        <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                    </div>
                    {/* TODO put real name */}
                    <p> {winers[0].first_name} {winers[0].last_name}</p>
                    <div className="pedestal num-1">
                        <div className='num'>1</div>
                        <div className='points'>{winers[0].points}</div>
                    </div>
                </div>
                <div className='pedestal-column'>
                    <div className='usr-img-holder'>
                        {/* TODO check real picture */}
                        <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                    </div>
                    {/* TODO put real name */}
                    <p> {winers[2].first_name} {winers[2].last_name}</p>
                    <div className="pedestal num-3">
                        <div className='num'>3</div>
                        <div className='points'>{winers[2].points}</div>
                    </div>
                </div>
            </div>
            <p className='big-title'>Leaderboard</p>
        </>
    );
}

export default Pedestal;