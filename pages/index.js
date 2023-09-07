import { getAllPlayers, getAllStats, getAllTeams } from '@/database/client';
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'


export default function Home() {

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(-1);

  const [isLoading, setIsLoading] = useState(false);

  function formatPlayersWithStats(players, stats) {
    const formattedPlayers = [];

    for (const player of players) {
      const playerStats = stats.filter((stat) => stat.playerID === player.playerID);
      formattedPlayers.push({ playerData: player, stats: playerStats });
    }

    return formattedPlayers;
  }

  function getImageSource(src) {
    if (src && src !== '') {
      return src;
    }
    return 'https://assets-fantasy.llt-services.com/players/no-player.png';
  }

  function getTeamsOptions(teams) {
    // add a default option of 'All Teams'
    const options = [{ teamID: -1, name: 'All Teams' }];
    for (const team of teams) {
      options.push(team);
    }
    return options;
  }


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data: fetchedPlayers } = await getAllPlayers();
      const { data: fetchedStats } = await getAllStats();
      const { data: fetchedTeams } = await getAllTeams();
      if (fetchedPlayers && fetchedStats) {
        const formatted = formatPlayersWithStats(fetchedPlayers, fetchedStats);
        setPlayers(formatted);
        console.log(formatted[128]);
      }
      if (fetchedTeams) {
        setTeams(fetchedTeams);
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
        {
          /* create a teams dropdown if teams are loaded */
          teams.length > 0 && (
            <select onChange={(e) => { console.log(e.target.value); setSelectedTeam(e.target.value) }}>
              {
                getTeamsOptions(teams).map((team) => {
                  return (
                    <option value={team.teamID}>{team.name}</option>
                  )
                })
              }
            </select>
          )
        }
      </div>
      <div className={styles.grid}>
        {
          players.map((player, index) => {
            return (
              <div className={styles.card} key={player.playerData.playerID}>
                <div className={styles.top_row}>
                  <img className={styles.player_image} src={getImageSource(player.playerData.image)} />
                  <p>{player.playerData.name} </p>
                  <p>{player.playerData.position}</p>
                  <p>{player.playerData.points}</p>
                </div>

                <div className={styles.market_value_row}>
                  <p>{player.playerData.marketValue}</p>
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
