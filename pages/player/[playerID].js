"use client";
import React, { useEffect } from 'react'
import styles from '@/styles/Player.module.css'
import { useState } from 'react'
import { getPlayerById } from '@/database/client';
import { useMediaQuery } from '@/hooks/useMediaQuery';


function PlayerCard({ player, stats }) {
    return (
        <div className={styles.player_card}>
            {
                JSON.stringify(player)
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

            <div>
                Player {playerID} - small
                {
                    JSON.stringify(player)
                }
                {
                    JSON.stringify(stats)
                }
            </div>
        )


    }


    return (
        <div>
            Player {playerID} - large
            {
                JSON.stringify(player)
            }
            {
                JSON.stringify(stats)
            }

        </div>
    )
}

export default Player