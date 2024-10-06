const cors = require('cors');
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());

const api_gateway = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text";
const cache_folder = './cache';

// Creaza folderul de cache
if (!fs.existsSync(cache_folder)) {
    fs.mkdirSync(cache_folder);
}

function genereaza_query(comanda, data) {
    const ora_start = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()} ${data.getHours()}:00`;
    const ora_end = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()} ${data.getHours() + 1}:00`;
    return `${api_gateway}&COMMAND='${comanda}'&STEP_SIZE='3600'&START_TIME='${ora_start}'&STOP_TIME='${ora_end}'&QUANTITIES='6'&CENTER='geo@0'`;
}

function ia_intre(text, marker_start, marker_end) {
    const startIndex = text.indexOf(marker_start);
    const endIndex = text.indexOf(marker_end, startIndex + marker_start.length);
    return text.substring(startIndex + marker_start.length, endIndex);
}

function prelucreaza_raspuns(text) {
    const regex = /Vol\. [Mm]ean [Rr]adius \(km\) *= *([\d]+)(?=[.+-]|$)/;
    const match = text.match(regex);
    if (!match) {
        return [];
    }
    const raza = match[1];

    let tabel = ia_intre(text, "$$SOE", "$$EOE");
    tabel = tabel.split(" ").filter((element) => element.length > 1);
    tabel = tabel.filter((data, index) => (index % 5 !== 0));
    tabel = tabel.filter((data, index) => (index % 4 !== 0));

    const json = [{ radius: raza }];
    for (let i = 0; i < tabel.length; i += 3) {
        json.push({
            x: `${tabel[i]}`,
            y: `${tabel[i + 1]}`,
            inc: `${tabel[i + 2].slice(0, -1)}`
        });
    }
    return json;
}

function fa_nume_cache(command) {
    return path.join(cache_folder, `${command}.json`);
}

function este_cache_valid(filePath) {
    if (!fs.existsSync(filePath)) return false;

    const stats = fs.statSync(filePath);
    const timp_cache = new Date(stats.mtime);
    const timp_curent = new Date();

    return timp_cache.getHours() === timp_curent.getHours();
}

function scrie_cache(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
}

function incarca_cache(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/', async (req, res) => {
    let data_curenta = new Date();
    console.log(`${req.ip} conectat`);

    async function descarca_json(i) {
        const command = `${i}99`;
        const cacheFilePath = fa_nume_cache(command);

        // verifica cacheul
        if (este_cache_valid(cacheFilePath)) {
            console.log(`Cache: ${command} ${data_curenta}`);
            return incarca_cache(cacheFilePath);
        }

        return new Promise((resolve, reject) => {
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

                    scrie_cache(cacheFilePath, processedData);
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

        for (let i = 1; i <= 8; i++) {
            const data = await descarca_json(i);
            json_final.push(data);

            await delay(1500);
        }

        res.send(json_final);
    } catch (err) {
        console.log(`Avem o eroare taică: ${err}`);
        res.send(`Avem o eroare taică: ${err}`);
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
