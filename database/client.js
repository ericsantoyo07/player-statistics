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

export { getAllPlayers, getAllStats, getAllTeams };
