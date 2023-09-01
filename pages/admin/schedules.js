import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/hooks/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'

const Schedules = () => {

    return (
        <div className={styles.admin_dashboard}>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.SCHEDULES} />
            <div className={styles.admin_dashboard_content}>
                <h1>Welcome to the Admin Dashboard - schedules</h1>
            </div>


        </div>
    )
  
}

export default Schedules