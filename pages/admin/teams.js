import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'

const Teams = () => {
    return (
        <div className={styles.admin_dashboard}>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.TEAMS} />
            <div className={styles.admin_dashboard_content}>
                <h1>Welcome to the Admin Dashboard - teams</h1>
            </div>
        </div>
    )
}

export default Teams