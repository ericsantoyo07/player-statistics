import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS, ADMIN_PLAYER_REQUEST_STATUS } from '@/utils/types'
import { useEffect } from 'react'
import { useState } from 'react'


const Players = () => {

    const [startingIndex, setStartingIndex] = useState(0);
    const [endingIndex, setEndingIndex] = useState(1850);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentState, setCurrentState] = useState(ADMIN_PLAYER_REQUEST_STATUS.IDLE);

    const handleStartingIndexChange = (e) => {

        if (currentState === ADMIN_PLAYER_REQUEST_STATUS.IN_PROGRESS) {
            return;
        }
        // Remove leading zeros and parse the input as an integer
        const parsedValue = parseInt(e.target.value, 10);

        // Check if the parsed value is a valid number
        if (!isNaN(parsedValue)) {
            // Ensure the value is within the allowed range (0 to 1850)
            const newValue = Math.min(1850, Math.max(0, parsedValue));
            setStartingIndex(newValue);
            setCurrentIndex(newValue);
        } else if (e.target.value === "") {
            // If nothing is entered, set it to 0
            setStartingIndex(0);
            setCurrentIndex(0);
        }
    }

    const handleEndingIndexChange = (e) => {

        if (currentState === ADMIN_PLAYER_REQUEST_STATUS.IN_PROGRESS) {
            return;
        }

        // Remove leading zeros and parse the input as an integer
        const parsedValue = parseInt(e.target.value, 10);

        // Check if the parsed value is a valid number
        if (!isNaN(parsedValue)) {
            // Ensure the value is within the allowed range (0 to 1850)
            const newValue = Math.min(1850, Math.max(0, parsedValue));
            setEndingIndex(newValue);
        } else if (e.target.value === "") {
            // If nothing is entered, set it to 0
            setEndingIndex(0);
        }
    }



    async function fetchData(playerId) {
        const baseUrl = 'https://api-fantasy.llt-services.com';
        const endpoint = `/api/v3/player/${playerId}?x-lang=en`;

        
        const url = `https://nextjs-cors-anywhere.vercel.app/api?endpoint=${baseUrl}${endpoint}`;

       

        try {
            const response = await fetch(url, { method: 'GET' });

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return null;
        }
    }

    async function getPlayers() {
        for (let playerId = currentIndex; playerId < endingIndex; playerId++) {
            const data = await fetchData(playerId);
            setCurrentIndex(playerId);
            if (data) {
                console.log(data);
                console.log("Player name: " + data.name);
            }
        }
        setCurrentState(ADMIN_PLAYER_REQUEST_STATUS.IDLE);
    }








    // Call getPlayers when the component mounts or when currentIndex, endingIndex, or currentState change
    useEffect(() => {
        if (currentState === ADMIN_PLAYER_REQUEST_STATUS.IN_PROGRESS) {
            getPlayers();
        }
    }, [currentState]);





    return (
        <div className={styles.admin_dashboard}>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.PLAYERS} />
            <div className={styles.admin_dashboard_content}>
                <h3 className={styles.dashboard_heading}>{"Admin > players"}</h3>

                <div className={styles.admin_players_content}>

                    <div className={styles.admin_player_input_container}>
                        <p className={styles.admin_player_input_label}>Starting Index</p>
                        <input className={styles.admin_player_input} placeholder="starting index" value={startingIndex} onChange={handleStartingIndexChange} />
                        <p className={styles.admin_player_input_label}>Ending Index</p>
                        <input className={styles.admin_player_input} placeholder="ending index" value={endingIndex} onChange={handleEndingIndexChange} />
                    </div>

                    {
                        (currentState === ADMIN_PLAYER_REQUEST_STATUS.IN_PROGRESS) &&
                        <div className={styles.status_container}>
                            <p className={styles.status_label}> Currently getting player for index: {currentIndex} </p>
                        </div>
                    }
                    <div className={styles.admin_player_button_container}>
                        {
                            (currentState === ADMIN_PLAYER_REQUEST_STATUS.IDLE) ?
                                <button className={styles.admin_player_button} onClick={() => {
                                    setCurrentIndex(startingIndex);
                                    setCurrentState(ADMIN_PLAYER_REQUEST_STATUS.IN_PROGRESS);
                                }}>Start</button>
                                :
                                <button className={styles.admin_player_button} onClick={async () => {
                                    setCurrentState(ADMIN_PLAYER_REQUEST_STATUS.IDLE);
                                    setCurrentIndex(startingIndex);
                                }}>Cancel</button>
                        }
                    </div>



                </div>
            </div>
        </div>
    )
}

export default Players