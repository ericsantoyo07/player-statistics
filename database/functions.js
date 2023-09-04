const { supabase } = require("./supabase");

async function addPlayers(players) {

    const { error } = await supabase
        .from('players')
        .insert([...players])
}

export {addPlayers}