import './pedestal.css';

type Props = {
    winers: [];
}

const Pedestal = ({winers}: Props) => {
    return (
        <>
            <div className='pedestals-cont'>
                <div className='pedestal-column'>
                    <div className='usr-img-holder'>
                        {/* TODO check real picture */}
                        <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                    </div>
                    {/* TODO put real name */}
                    <p>Username</p>
                    <div className="pedestal num-2">
                        <div className='num'>2</div>
                        <div className='points'>200000000</div>
                    </div>
                </div>
                <div className='pedestal-column'>
                    <div className='usr-img-holder'>
                        {/* TODO check real picture */}
                        <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                    </div>
                    {/* TODO put real name */}
                    <p>Username</p>
                    <div className="pedestal num-1">
                        <div className='num'>1</div>
                        <div className='points'>200000000</div>
                    </div>
                </div>
                <div className='pedestal-column'>
                    <div className='usr-img-holder'>
                        {/* TODO check real picture */}
                        <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                    </div>
                    {/* TODO put real name */}
                    <p>Username</p>
                    <div className="pedestal num-3">
                        <div className='num'>3</div>
                        <div className='points'>200000000</div>
                    </div>
                </div>
            </div>
            <p className='big-title'>Leaderboard</p>
        </>
    );
}

export default Pedestal;