import { getAllPlayers, getAllStats, getAllTeams } from '@/database/client';
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'


const SORT_BY = {
  DEFAULT: "default", // Optional, if you want to include a "default" option
  POINTS: "points",
  MARKET_VALUE: "marketValue",
  NAME: "name",
  POSITION: "position",
  TEAM_ID: "teamID",
  AVERAGE_POINTS: "averagePoints",
};

const POSITION_FILTER = {
  DEFAULT: "default", // Optional, if you want to include a "default" option
  GK: "Portero",
  DEF: "Defensa",
  MID: "Centrocampista",
  STR: "Delantero",
};


// 0m - 1m
// 1m - 5m
// 5m - 10m
// 10+

const PRICE_FILTER = {
  DEFAULT: "All", // Optional, if you want to include a "default" option
  ONE_MILLION: "0M - 1M",
  FIVE_MILLION: "1M - 5M",
  TEN_MILLION: "5M - 10M",
  TEN_PLUS_MILLION: "10M+",
};


const STATUS_FILTER = {
  DEFAULT: "default", // Optional, if you want to include a "default" option
  INJURED: "injure",
  OUT_OF_LEAGUE: "out_of_league",
  DOUBT: "doubt",
  AVAILABLE: "ok",
};


export default function Home() {

  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(-1);

  const [isLoading, setIsLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const [isFiltering, setIsFiltering] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  const [sortBy, setSortBy] = useState(SORT_BY.DEFAULT);
  const [positionFilter, setPositionFilter] = useState(POSITION_FILTER.DEFAULT);
  const [priceFilter, setPriceFilter] = useState(PRICE_FILTER.DEFAULT);
  const [statusFilter, setStatusFilter] = useState(STATUS_FILTER.DEFAULT);

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

  function getPositionFilterNames(position) {
    switch (position) {
      case 'Portero':
        return 'G';
      case 'Defensa':
        return 'D';
      case 'Centrocampista':
        return 'M';
      case 'Delantero':
        return 'S';
      case "default":
        return 'All';
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
      case 'default':
        return 'All';
      default:
        return status;
    }
  }

  function getProperSortBy(sortBy) {
    switch (sortBy) {
      case 'marketValue':
        return 'Market Value';
      case 'points':
        return 'Points';
      case 'name':
        return 'Name';
      case 'position':
        return 'Position';
      case 'teamID':
        return 'Team';
      case 'averagePoints':
        return 'Average Points';
      case 'default':
        return 'Default';
      default:
        return sortBy;
    }
  }


  function sortPlayers(players, propertyName) {
    const validProperties = [
      "default",
      "marketValue",
      "points",
      "name",
      "position",
      "teamID",
      "averagePoints"
    ];

    if (!validProperties.includes(propertyName)) {
      console.error("Invalid property name.");
      return players;
    }

    return players.sort((a, b) => {
      const valueA = a.playerData[propertyName];
      const valueB = b.playerData[propertyName];

      // Handle cases where values are null or undefined
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;

      if (propertyName === "default") {
        return 0; // No sorting needed for "default"
      } else if (propertyName === "name") {
        return a.playerData.name.localeCompare(b.playerData.name);
      }
      if (propertyName === "position") {
        return a.playerData.position.localeCompare(b.playerData.position);
      }
      else {
        return valueB - valueA;
      }
    });
  }



  function isValueinPriceFiltersRange(value, priceFilter) {
    switch (priceFilter) {
      case PRICE_FILTER.ONE_MILLION:
        return value <= 1000000;
      case PRICE_FILTER.FIVE_MILLION:
        return value > 1000000 && value <= 5000000;
      case PRICE_FILTER.TEN_MILLION:
        return value > 5000000 && value <= 10000000;
      case PRICE_FILTER.TEN_PLUS_MILLION:
        return value > 10000000;
      default:
        return true;
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

    if (positionFilter !== POSITION_FILTER.DEFAULT) {
      console.log('position Filter', positionFilter);
      filtered = filtered.filter((player) => player.playerData.position === positionFilter);
    }

    if (priceFilter !== PRICE_FILTER.DEFAULT) {
      console.log('price Filter', priceFilter);
      filtered = filtered.filter((player) => isValueinPriceFiltersRange(player.playerData.marketValue, priceFilter));
    }


    if (statusFilter !== STATUS_FILTER.DEFAULT) {
      console.log('status Filter', statusFilter);
      filtered = filtered.filter((player) => player.playerData.status === statusFilter);
    }

    console.log('sorted by', sortBy);
    filtered = sortPlayers(filtered, sortBy);
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
        <div className={styles.filter_overlay_main}>
          <button onClick={() => { setIsFiltering(false) }}>X</button>
          <p className={styles.filter_title}> Position</p>
          <div className={styles.position_filter}>
            {
              Object.keys(POSITION_FILTER).map((key) => {
                return (
                  <div
                    className={` ${positionFilter === POSITION_FILTER[key] ? styles.selected_position_filter_option : styles.position_filter_option} `}
                    key={key} onClick={() => { setPositionFilter(POSITION_FILTER[key]); }}>{getPositionFilterNames(POSITION_FILTER[key])}</div>
                )
              })
            }
          </div>

          <p className={styles.filter_title}> Price </p>
          <div className={styles.position_filter}>
            {
              Object.keys(PRICE_FILTER).map((key) => {
                return (
                  <div
                    className={` ${priceFilter === PRICE_FILTER[key] ? styles.selected_position_filter_option : styles.position_filter_option} `}
                    key={key} onClick={() => { setPriceFilter(PRICE_FILTER[key]); }}>{PRICE_FILTER[key]}</div>
                )
              })
            }
          </div>

          <p className={styles.filter_title}> Status</p>
          <div className={styles.position_filter}>
            {
              Object.keys(STATUS_FILTER).map((key) => {
                return (
                  <div
                    className={` ${statusFilter === STATUS_FILTER[key] ? styles.selected_position_filter_option : styles.position_filter_option} `}
                    key={key} onClick={() => { setStatusFilter(STATUS_FILTER[key]); }}>{getProperStatus(STATUS_FILTER[key])}</div>
                )
              })
            }
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
            {
              Object.keys(SORT_BY).map((key) => {
                return (
                  <div
                    className={` ${sortBy === SORT_BY[key] ? styles.selected_sort_option : styles.sort_option} `}
                    key={key} onClick={() => { setSortBy(SORT_BY[key]); setIsSorting(false) }}>{getProperSortBy(SORT_BY[key])}</div>
                )
              })
            }
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
          {
            (positionFilter !== POSITION_FILTER.DEFAULT || priceFilter !== PRICE_FILTER.DEFAULT) &&
            <button onClick={() => {
              setPositionFilter(POSITION_FILTER.DEFAULT)
              setPriceFilter(PRICE_FILTER.DEFAULT)
            }}>Clear Filters</button>
          }
          <button onClick={() => { setIsSorting(true) }}>Sort</button>
          {
            sortBy !== SORT_BY.DEFAULT &&
            <button onClick={() => { setSortBy(SORT_BY.DEFAULT) }}>Clear Sort</button>
          }

        </div>
      }
    </div>
  )
}
