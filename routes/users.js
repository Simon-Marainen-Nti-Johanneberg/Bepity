const fetch = require('node-fetch');
var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
const api_key = "RGAPI-92dfe0d3-e996-43e3-a868-73d5f9d71ecf";

router.get('/', async function (req, res) {
    const name = req.query.search;
    const json = (await GetByUsername(name))
    const json1 = (await MatchHistory(json.puuid))
    const json2 = (await leauge(json.id))
    const iconLink = `http://ddragon.leagueoflegends.com/cdn/12.4.1/img/profileicon/${json.profileIconId}.png`
    const matchdata = []
    const participantID = []
    for (let i=0; i<8 ; i++){
        matchdata.push(await MatchInfo(json1[i]))
    }
    for (let j=0;j<8;j++){
        for (let i=0; i<=10 ; i++){
            if (matchdata[j].metadata.participants[i] == json.puuid){
                participantID.push(i)
            }
        }
    }

    console.log(json1)
    res.render("user", { id: json.id ,level: json.summonerLevel, icon_link: iconLink, name:json.name, matchdata: matchdata, participantID: participantID, tier:json2[0].tier ,rank:json2[0].rank })    
    
})


async function GetByUsername(username){
    let res = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${api_key}`);
    if (res.status == 200){
        return await res.json();
    }else{
        console.log(res.status)
    }
}

async function MatchHistory(puuid){
    let res = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=8&api_key=${api_key}`);
    return await res.json()
}

async function MatchInfo(matchid){
    let res = await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchid}?api_key=${api_key}`)
    return await res.json()
}

async function leauge(id){
    let res = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${api_key}`);
    return await res.json()
}
module.exports = router