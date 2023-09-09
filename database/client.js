const { supabase } = require("./supabase");

async function getAllPlayers() {
    const { data, error } = await supabase
        .from('players')
        .select('*')
    return { data, error };
}

async function getAllStats() {
    const { data, error } = await supabase
        .from('stats')
        .select('*')
    return { data, error };
}

async function getAllTeams() {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
    return { data, error };
}

async function getPlayerById(id) {
    let { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('playerID', id)

    let { data: playerStat } = await supabase
        .from('stats')
        .select('*')
        .eq('playerID', id)


    let player = null;
    let stats = [];
    if(playerData && playerData.length > 0) {
        player = playerData[0];
    }

    if(playerStat && playerStat.length > 0) {
        stats = playerStat;
    }
    return {
        player,
        stats
    };
}

async function getTeamByTeamID(teamID) {
    if(!teamID) return { data: null, error: "No teamID provided"}
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('teamID', teamID)

    return { data, error };
}

export { getAllPlayers, getAllStats, getAllTeams, getPlayerById, getTeamByTeamID };
