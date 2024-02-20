import { useEffect } from "react";

interface Props {
    PORT: string;
}

const MainPage = ({PORT}: Props) => {
    useEffect(() => {
        (async () => {
            console.log(PORT)
            try {
                const response = await fetch(`${PORT}/api/v1/users/all/approved`, {
                    method: 'GET',
                    // credentials: 'include'
                })
                const json = await response.json()
                console.log(json)
            } catch (error) {
                console.log('error', error)
            }
        })()
    },[])

    return(
        <>
        <h1>kood/pong</h1>
        </>
    )
}

export default MainPage;