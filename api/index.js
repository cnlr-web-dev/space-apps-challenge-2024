var cors = require('cors')
const express = require('express')
const app = express()
const https = require('https');
const port = 3000

// https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='1'&STEP_SIZE='3600'&START_TIME='2015-09-25 10:00'&STOP_TIME='2015-09-25 11:00'&QUANTITIES='6'&CENTER='geo@0'

app.use(cors());

const api_gateway = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text";
function genereaza_query(comanda, data)
{
    ora_start = `${data.getFullYear()}-${data.getMonth()+1}-${data.getDate()} ${data.getHours()}:${data.getMinutes()}`
    ora_end = `${data.getFullYear()}-${data.getMonth()+1}-${data.getDate()} ${data.getHours()+1}:${data.getMinutes()}`
    return `${api_gateway}&COMMAND='${comanda}'&STEP_SIZE='3600'&START_TIME='${ora_start}'&STOP_TIME='${ora_end}'&QUANTITIES='6'&CENTER='geo@0'`;
}

function ia_intre(text, marker_start, marker_end)
{
    const startIndex = text.indexOf(marker_start);
    const endIndex = text.indexOf(marker_end, startIndex + marker_start.length);
    return text.substring(startIndex + marker_start.length, endIndex);
}

app.get('/*', (req, res) => {
    command = req.originalUrl.substring(1, 100000);
    query = genereaza_query(command, new Date())

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

            // preia raza
            const regex = /Vol. [Mm]ean [Rr]adius \(km\) *= *([\d\+-]+)/;
            const match = text.match(regex);
            if(match)
            {
                raza = match[0];
                raza = raza.replace(/\s/g, "").replace("+", "").replace("-", ""); // sterge +- si spatiul liber
                raza = raza.replace(/.([^.]*)$/, '$1'); // sterge ultimul punct (uneori e fantoma la +-<toleranta>)
                raza = raza.substring(18, 100000);
            }
            else
            {
                raza = 1000;
            }
            // preia tabelul
            tabel = ia_intre(text, "$$SOE", "$$EOE");

            // imparte tabelul in pozitii
            tabel = tabel.split(" ");

            // sterge elementele nule
            tabel = tabel.filter((element) => element.length > 1)

            // sterge datele exacte (tot al 5-lea element)
            tabel = tabel.filter(function(data, index){ return (index%5 !== 0); })
            
            // sterge orele exacte (tot al 4-lea element)
            tabel = tabel.filter(function(data, index){ return (index%4 !== 0); })

            // genereaza json
            var json = [];
            json.push({radius: raza});
            
            for(var i = 0; i < tabel.length; i += 3)
            {
                json.push({
                    x: `${tabel[i]}`,
                    y: `${tabel[i + 1]}`,
                    inc: `${tabel[i + 2].slice(0, -1)}`
                });
            }
            res.send(json)
        });
      }).on('error', err => {
        res.send("eroare")
      });
})

app.listen(port, () => {
  console.log(`Example gfd listening on port ${port}`)
})