import styles from '@/styles/Admin.module.css'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'


function getCardTItem(item) {
    if (item === ADMIN_NAVIGATION_ITEMS.PLAYERS) {
        return "Players";
    }
    else if (item === ADMIN_NAVIGATION_ITEMS.TEAMS) {
        return "Teams";
    }
    else if (item === ADMIN_NAVIGATION_ITEMS.SCHEDULES) {
        return "Schedules";
    }
}



const AdminPageCard = ({ item, updationTime }) => {
    return (
        <div className={styles.admin_page_card}>

            <h2>{getCardTItem(item)} </h2>
            <p>{getCardTItem(item) + " data was "} {updationTime ? ("last updated " + updationTime) : "not added to database."}</p>

        </div>
    )
}

export default AdminPageCard
