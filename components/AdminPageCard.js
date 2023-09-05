import { deleteAllMatches, deleteAllPlayers, deleteAllTeams } from '@/database/functions';
import styles from '@/styles/Admin.module.css'
import { ADMIN_NAVIGATION_ITEMS } from '@/utils/types'
import { useRouter } from 'next/router';


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



const AdminPageCard = ({ item, count }) => {
    const router = useRouter();

    const handleDeleteAll = async () => {
        if (item === ADMIN_NAVIGATION_ITEMS.PLAYERS) {
            await deleteAllPlayers();
            router.reload();
        }
        else if (item === ADMIN_NAVIGATION_ITEMS.TEAMS) {
            await deleteAllTeams();
            router.reload();
        }
        else if (item === ADMIN_NAVIGATION_ITEMS.SCHEDULES) {
            await deleteAllMatches();
            router.reload();
        }
    }

    return (
        <div className={styles.admin_page_card}>

            <h2>{getCardTItem(item)} </h2>
            {
                count === null &&
                <p>loading...</p>
            }
            {
                (count > 0) &&
                <p>{count} {getCardTItem(item)} are currently added to the database.</p>
            }
            {
                (count === 0) &&
                <p>data not available.</p>
            }
            {
                (count || count > 0) ?
                    <button className={styles.admin_page_card_delete_button}
                        onClick={handleDeleteAll}
                    >Delete All {getCardTItem(item)}</button>
                    :
                    <button className={styles.admin_page_card_delete_button_disabled}
                        onClick={handleDeleteAll}
                        disabled={true}
                    >Delete All {getCardTItem(item)}</button>
            }

        </div>
    )
}

export default AdminPageCard
