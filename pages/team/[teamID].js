import { getPlayersByTeamID, getTeamByTeamID } from '@/database/client';
import React, { useEffect, useState } from 'react'

const Team = () => {

    const [team, setTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [teamID, setTeamID] = useState(null);
    const [players, setPlayers] = useState(null);

    useEffect(() => {
        let teamIDParam = window.location.pathname.split('/')[2];
        setTeamID(teamIDParam);
    }, []);;

    useEffect(() => {


        async function fetchData() {
            setIsLoading(true);
            const { data: teamData, error } = await getTeamByTeamID(teamID);
            console.log(teamData);
            if (error) {
                console.log(error);
            }
            if (teamData) {
                if(teamData.length === 0) {
                    setTeam(null);
                    setIsLoading(false);
                    return;
                }
                else {
                    setTeam(teamData[0]);
                }
            }

            const { data: playersData, error: playersError } = await getPlayersByTeamID(teamID);
            if (playersError) {
                console.log(playersError);
            }
            if (playersData) {
                let processed = [];
                for (let players in playersData) {
                    let current = playersData[players];
                    // remove marketValues from current
                    delete current.marketValues;
                    processed.push(current);
                }
                setPlayers(processed);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [teamID]);


    if (isLoading) return (<div>Loading...</div>);

    return (
        <div>Team {JSON.stringify({ team: team, players: players })}</div>
    )
}

export default Team