const express = require('express')
const app = express()
const https = require('https');
const port = 3000

// https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='1'&STEP_SIZE='3600'&START_TIME='2015-09-25 10:00'&STOP_TIME='2015-09-25 11:00'&QUANTITIES='6'&CENTER='geo@0'

const api_gateway = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text";
function genereaza_query(comanda, data)
{
    ora_start = `${data.getFullYear()}-${data.getMonth()+1}-${data.getDate()} ${data.getHours()}:${data.getMinutes()}`
    ora_end = `${data.getFullYear()}-${data.getMonth()+1}-${data.getDate()} ${data.getHours()+1}:${data.getMinutes()}`
    return `${api_gateway}&COMMAND='${comanda}'&STEP_SIZE='3600'&START_TIME='${ora_start}'&STOP_TIME='${ora_end}'&QUANTITIES='6'&CENTER='geo@0'`;
}

app.get('/', (req, res) => {
    query = genereaza_query(1, new Date())

    https.get(query, result => {
        let data = [];
        const headerDate = result.headers && result.headers.date ? result.headers.date : 'no response date';
        console.log('Status Code:', result.statusCode);
        console.log('Date in Response header:', headerDate);
      
        result.on('data', chunk => {data.push(chunk);});
      
        result.on('end', () =>
        {
            console.log(`Facem request la ${query}`)

            // ia raspunsul raw
            text = Buffer.concat(data).toString();

            // preia tabelul
            marker_start = "$$SOE";
            marker_end = "$$EOE";
            const startIndex = text.indexOf(marker_start);
            const endIndex = text.indexOf(marker_end, startIndex + marker_start.length);
            tabel = text.substring(startIndex + marker_start.length, endIndex);

            // imparte tabelul in pozitii
            tabel = tabel.split(" ");

            // sterge elementele nule
            tabel = tabel.filter((element) => element.length > 1)

            // sterge datele exacte (tot al 5-lea element)
            tabel = tabel.filter(function(data, index){ return (index%5 !== 0); })
            
            // sterge orele exacte (tot al 4-lea element)
            tabel = tabel.filter(function(data, index){ return (index%4 !== 0); })

            res.send(tabel)
        });
      }).on('error', err => {
        res.send("eroare")
      });
})

app.listen(port, () => {
  console.log(`Example gfd listening on port ${port}`)
})