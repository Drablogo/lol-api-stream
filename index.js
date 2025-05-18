const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = process.env.API_KEY;
const SUMMONER_NAME = process.env.SUMMONER_NAME;
const REGION = process.env.REGION;

app.get('/', (req, res) => {
  res.send('API do elo do LoL funcionando! Use /elo para ver seu ranking.');
});

app.get('/elo', async (req, res) => {
  try {
    const summoner = await axios.get(`https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(SUMMONER_NAME)}?api_key=${API_KEY}`);
    const id = summoner.data.id;

    const ranked = await axios.get(`https://${REGION}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`);
    const solo = ranked.data.find(q => q.queueType === 'RANKED_SOLO_5x5');

    if (solo) {
      const texto = `${SUMMONER_NAME} está em ${solo.tier} ${solo.rank} com ${solo.leaguePoints} PDL.`;
      res.send(texto);
    } else {
      res.send(`${SUMMONER_NAME} ainda não tem ranque solo.`);
    }

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send({ error: error.response?.data || error.message || "Erro desconhecido" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
