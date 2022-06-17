import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // Po 10 sec, funkcja setTimeout jest rejected (rejected promise) i podaje error message. Następnie jeżeli jest to pierwszy rezultat w Promise.race spośród fetch(url) oraz timeout(10), to przerywa fetchowanie i rzuca błąd, który później jest ponownie rzucany w model.js
    const { data } = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // re-throwing error. Muszę zrobić re-throw, żeby promise było rejected. Gdy mam jedną async funkcję wewnątrz drugiej, to chcąc łapać errory w tej zewnętrznej, muszę zrobić re-throwa tego errora w wewnętrznym
  }
};
export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // informacja dla API, że dane przesyłam w formie JSON, dzięki czemu może z powodzeniem je zaakceptować
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const { data } = await res.json(); // API zwraca dane spowrotem, dlatego je awaituję. Jonas mówi, ze to ważne, żeby API zwracało po wysłaniu mu danych, własne dane

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
