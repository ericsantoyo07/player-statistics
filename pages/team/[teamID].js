import React, { useEffect, useState } from 'react'

const Team = () => {

    const [team, setTeam] = useState(null);
    const [teamID, setTeamID] = useState(null);

    useEffect(() => {
        let teamIDParam = window.location.pathname.split('/')[2];
        setTeamID(teamIDParam);
    }, []);;

    useEffect(() => {

        async function fetchData() {
        }
        fetchData();
    }, [teamID]);

    return (
        <div>Team {teamID}</div>
    )
}

export default Team