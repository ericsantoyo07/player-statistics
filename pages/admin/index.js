import React from 'react'
import { useState } from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'
import AdminPageCard from '@/components/AdminPageCard'



const Index = () => {

    return (
        <div className={styles.admin_dashboard}>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.HOME} />
            
            <h1 className={styles.dashboard_heading}>Welcome to the Admin Dashboard</h1>
            

            <div className={styles.admin_dashboard_content}>


                <AdminPageCard item={ADMIN_NAVIGATION_ITEMS.PLAYERS} />
                <AdminPageCard item={ADMIN_NAVIGATION_ITEMS.TEAMS} />
                <AdminPageCard item={ADMIN_NAVIGATION_ITEMS.SCHEDULES} />

            </div>


        </div>
    )
}

export default Index