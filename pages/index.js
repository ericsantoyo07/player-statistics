import { getAllPlayers, getAllStats } from '@/database/client';
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'


export default function Home() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function formatPlayersWithStats(players, stats) {
    const formattedPlayers = [];

    for (const player of players) {
      const playerStats = stats.filter((stat) => stat.playerID === player.playerID);
      formattedPlayers.push({ playerData: player, stats: playerStats });
    }

    return formattedPlayers;
  }

  function getTotalPoints(stats)
  {
    let total = 0;
    for (let i = 0; i < stats.length; i++){
      total += stats[i].totalPoints;
    }
    return total;
  }
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data: fetchedPlayers} = await getAllPlayers();
      const { data: fetchedStats } = await getAllStats();
      if (fetchedPlayers && fetchedStats) {
        const formatted = formatPlayersWithStats(fetchedPlayers, fetchedStats);
        setPlayers(formatted);
        console.log(formatted[128]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [])

  
  return (
    <div className={styles.Home}>
      <div className={styles.background} />
      <div className={styles.control_bar}>
        <input type='text' placeholder='Player Name'></input>
        <input type='text' placeholder='Drop Drown'></input>
      </div>
      <div className={styles.grid}>
        {
          players.map((player, index) => {
            return (
              <div className={styles.card} key={player.playerData.playerID}>
                <div className={styles.top_row}>
                  <img className={styles.player_image} src={player.playerData.image} />
                  <p>{player.playerData.name} </p>
                  <p>{player.playerData.position}</p>
                  <p>{getTotalPoints(player.stats)}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className={styles.overlay_bar}>
        <button>Filter</button>
        <button>Sort</button>
      </div>
    </div>
  )
}
