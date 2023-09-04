const { supabase } = require("./supabase");

async function addPlayers(players) {

    const { error } = await supabase
        .from('players')
        .upsert([...players])
}

async function addStats(stats) {
    const { error } = await supabase
        .from('stats')
        .upsert([...stats])
}

export { addPlayers, addStats }
