import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS, ADMIN_REQUEST_STATUS } from '@/utils/types'
import { useEffect } from 'react'
import { useState } from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import { addTeams } from '@/database/functions'

const Teams = () => {

    const [currentState, setCurrentState] = useState(ADMIN_REQUEST_STATUS.IDLE);


    const [progressPercentage, setProgressPercentage] = useState(0);



    async function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }



    async function fetchData() {
        const baseUrl = ' https://api-fantasy.llt-services.com';
        const endpoint = `/api/v3/teams-master?x-lang=en`;
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
            return data.teams;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return null;
        }
    }

    function formatTeams(data) {
        let teams = [];

        for (let i = 0; i < data.length; i++) {
            const team = data[i];
            const teamObject = {
                teamID: parseInt(team.id),
                name: team.name,
                nickname: team.shortName,
                image: team.badgeColor,
            }
            teams.push(teamObject);
        }

        return teams;

        
    }

    async function getTeams() {


        setProgressPercentage(25);
        await wait(500);
        setProgressPercentage(50);
        await wait(500);
        setProgressPercentage(75);
        await wait(500);
        setProgressPercentage(98);
        
        let data = await fetchData();
        const teams = formatTeams(data);
        console.log('teams', teams);
        // adding teams to database
        await addTeams(teams);
        setProgressPercentage(0);
        setCurrentState(ADMIN_REQUEST_STATUS.IDLE);
    }








    // Call getPlayers when the component mounts or when currentIndex, endingIndex, or currentState change
    useEffect(() => {
        if (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) {
            getTeams();
        }

    }, [currentState]);







    return (
        <div className={styles.admin_dashboard}>
            <div> <h1 className={styles.dashboard_heading}>Update Teams Data</h1> </div>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.TEAMS} />
            <div className={styles.admin_dashboard_content}>

                <div className={styles.admin_players_content}>

                    {
                        (currentState === ADMIN_REQUEST_STATUS.IDLE) &&
                        <div className={styles.admin_players_content_info}>
                            <h3>
                                {`Click on the Start button to get Teams Data from API`}
                            </h3>
                        </div>
                    }

                    {
                        (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) &&
                        <div className={styles.progress}>

                            <h3>
                                {`Getting Teams Data from API`}
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

                                    setCurrentState(ADMIN_REQUEST_STATUS.IN_PROGRESS);
                                }}>Start</button>
                                :
                                <button className={styles.admin_player_button} onClick={async () => {
                                    setCurrentState(ADMIN_REQUEST_STATUS.IDLE);
                                }}>Cancel</button>
                        }
                    </div>



                </div>
            </div>
        </div>
    )
}

export default Teams;