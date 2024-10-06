var cors = require('cors')
const express = require('express')
const app = express()
const https = require('https');
const port = 3000

// https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='1'&STEP_SIZE='3600'&START_TIME='2015-09-25 10:00'&STOP_TIME='2015-09-25 11:00'&QUANTITIES='6'&CENTER='geo@0'

app.use(cors());

const api_gateway = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text";
function genereaza_query(comanda, data) {
    ora_start = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()} ${data.getHours()}:00`
    ora_end = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()} ${data.getHours() + 1}:00`
    return `${api_gateway}&COMMAND='${comanda}'&STEP_SIZE='3600'&START_TIME='${ora_start}'&STOP_TIME='${ora_end}'&QUANTITIES='6'&CENTER='geo@0'`;
}

function ia_intre(text, marker_start, marker_end) {
    const startIndex = text.indexOf(marker_start);
    const endIndex = text.indexOf(marker_end, startIndex + marker_start.length);
    return text.substring(startIndex + marker_start.length, endIndex);
}

function prelucreaza_raspuns(text)
{
    // preia raza
    const regex = /Vol\. [Mm]ean [Rr]adius \(km\) *= *([\d]+)(?=[.+-]|$)/;
    const match = text.match(regex);
    if (!match) {
        return [];
    }
    raza = match[1];

    // preia tabelul
    tabel = ia_intre(text, "$$SOE", "$$EOE");

    // imparte tabelul in pozitii
    tabel = tabel.split(" ");

    // sterge elementele nule
    tabel = tabel.filter((element) => element.length > 1)

    // sterge datele exacte (tot al 5-lea element)
    tabel = tabel.filter(function (data, index) { return (index % 5 !== 0); })

    // sterge orele exacte (tot al 4-lea element)
    tabel = tabel.filter(function (data, index) { return (index % 4 !== 0); })

    // genereaza json
    var json = [];
    json.push({ radius: raza });

    for (var i = 0; i < tabel.length; i += 3) {
        json.push({
            x: `${tabel[i]}`,
            y: `${tabel[i + 1]}`,
            inc: `${tabel[i + 2].slice(0, -1)}`
        });
    }

    return json;
}

app.get('/', async (req, res) => {
    let data_curenta = new Date();
    console.log(`${req.ip} conectat`);

    function descarca_json(i) {
        return new Promise((resolve, reject) => {
            const command = `${i}99`;
            const query = genereaza_query(command, data_curenta);
            
            https.get(query, (result) => {
                let data = [];
                const headerDate = result.headers && result.headers.date ? result.headers.date : 'no response date';
                console.log('Status Code:', result.statusCode);
                console.log('Date in Response header:', headerDate);

                result.on('data', chunk => { data.push(chunk); });
                result.on('end', () => {
                    console.log(`Facem request la ${query}`);
                    const text = Buffer.concat(data).toString();
                    const processedData = prelucreaza_raspuns(text);
                    resolve(processedData);
                });
            }).on('error', err => {
                console.log(`Avem o eroare taică: ${err}`);
                reject(err);
            });
        });
    }

    try {
        const json_final = [];

        // descarca jsonurile pentru fiecare planeta si pune-le intr-unul centralizat
        for (let i = 1; i <= 8; i++) {
            const data = await descarca_json(i);
            json_final.push(data);
        }

        // intoarce rezultatul
        res.send(json_final);
    } catch (err) {
        console.log(`Avem o eroare taică: ${err}`);
        res.send(`Avem o eroare taică: ${err}`);
    }
});

app.listen(port, () => {
    console.log(`Example gfd listening on port ${port}`)
})