import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS, ADMIN_REQUEST_STATUS } from '@/utils/types'
import { useEffect } from 'react'
import { useState } from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import { useRouter } from 'next/router'
import { addMatches } from '@/database/functions'

const Schedules = () => {

    const [startingIndex, setStartingIndex] = useState(0);
    const [endingIndex, setEndingIndex] = useState(38);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentState, setCurrentState] = useState(ADMIN_REQUEST_STATUS.IDLE);


    const [progressPercentage, setProgressPercentage] = useState(0);

    const router = useRouter();

    const handleStartingIndexChange = (e) => {

        if (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) {
            return;
        }
        // Remove leading zeros and parse the input as an integer
        const parsedValue = parseInt(e.target.value, 10);

        // Check if the parsed value is a valid number
        if (!isNaN(parsedValue)) {
            // Ensure the value is within the allowed range (0 to 38)
            const newValue = Math.min(38, Math.max(0, parsedValue));
            setStartingIndex(newValue);
            setCurrentIndex(newValue);
        } else if (e.target.value === "") {
            // If nothing is entered, set it to 0
            setStartingIndex(0);
            setCurrentIndex(0);
        }
    }

    const handleEndingIndexChange = (e) => {

        if (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) {
            return;
        }

        // Remove leading zeros and parse the input as an integer
        const parsedValue = parseInt(e.target.value, 10);

        // Check if the parsed value is a valid number
        if (!isNaN(parsedValue)) {
            // Ensure the value is within the allowed range (0 to 38)
            const newValue = Math.min(38, Math.max(0, parsedValue));
            setEndingIndex(newValue);
        } else if (e.target.value === "") {
            // If nothing is entered, set it to 0
            setEndingIndex(0);
        }
    }


    function formatMatches(matches, week) {
        const formattedMatches = [];

        matches.forEach((match) => {
            formattedMatches.push({
                matchID: match.id,
                matchDate: match.matchDate,
                matchState: match.matchState,
                localScore: match.localScore,
                visitorScore: match.visitorScore,
                localTeamID: match.local.id,
                visitorTeamID: match.visitor.id,
                week: week,
            });
        });

        return formattedMatches;
    }




    async function fetchData(weekID) {
        const baseUrl = 'https://api-fantasy.llt-services.com/stats';
        const endpoint = `/v1/stats/week/${weekID}?x-lang=en`;


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

    async function getSchedules() {

        const matches = [];
        for (let weekID = currentIndex; weekID < endingIndex; weekID++) {
            if (currentState === ADMIN_REQUEST_STATUS.IDLE) {
                break;
            }
            const data = await fetchData(weekID);
            if (data) {
                const formattedMatches = formatMatches(data, weekID);
                matches.push(...formattedMatches);
            }
            setCurrentIndex(weekID);
            if (data) {
                console.log('weekID: ', weekID);
                console.log(data);
            }
        }
        console.log('matches: ', matches);
        // add matches to database
        await addMatches(matches);
        setCurrentIndex(0);
        setCurrentState(ADMIN_REQUEST_STATUS.IDLE);
    }








    // Call getPlayers when the component mounts or when currentIndex, endingIndex, or currentState change
    useEffect(() => {
        if (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) {
            getSchedules();
        }
    }, [currentState]);


    useEffect(() => {
        if (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) {
            const percentage = Math.round(((currentIndex - startingIndex) / (endingIndex - startingIndex)) * 100);
            setProgressPercentage(percentage);
        }
        else {
            setProgressPercentage(0);
        }
    }, [currentIndex, currentState]);






    return (
        <div className={styles.admin_dashboard}>
            <div> <h1 className={styles.dashboard_heading}>Update Schedules</h1> </div>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.SCHEDULES} />
            <div className={styles.admin_dashboard_content}>

                <div className={styles.admin_players_content}>
                    {
                        (currentState === ADMIN_REQUEST_STATUS.IDLE) &&
                        <div className={styles.admin_player_input_container}>
                            <p className={styles.admin_player_input_label}>Starting Index</p>
                            <input className={styles.admin_player_input} placeholder="starting index" value={startingIndex} onChange={handleStartingIndexChange} />
                            <p className={styles.admin_player_input_label}>Ending Index</p>
                            <input className={styles.admin_player_input} placeholder="ending index" value={endingIndex} onChange={handleEndingIndexChange} />
                        </div>
                    }





                    {
                        (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) &&
                        <div className={styles.progress}>

                            <h3>
                                {`Completed ${currentIndex - startingIndex} of ${endingIndex - startingIndex} requests`}
                            </h3>
                            <ProgressBar
                                completed={parseInt(progressPercentage)}
                                customLabel={`${parseInt(progressPercentage)}` + "%"}
                                bgColor="#558680"
                            />
                        </div>
                    }
                    <div className={styles.admin_player_button_container}>
                        {
                            (currentState === ADMIN_REQUEST_STATUS.IDLE) ?
                                <button className={styles.admin_player_button} onClick={() => {
                                    if (parseInt(startingIndex) >= parseInt(endingIndex)) {
                                        return;
                                    }
                                    setCurrentIndex(startingIndex);
                                    setCurrentState(ADMIN_REQUEST_STATUS.IN_PROGRESS);
                                }}>Start</button>
                                :
                                <button className={styles.admin_player_button} onClick={async () => {
                                    router.reload();
                                }}>Cancel</button>
                        }
                    </div>



                </div>
            </div>
        </div>
    )
}

export default Schedules