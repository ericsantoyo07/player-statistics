"use client";
import React, { useEffect } from 'react'
import styles from '@/styles/Player.module.css'
import { useState } from 'react'
import { getPlayerById } from '@/database/client';
import { useMediaQuery } from '@/hooks/useMediaQuery';




function getImageSource(src) {
    if (src && src !== '') {
        return src;
    }
    return 'https://assets-fantasy.llt-services.com/players/no-player.png';
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



function PlayerCard({ player, stats }) {



    return (
        <div className={styles.player_card}>

            <div className={styles.player_card_image_container}>
                <img src={getImageSource(player.image)} />
            </div>

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
    return (
        <div className={styles.go_to_home}>
            Home
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






    useEffect(() => {
        const path = window.location.pathname;
        const playerID = path.split('/').pop();
        setPlayerID(playerID);
    }, []);

    useEffect(() => {

        async function fetchData() {
            setIsLoading(true);
            const { player: fetchedPlayer, stats: fetchedStats } = await getPlayerById(playerID);
            setPlayer(fetchedPlayer);
            setStats(fetchedStats);
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
                <PlayerCard player={player} />
                <PlayerStatsCard stats={stats} />
                <PlayerPriceGraph player={player} />
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
                <PlayerCard player={player} />
                <PlayerPriceGraph player={player} />
            </div>

        </div>
    )
}

export default Player