import styles from '@/styles/Admin.module.css'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'
import Link from 'next/link'


const AdminNavigationBar = ({ active }) => {

    return (
        <div className={styles.navigation_bar}>
            <div className={`${styles.navigation_bar_item} ${active === ADMIN_NAVIGATION_ITEMS.HOME ? styles.active_navigation_bar_item : ''}`}>
                <Link href="/admin">Home</Link>
            </div>
            <div className={`${styles.navigation_bar_item} ${active === ADMIN_NAVIGATION_ITEMS.PLAYERS ? styles.active_navigation_bar_item : ''}`}>
                <Link href="/admin/players">Players</Link>
            </div>
            <div className={`${styles.navigation_bar_item} ${active === ADMIN_NAVIGATION_ITEMS.SCHEDULES ? styles.active_navigation_bar_item : ''}`}>
                <Link href="/admin/schedules">Schedules</Link>
            </div>
            <div className={`${styles.navigation_bar_item} ${active === ADMIN_NAVIGATION_ITEMS.TEAMS ? styles.active_navigation_bar_item : ''}`}>
                <Link href="/admin/teams">Teams</Link>
            </div>
        </div>
    )
}

export default AdminNavigationBar
