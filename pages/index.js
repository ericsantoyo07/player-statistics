import { getAllPlayers, getAllStats, getAllTeams } from '@/database/client';
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'


export default function Home() {

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(-1);

  const [isLoading, setIsLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const [isFiltering, setIsFiltering] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

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

  function getTeamImageSource(src) {
    if (src && src !== '') {
      return src;
    }
    return 'https://assets-fantasy.llt-services.com/teams/no-team.png';
  }

  function getTeamsOptions(teams) {
    // add a default option of 'All Teams'
    const options = [{ teamID: -1, name: 'All Teams' }];
    for (const team of teams) {
      options.push(team);
    }
    return options;
  }


  function getTeamByID(teamID) {
    if (!teams || teams.length === 0) {
      return null;
    }

    return teams.find(team => team.teamID === teamID);
  }

  function getTranslatedPosition(position) {
    switch (position) {
      case 'Portero':
        return 'GK';
      case 'Defensa':
        return 'Def';
      case 'Centrocampista':
        return 'Mid';
      case 'Delantero':
        return 'Str';
      default:
        return position;
    }
  }

  function getProperStatus(status) {
    switch (status) {
      case 'injure':
        return 'Injured';
      case 'out_of_league':
        return 'Out of League';
      case 'doubt':
        return 'Doubt';
      case 'ok':
        return 'Available';
      default:
        return status;
    }
  }

  function getFilteredPlayers() {
    let filtered = [...players];
    console.log('selectedTeam', selectedTeam);
    console.log('unfiltered', filtered);
    if (parseInt(selectedTeam) !== -1) {
      filtered = filtered.filter((player) => player.playerData.teamID === parseInt(selectedTeam));
      console.log('filtered by teams', filtered);
    }
    if (playerName && playerName !== '') {
      filtered = filtered.filter((player) => player.playerData.name.toLowerCase().includes(playerName.toLowerCase()));
    }


    return filtered;
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

      {
        isFiltering &&
        <div className={styles.filter_overlay}>
          <div className={styles.filter_overlay_top}>
            <button onClick={() => { setIsFiltering(false) }}>X</button>
          </div>
          <div className={styles.filter_overlay_main}>
          </div>
        </div>
      }

      {
        isSorting &&
        <div className={styles.sort_overlay}>
          <div className={styles.sort_overlay_top}>
            <button onClick={() => { setIsSorting(false) }}>X</button>
          </div>
          <div className={styles.sort_overlay_main}>
          </div>
        </div>
      }

      {
        isLoading &&
        <div className={styles.loading_overlay}>
          <img src='/loading.gif' />
        </div>
      }


      <div className={styles.background} />

      <div className={styles.control_bar}>
        {
          !isLoading &&
          <input type='text' placeholder='Player Name' onChange={(e) => { setPlayerName(e.target.value) }} />
        }
        {
          /* create a teams dropdown if teams are loaded */
          teams.length > 0 && (
            <select onChange={(e) => { console.log(e.target.value); setSelectedTeam(e.target.value) }}>
              {
                getTeamsOptions(teams).map((team) => {
                  return (
                    <option value={team.teamID} key={team.teamID}>{team.name}</option>
                  )
                })
              }
            </select>
          )
        }
      </div>
      <div className={styles.grid}>
        {

          getFilteredPlayers().map((player) => {
            return (
              <div className={styles.card} key={player.playerData.playerID}>
                <div className={styles.top_row}>
                  <img className={styles.player_image} src={getImageSource(player.playerData.image)} />
                  <p className={styles.name}>{player.playerData.name} </p>
                  <p className={styles.position}>{getTranslatedPosition(player.playerData.position)}</p>
                  <p className={styles.points}>{player.playerData.points}</p>
                </div>


                <div className={styles.market_value_row}>
                  <p>Market Value</p>
                  <p className={styles.market_value}>€{player.playerData.marketValue}</p>
                </div>


                <div className={styles.player_status_row}>
                  {
                    getTeamByID(player.playerData.teamID) ?
                      <img className={styles.player_team_image} src={getTeamImageSource(getTeamByID(player.playerData.teamID)?.image)} />
                      :
                      <div></div>
                  }
                  <p className={styles.status}> {getProperStatus(player.playerData.status)}</p>

                </div>

              </div>

            )
          })
        }
      </div>
      {
        !isLoading &&
        <div className={styles.overlay_bar}>
          <button onClick={() => { setIsFiltering(true) }}>Filter</button>
          <button onClick={() => { setIsSorting(true) }}>Sort</button>
        </div>
      }
    </div>
  )
}
