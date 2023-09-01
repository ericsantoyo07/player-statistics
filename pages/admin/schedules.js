import React from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNavigationBar from '@/components/AdminNavigationBar'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'

const Schedules = () => {

    return (
        <div className={styles.admin_dashboard}>
            <AdminNavigationBar active={ADMIN_NAVIGATION_ITEMS.SCHEDULES} />
            <div className={styles.admin_dashboard_content}>
                <h3 className={styles.dashboard_heading}>{"Admin > schedules"}</h3>
            </div>


        </div>
    )

}

export default Schedules