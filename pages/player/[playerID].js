"use client";
import React, { useEffect, useRef } from 'react'
import styles from '@/styles/Player.module.css'
import { useState } from 'react'
import { getPlayerById, getTeamByTeamID } from '@/database/client';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/router';
import LineChart from '@/components/LineChart';



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



function PlayerCard({ player, showingTab = TAB_TYPE.DEFAULT, team }) {



    return (
        <div className={styles.player_card}>

            <div className={styles.player_card_image_container}>
                <img className={styles.player_card_image} src={getImageSource(player.image)} />
                {
                    team &&
                    <img className={styles.player_card_team_image} src={getTeamImageSource(team.image)} />
                }
            </div>



            {
                (showingTab !== TAB_TYPE.SHOW_STATS && showingTab !== TAB_TYPE.SHOW_GRAPH) &&
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

function PlayerStatsCard({ stat }) {


    if (stat && stat.length > 0) stat = stat[0];
    else stat = null;


    // {"playerID":1300,"ball_recovery":[6,1],"effective_clearance":[1,0],"goal_assist":[0,0],"goals":[0,0],"goals_conceded":[1,0],"isInIdealFormation":false,"marca_points":[-1,2],"mins_played":[45,1],"offtarget_att_assist":[0,0],"own_goals":[0,0],"pen_area_entries":[1,0],"penalty_conceded":[0,0],"penalty_failed":[0,0],"penalty_save":[0,0],"penalty_won":[0,0],"poss_lost_all":[5,0],"red_card":[0,0],"saves":[0,0],"second_yellow_card":[0,0],"totalPoints":4,"total_scoring_att":[1,0],"week":4,"won_contest":[1,0],"yellow_card":[0,0]}


    return (
        <div className={styles.player_stats_card}>
            {
                (!stat) &&
                <div className={styles.player_stats_card_empty}>
                    No statistics about the player available
                </div>
            }
            {
                stat &&
                <div className={styles.player_stats_card_stats}>
                    <div className={styles.statsTable}>

                        {/* week */}
                        <div className={styles.stat_week}></div>
                        <div className={styles.stat_week}></div>
                        <div className={styles.stat_week}>{`Week : ` + stat.week}</div>
                        {/* total points */}
                        <div className={styles.stat_week}></div>
                        <div className={styles.stat_week}></div>
                        <div className={styles.stat_week}>{`Total : ` + stat.totalPoints}</div>


                        <div className={styles.header}>Amount</div>
                        <div className={styles.header}>Stats</div>
                        <div className={styles.header}>Points</div>
                        {/* ball_recovery */}
                        <div className={styles.data}>{stat.ball_recovery[0]}</div>
                        <div className={styles.data}>Ball Recovery</div>
                        <div className={styles.data}>{stat.ball_recovery[1]}</div>
                        {/* effective_clearance */}
                        <div className={styles.data}>{stat.effective_clearance[0]}</div>
                        <div className={styles.data}>Effective Clearance</div>
                        <div className={styles.data}>{stat.effective_clearance[1]}</div>
                        {/* goal_assist */}
                        <div className={styles.data}>{stat.goal_assist[0]}</div>
                        <div className={styles.data}>Goal Assist</div>
                        <div className={styles.data}>{stat.goal_assist[1]}</div>
                        {/* goals */}
                        <div className={styles.data}>{stat.goals[0]}</div>
                        <div className={styles.data}>Goals</div>
                        <div className={styles.data}>{stat.goals[1]}</div>
                        {/* goals_conceded */}
                        <div className={styles.data}>{stat.goals_conceded[0]}</div>
                        <div className={styles.data}>Goals Conceded</div>
                        <div className={styles.data}>{stat.goals_conceded[1]}</div>
                        {/* marca_points */}
                        <div className={styles.data}>{stat.marca_points[0]}</div>
                        <div className={styles.data}>Marca Points</div>
                        <div className={styles.data}>{stat.marca_points[1]}</div>
                        {/* mins_played */}
                        <div className={styles.data}>{stat.mins_played[0]}</div>
                        <div className={styles.data}>Minutes Played</div>
                        <div className={styles.data}>{stat.mins_played[1]}</div>
                        {/* offtarget_att_assist */}
                        <div className={styles.data}>{stat.offtarget_att_assist[0]}</div>
                        <div className={styles.data}>Offtarget Att Assist</div>
                        <div className={styles.data}>{stat.offtarget_att_assist[1]}</div>
                        {/* own_goals */}
                        <div className={styles.data}>{stat.own_goals[0]}</div>
                        <div className={styles.data}>Own Goals</div>
                        <div className={styles.data}>{stat.own_goals[1]}</div>
                        {/* pen_area_entries */}
                        <div className={styles.data}>{stat.pen_area_entries[0]}</div>
                        <div className={styles.data}>Pen Area Entries</div>
                        <div className={styles.data}>{stat.pen_area_entries[1]}</div>
                        {/* penalty_conceded */}
                        <div className={styles.data}>{stat.penalty_conceded[0]}</div>
                        <div className={styles.data}>Penalty Conceded</div>
                        <div className={styles.data}>{stat.penalty_conceded[1]}</div>
                        {/* penalty_failed */}
                        <div className={styles.data}>{stat.penalty_failed[0]}</div>
                        <div className={styles.data}>Penalty Failed</div>
                        <div className={styles.data}>{stat.penalty_failed[1]}</div>
                        {/* penalty_save */}
                        <div className={styles.data}>{stat.penalty_save[0]}</div>
                        <div className={styles.data}>Penalty Save</div>
                        <div className={styles.data}>{stat.penalty_save[1]}</div>
                        {/* penalty_won */}
                        <div className={styles.data}>{stat.penalty_won[0]}</div>
                        <div className={styles.data}>Penalty Won</div>
                        <div className={styles.data}>{stat.penalty_won[1]}</div>
                        {/* poss_lost_all */}
                        <div className={styles.data}>{stat.poss_lost_all[0]}</div>
                        <div className={styles.data}>Poss Lost All</div>
                        <div className={styles.data}>{stat.poss_lost_all[1]}</div>
                        {/* red_card */}
                        <div className={styles.data}>{stat.red_card[0]}</div>
                        <div className={styles.data}>Red Card</div>
                        <div className={styles.data}>{stat.red_card[1]}</div>
                        {/* saves */}
                        <div className={styles.data}>{stat.saves[0]}</div>
                        <div className={styles.data}>Saves</div>
                        <div className={styles.data}>{stat.saves[1]}</div>
                        {/* second_yellow_card */}
                        <div className={styles.data}>{stat.second_yellow_card[0]}</div>
                        <div className={styles.data}>Second Yellow Card</div>
                        <div className={styles.data}>{stat.second_yellow_card[1]}</div>
                        {/* totalPoints */}
                        <div className={styles.data}>{stat.totalPoints}</div>
                        <div className={styles.data}>Total Points</div>
                        <div className={styles.data}>{stat.totalPoints}</div>
                        {/* total_scoring_att */}
                        <div className={styles.data}>{stat.total_scoring_att[0]}</div>
                        <div className={styles.data}>Total Scoring Att</div>
                        <div className={styles.data}>{stat.total_scoring_att[1]}</div>
                        {/* won_contest */}
                        <div className={styles.data}>{stat.won_contest[0]}</div>
                        <div className={styles.data}>Won Contest</div>
                        <div className={styles.data}>{stat.won_contest[1]}</div>
                        {/* yellow_card */}
                        <div className={styles.data}>{stat.yellow_card[0]}</div>
                        <div className={styles.data}>Yellow Card</div>
                        <div className={styles.data}>{stat.yellow_card[1]}

                        </div>
                    </div>

                </div>
            }
        </div>
    )
}


function PlayerPriceGraph({ player, isSmallDevice }) {
    return (
        <div className={styles.player_price_graph}>
            <LineChart chartData={player.marketValues} isSmallDevice={isSmallDevice} />
        </div>
    )
}

function GoBack({ showWeekDropdown, selectedWeek, setSelectedWeek, weeks }) {


    const router = useRouter();
    return (
        <div className={styles.go_to_home}>
            <p onClick={() => router.push('/')}>
                Home
            </p>

            {
                showWeekDropdown && weeks && weeks.length > 0 &&
                <select value={selectedWeek} onChange={(e) => {
                    setSelectedWeek(parseInt(e.target.value));
                }}
                >
                    {
                        weeks.map((week, index) => (
                            <option key={index} value={week}>{week}</option>
                        ))
                    }
                </select>

            }
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
            <div className={`${styles.tab_changer_tab} ${showingTab === TAB_TYPE.SHOW_GRAPH ? styles.tab_changer_tab_selected : ''}`}
                onClick={() => setShowingTab(TAB_TYPE.SHOW_GRAPH)}>
                Graph
            </div>
            <div className={`${styles.tab_changer_tab} ${showingTab === TAB_TYPE.SHOW_STATS ? styles.tab_changer_tab_selected : ''}`}
                onClick={() => setShowingTab(TAB_TYPE.SHOW_STATS)}>
                Stats
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

    const [selectedWeek, setSelectedWeek] = useState(null);
    const [weeks, setWeeks] = useState([]);
    const [selectedWeekStats, setSelectedWeekStats] = useState(null);






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
            if (fetchedTeam && fetchedTeam.length > 0)
                setTeam(fetchedTeam[0]);
            setIsLoading(false);
        }
        if (playerID) {
            fetchData();
        }
    }, [playerID]);


    useEffect(() => {

        if (stats) {
            // sort stats by week
            const sortedStats = stats.sort((a, b) => { return a.week - b.week });
            setSelectedWeek(sortedStats[sortedStats.length - 1]?.week);
            let statWeeks = sortedStats.map((stat) => stat.week);
            setWeeks(statWeeks);
        }

    }, [stats]);


    useEffect(() => {
        const processedSelectedWeeksStats = stats.filter((stat) => stat.week === selectedWeek);
        // console.log('selected week is : ', selectedWeek);
        // console.log('stats are : ', stats);
        // console.log('processedSelectedWeeksStats are : ', processedSelectedWeeksStats);
        setSelectedWeekStats(processedSelectedWeeksStats);
    }, [selectedWeek]);






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
                <GoBack showWeekDropdown={TAB_TYPE.SHOW_STATS === showingTab} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} weeks={weeks} />
                <p>
                    selectedWeek
                </p>
                <PlayerCard player={player} showingTab={showingTab} team={team} />
                {
                    showingTab === TAB_TYPE.SHOW_STATS &&
                    <PlayerStatsCard stat={selectedWeekStats} />
                }
                {
                    showingTab === TAB_TYPE.SHOW_GRAPH &&
                    <PlayerPriceGraph player={player} isSmallDevice={isSmallDevice} />
                }
                <TabChanger showingTab={showingTab} setShowingTab={setShowingTab} />
            </div>
        )


    }


    return (
        <div className={styles.player_main_container}>
            <div className={styles.player_main_container_left}>
                <GoBack showWeekDropdown={true} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} weeks={weeks} />
                <PlayerStatsCard stat={selectedWeekStats} />
            </div>

            <div className={styles.player_main_container_right}>
                <PlayerCard player={player} team={team} />
                <PlayerPriceGraph player={player} />
            </div>

        </div>
    )
}

export default Player