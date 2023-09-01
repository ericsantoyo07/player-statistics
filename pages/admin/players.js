import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'

const Players = () => {
    return (
        <div className={styles.admin_dashboard}>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.PLAYERS} />
            <div className={styles.admin_dashboard_content}>
                <h1>Welcome to the Admin Dashboard - players</h1>
            </div>
        </div>
    )
}

export default Players