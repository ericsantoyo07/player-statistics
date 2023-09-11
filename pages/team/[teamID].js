import { getAllStats, getPlayersByTeamID, getTeamByTeamID } from '@/database/client';
import React, { useEffect, useState } from 'react'
import styles from '@/styles/Team.module.css'
import { useRouter } from 'next/router';



function getTranslatedPosition(position) {
    switch (position) {
        case 'Portero':
            return 'GK';
        case 'Defensa':
            return 'Def';
        case 'Centrocampista':
            return 'Mid';
        case 'Delantero':
            return 'Str';
        default:
            return position;
    }
}

function getImageSource(src) {
    if (src && src !== '') {
        return src;
    }
    return 'https://assets-fantasy.llt-services.com/players/no-player.png';
}

function getTeamImageSource(src) {
    if (src && src !== '') {
        return src;
    }
    return 'https://assets-fantasy.llt-services.com/teams/no-team.png';
}

function getProperStatus(status) {
    switch (status) {
        case 'injured':
            return 'Injured';
        case 'out_of_league':
            return 'Out of league'; 
        case 'doubtful':
            return 'Doubt';
        case 'ok':
            return 'Available';
        case 'default':
            return 'All';
        default:
            return status;
    }
}


const TeamCard = ({ data }) => {
    return (
        <div className={styles.team_card}>
            <div className={styles.team_card_row}>
                <p>
                    Team name
                </p>
                <h3>
                    {data.name} ({data.nickname})
                </h3>
            </div>
            <div className={styles.team_card_row}>
                <img src={getTeamImageSource(data.image)} />
            </div>
            <div className={styles.team_card_row}>
                <p>
                    Total points
                </p>
                <h3>
                    {data.totalPoints}
                </h3>
            </div>
            <div className={styles.team_card_row}>
                <p>
                    Total market value
                </p>
                <h3>
                    €{data.totalMarketValue}
                </h3>
            </div>
            <div className={styles.team_card_row}>
                <p>
                    Players Available
                </p>
                <h3>
                    {data.numberOfAvailablePlayers} /{data.numberOfPlayers}
                </h3>
            </div>

        </div>
    )
}




function GoBack() {


    const router = useRouter();
    return (
        <div className={styles.go_to_home}>
            <p onClick={() => router.push('/')}>
                Home
            </p>
        </div>
    )
}



const Team = () => {

    const [team, setTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [teamID, setTeamID] = useState(null);
    const [players, setPlayers] = useState(null);
    const router = useRouter();


    const getTotalPointsOfTeam = () => {
        let total = 0;
        for (let player in players) {
            if (players[player].status === 'out_of_league') {
                continue;
            }
            total += players[player].points;
        }
        return total;
    }

    const getTotalMarketValueOfTeam = () => {
        let total = 0;
        for (let player in players) {
            if (players[player].status === 'out_of_league') {
                continue;
            }
            total += players[player].marketValue;
        }
        return total;
    }

    const getNumberOfPlayersOfTeam = () => {
        let total = 0;
        for (let player in players) {
            if (players[player].status !== 'out_of_league') {
                total++;
            }
        }
        return total;
    }

    const getNumberOfAvailablePlayersOfTeam = () => {
        let total = 0;
        for (let player in players) {
            if (players[player].status === 'ok') {
                total++;
            }
        }
        return total;
    }

    const getSortedPlayersByPoints = () => {
        let sorted = [...players];
        sorted.sort((a, b) => {
            return b.points - a.points;
        });
        return sorted;
    }


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
                if (teamData.length === 0) {
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


    if (isLoading)
        return (
            <div className={styles.loading}>
                <img src='/loading.gif' />
            </div>
        );
    if ((!team) || (!players)) {
        return (
            <div className={styles.loading}>
                <h2 className={styles.error}>
                    Team not found
                </h2>
            </div>
        )
    }



    return (
        // <div>Team {JSON.stringify({ team: team, players: players })}</div>
        <div className={styles.team_page}>
            <GoBack />
            <TeamCard data={{
                name: team.name,
                nickname: team.nickname,
                image: team.image,
                totalPoints: getTotalPointsOfTeam(),
                totalMarketValue: getTotalMarketValueOfTeam(),
                numberOfPlayers: getNumberOfPlayersOfTeam(),
                numberOfAvailablePlayers: getNumberOfAvailablePlayersOfTeam(),
            }} />

            <div className={styles.team_players}>

                {
                    getSortedPlayersByPoints().map((player, index) => {
                        return (
                            <div className={styles.card} key={player.playerID}>
                                <div className={styles.top_row} onClick={() => { router.push(`/player/${player.playerID}`) }}>
                                    <img className={styles.player_image} src={getImageSource(player.image)} />
                                    <p className={styles.name}>{player.name} </p>
                                    <p className={styles.position}>{getTranslatedPosition(player.position)}</p>
                                    <p className={styles.points}>{player.points}</p>
                                </div>


                                <div className={styles.market_value_row}>
                                    <p>Market Value</p>
                                    <p className={styles.market_value}>€{player.marketValue}</p>
                                </div>


                                <div className={styles.player_status_row}>
                                    {

                                        <img className={styles.player_team_image} src={getTeamImageSource(team.image)} />

                                    }
                                    <p className={styles.status}> {getProperStatus(player.status)}</p>

                                </div>



                            </div>

                        )
                    })
                }
            </div>
        </div>
    )
}

export default Team