import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS, ADMIN_REQUEST_STATUS } from '@/utils/types'
import { useEffect } from 'react'
import { useState } from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import { useRouter } from 'next/router'
import { addPlayers, addStats } from '@/database/functions'


const Players = () => {

    const [startingIndex, setStartingIndex] = useState(0);
    const [endingIndex, setEndingIndex] = useState(1850);

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

        if (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) {
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


        const url = `https://nextjs-cors-anywhere.vercel.app/api?endpoint=${baseUrl}${endpoint}?x-lang=en`;



        try {
            const response = await fetch(url, { method: 'GET' });

            if (response.status === 404 || !response.ok) {
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            // console.log('There was a problem with the fetch operation:', error);
            return null;
        }
    }





    function filterDuplicateWeekStats(stats) {
        // Create an object to store the first occurrence of each player ID and week combination
        const firstStats = {};

        // Iterate through the stats array
        for (let i = 0; i < stats.length; i++) {
            const stat = stats[i];
            const playerID = stat.playerID;
            const week = stat.week;
            const key = playerID + '-' + week;

            // Check if this combination of player ID and week has already been encountered
            if (!firstStats[key]) {
                // If not encountered, store it as the first occurrence
                firstStats[key] = stat;
            }
        }

        // Convert the values of the firstStats object back into an array
        const filteredStats = Object.values(firstStats);

        return filteredStats;
    }



    function formatPlayerStats(statData, playerId) {

        const stats = [];

        for (let i = 0; i < statData.length; i++) {

            const playerID = playerId;
            const weekID = statData[i].weekNumber;
            const totalPoints = statData[i].totalPoints;
            const isInIdealFormation = statData[i].isInIdealFormation;
            const mins_played = statData[i].stats.mins_played;
            const goals = statData[i].stats.goals;
            const goal_assist = statData[i].stats.goal_assist;
            const offtarget_att_assist = statData[i].stats.offtarget_att_assist;
            const pen_area_entries = statData[i].stats.pen_area_entries;
            const penalty_won = statData[i].stats.penalty_won;
            const penalty_save = statData[i].stats.penalty_save;
            const saves = statData[i].stats.saves;
            const effective_clearance = statData[i].stats.effective_clearance;
            const penalty_failed = statData[i].stats.penalty_failed;
            const own_goals = statData[i].stats.own_goals;
            const goals_conceded = statData[i].stats.goals_conceded;
            const yellow_card = statData[i].stats.yellow_card;
            const second_yellow_card = statData[i].stats.second_yellow_card;
            const red_card = statData[i].stats.red_card;
            const total_scoring_att = statData[i].stats.total_scoring_att;
            const won_contest = statData[i].stats.won_contest;
            const ball_recovery = statData[i].stats.ball_recovery;
            const poss_lost_all = statData[i].stats.poss_lost_all;
            const penalty_conceded = statData[i].stats.penalty_conceded;
            const marca_points = statData[i].stats.marca_points;


            const statObject = {
                playerID: playerID,
                week: weekID,
                totalPoints: totalPoints,
                isInIdealFormation: isInIdealFormation,
                mins_played: mins_played,
                goals: goals,
                goal_assist: goal_assist,
                offtarget_att_assist: offtarget_att_assist,
                pen_area_entries: pen_area_entries,
                penalty_won: penalty_won,
                penalty_save: penalty_save,
                saves: saves,
                effective_clearance: effective_clearance,
                penalty_failed: penalty_failed,
                own_goals: own_goals,
                goals_conceded: goals_conceded,
                yellow_card: yellow_card,
                second_yellow_card: second_yellow_card,
                red_card: red_card,
                total_scoring_att: total_scoring_att,
                won_contest: won_contest,
                ball_recovery: ball_recovery,
                poss_lost_all: poss_lost_all,
                penalty_conceded: penalty_conceded,
                marca_points: marca_points
            }
            stats.push(statObject);

        }


        return filterDuplicateWeekStats(stats);

    }


    function findImage(imagesObject) {
        // Iterate through each category in the images object
        for (const category in imagesObject) {
            // Iterate through each image URL in the category
            for (const dimension in imagesObject[category]) {
                const imageUrl = imagesObject[category][dimension];
                // Check if the image URL contains "no-player.png"
                if (!imageUrl.includes("no-player")) {
                    // Found a real image, return its URL
                    return imageUrl;
                }
            }
        }
        // No real image found, return an empty string
        return "";
    }





    function splitPlayersData(data) {
        let players = [];
        let allStatistics = [];


        for (let i = 0; i < data.length; i++) {

            let playerID = parseInt(data[i].id);
            let averagePoints = data[i].averagePoints;
            let marketValue = data[i].marketValue;
            let name = data[i].name;
            let nickname = data[i].nickname;
            let position = data[i].position;
            let positionID = data[i].positionId;
            let status = data[i].playerStatus;
            let teamID = data[i].team?.id ? parseInt(data[i].team.id) : null;
            let image = findImage(data[i].images);
            let points = data[i].points;


            const player = {
                playerID: playerID,
                name: name,
                nickname: nickname,
                status: status,
                position: position,
                positionID: positionID,
                marketValue: marketValue,
                averagePoints: averagePoints,
                points: points,
                teamID: teamID,
                image: image
            }

            const stats = formatPlayerStats(data[i].playerStats, playerID);





            players.push(player);
            allStatistics.push(...stats);
        }


        return {
            players: players,
            stats: allStatistics
        }
    }

    async function getPlayers() {
        let players = [];
        for (let playerId = currentIndex; playerId < endingIndex; playerId++) {
            const data = await fetchData(playerId);
            setCurrentIndex(playerId);
            if (data) {
                players.push(data);
                console.log(data);
                console.log("Player name: " + data.name);
            }
            else {
                console.log("Player with id " + playerId + " not found");
            }
        }
        // need to reformate players data
        const { players: playersData, stats: statsData } = splitPlayersData(players);
        console.log('players: ', playersData);
        console.log('stats: ', statsData);
        //adding players to database
        await addPlayers(playersData);
        //adding stats to database
        await addStats(statsData);
        setCurrentState(ADMIN_REQUEST_STATUS.IDLE);
    }








    // Call getPlayers when the component mounts or when currentIndex, endingIndex, or currentState change
    useEffect(() => {
        if (currentState === ADMIN_REQUEST_STATUS.IN_PROGRESS) {
            getPlayers();
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
            <div> <h1 className={styles.dashboard_heading}>Update Players</h1> </div>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.PLAYERS} />
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
                                    if (parseInt(endingIndex) <= parseInt(startingIndex)) {
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

export default Players