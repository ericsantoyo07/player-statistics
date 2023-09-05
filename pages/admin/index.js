import React from 'react'
import { useState, useEffect } from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'
import AdminPageCard from '@/components/AdminPageCard'
import { getMatchesCount, getPlayersCount, getTeamsCount } from '@/database/functions'



const Index = () => {


    const [playersCount, setPlayersCount] = useState(null);
    const [teamsCount, setTeamsCount] = useState(null);
    const [schedulesCount, setSchedulesCount] = useState(null);


    useEffect(() => {

        async function fetchData() {
            const fetchedPlayerCount = await getPlayersCount();
            const fetchedTeamCount = await getTeamsCount();
            const fetchedScheduleCount = await getMatchesCount();

            setPlayersCount(fetchedPlayerCount);
            setTeamsCount(fetchedTeamCount);
            setSchedulesCount(fetchedScheduleCount);
        }

        fetchData();
    }, []);






    return (
        <div className={styles.admin_dashboard}>
            <h1 className={styles.dashboard_heading}>Admin Dashboard</h1>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.HOME} />

            <div className={styles.admin_dashboard_content}>
                <AdminPageCard item={ADMIN_NAVIGATION_ITEMS.PLAYERS} count={playersCount} />
                <AdminPageCard item={ADMIN_NAVIGATION_ITEMS.TEAMS} count={teamsCount} />
                <AdminPageCard item={ADMIN_NAVIGATION_ITEMS.SCHEDULES} count={schedulesCount} />

            </div>


        </div>
    )
}

export default Index