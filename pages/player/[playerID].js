"use client";
import React, { useEffect } from 'react'
import styles from '@/styles/Player.module.css'
import { useState } from 'react'
import { getPlayerById, getTeamByTeamID } from '@/database/client';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/router';

const TAB_TYPE = {
    DEFAULT: 'DEFAULT',
    SHOW_STATS: 'SHOW_STATS',
    SHOW_GRAPH: 'SHOW_GRAPH',
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



function PlayerCard({ player, setShowingTab, showingTab = TAB_TYPE.DEFAULT, team }) {



    return (
        <div className={styles.player_card} onClick={() => {
            if (setShowingTab)
                setShowingTab(TAB_TYPE.DEFAULT)
        }}>

            <div className={styles.player_card_image_container}>
                <img className={styles.player_card_image}src={getImageSource(player.image)} />
                <img className={styles.player_card_team_image} src={getTeamImageSource(team.image)} />
            </div>



            {
                (showingTab !== TAB_TYPE.SHOW_GRAPH && showingTab !== TAB_TYPE.SHOW_STATS) &&
                <div className={styles.player_card_info}>

                    <div className={styles.player_card_info_row}>
                        <div className={styles.player_card_info_container_left}>
                            <div className={styles.player_card_info_position}>
                                {getTranslatedPosition(player.position)}
                            </div>
                            <div className={styles.player_card_info_name}>
                                {player.name}
                            </div>
                        </div>

                        <div className={styles.player_card_info_container_right}>
                            <div className={styles.player_card_info_title}>
                                Total Points
                            </div>
                            <div className={styles.player_card_info_value}>
                                {player.points}
                            </div>
                        </div>
                    </div>


                    <div className={styles.player_card_info_row}>
                        <div className={styles.player_card_info_container_left}>
                            <div className={styles.player_card_info_value_title}>
                                Value
                            </div>
                            <div className={styles.player_card_info_value}>
                                {player.marketValue}
                            </div>
                        </div>

                        <div className={styles.player_card_info_container_right}>
                            <div className={styles.player_card_info_title}>
                                Average Points
                            </div>
                            <div className={styles.player_card_info_value}>
                                {player.averagePoints}
                            </div>
                        </div>
                    </div>

                </div>
            }
        </div>
    )

}

function PlayerStatsCard({ stats }) {
    return (
        <div className={styles.player_stats_card}>
            {
                JSON.stringify(stats)
            }
            player stats card
        </div>
    )
}

function PlayerPriceGraph({ player }) {
    return (
        <div className={styles.player_price_graph}>
            {
                JSON.stringify(player.marketValues)
            }
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




function TabChanger({ showingTab, setShowingTab }) {
    return (
        <div className={styles.tab_changer}>
            <div className={`${styles.tab_changer_tab} ${showingTab === TAB_TYPE.DEFAULT ? styles.tab_changer_tab_selected : ''}`}
                onClick={() => setShowingTab(TAB_TYPE.DEFAULT)}>
                Info
            </div>
            <div className={`${styles.tab_changer_tab} ${showingTab === TAB_TYPE.SHOW_STATS ? styles.tab_changer_tab_selected : ''}`}
                onClick={() => setShowingTab(TAB_TYPE.SHOW_STATS)}>
                Stats
            </div>
            <div className={`${styles.tab_changer_tab} ${showingTab === TAB_TYPE.SHOW_GRAPH ? styles.tab_changer_tab_selected : ''}`}
                onClick={() => setShowingTab(TAB_TYPE.SHOW_GRAPH)}>
                Graph
            </div>
        </div>
    )
}


const Player = () => {

    const smallDeviceWidth = 768;
    const isSmallDevice = useMediaQuery(smallDeviceWidth);

    const [playerID, setPlayerID] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [player, setPlayer] = useState(null);
    const [stats, setStats] = useState([]);
    const [team, setTeam] = useState(null);
    const [showingTab, setShowingTab] = useState(TAB_TYPE.DEFAULT);






    useEffect(() => {
        const path = window.location.pathname;
        const playerID = path.split('/').pop();
        setPlayerID(playerID);
    }, []);

    useEffect(() => {

        async function fetchData() {
            setIsLoading(true);
            const { player: fetchedPlayer, stats: fetchedStats } = await getPlayerById(playerID);
            const { data: fetchedTeam } = await getTeamByTeamID(fetchedPlayer.teamID);
            setPlayer(fetchedPlayer);
            setStats(fetchedStats);
            setTeam(fetchedTeam[0]);
            setIsLoading(false);
        }
        if (playerID) {
            fetchData();
        }
    }, [playerID]);



    if (!playerID || isLoading) return (
        <div className={styles.loading_overlay}>
            <img src='/loading.gif' />
        </div>
    );

    else if (!player && !isLoading) return (
        <div>
            Player not found
        </div>
    );


    if (isSmallDevice) {
        return (

            <div className={styles.player_main_container}>
                <GoBack />
                <PlayerCard player={player} setShowingTab={setShowingTab} showingTab={showingTab} team={team} />
                <TabChanger showingTab={showingTab} setShowingTab={setShowingTab} />
                {
                    showingTab === TAB_TYPE.SHOW_STATS &&
                    <PlayerStatsCard stats={stats} />
                }
                {
                    showingTab === TAB_TYPE.SHOW_GRAPH &&
                    <PlayerPriceGraph player={player} />
                }
            </div>
        )


    }


    return (
        <div className={styles.player_main_container}>
            <div className={styles.player_main_container_left}>
                <GoBack />
                <PlayerStatsCard stats={stats} />
            </div>

            <div className={styles.player_main_container_right}>
                <PlayerCard player={player} team={team} />
                <PlayerPriceGraph player={player} />
            </div>

        </div>
    )
}

export default Player