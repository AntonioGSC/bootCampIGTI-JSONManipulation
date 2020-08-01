import { promises as fs, read, readdirSync } from 'fs';
import fsSync from 'fs';

start();

let globalStates = [];
let globalCities = [];
let stateCities = [];
let longestCityArray = [];
let shortestCityArray = [];

async function start() {
  await readAndWriteStates();
  await readAndWriteCities();
  await functionsFilter();
}

async function functionsFilter() {
  await howManyStates('SP').then((result) => {
    console.log(
      '\n\nExercicio 2: O número de cidades no Estado solicitado é de: ' +
        result
    );
  });
  await filterStatesByNumber();
  setTimeout(() => {
    namesCities();
  }, 100);
}

async function readAndWriteStates() {
  try {
    let dataStates = JSON.parse(
      await fs.readFile('./cidades-estados-brasil-json/Estados.json', 'utf-8')
    );

    globalStates = dataStates.map(({ ID, Sigla, Nome }) => {
      return {
        idEstado: ID,
        siglaEstado: Sigla,
        nomeEstado: Nome,
      };
    });

    await globalStates.forEach((state) => {
      let nameDocument = String(
        './results-states/' + state.siglaEstado + '.json'
      );
      fs.writeFile(nameDocument, '');
    });
  } catch (err) {
    console.log(err);
  }
}

async function readAndWriteCities() {
  try {
    let dataCities = JSON.parse(
      await fs.readFile('./cidades-estados-brasil-json/Cidades.json', 'utf-8')
    );

    globalCities = dataCities.map(({ ID, Nome, Estado }) => {
      return {
        idCidade: ID,
        nomeCidade: Nome,
        estadoCidade: Estado,
      };
    });

    await globalStates.forEach((state) => {
      let nameDocument = String(
        './results-states/' + state.siglaEstado + '.json'
      );
      globalCities.forEach((city) => {
        if (city.estadoCidade == state.idEstado) {
          stateCities.push(city);
        }
      });
      fs.appendFile(nameDocument, JSON.stringify(stateCities));
      stateCities = [];
    });
  } catch (err) {
    console.log(err);
  }
}

async function howManyStates(state) {
  try {
    let nameJson = './results-states/' + state + '.json';
    let cities = JSON.parse(await fs.readFile(nameJson, 'utf-8'));
    let numberCities = cities.length;
    return numberCities;
  } catch (err) {
    console.log(err);
    console.log(
      '\nEstado Não Encontrado, confira novamente a sigla de Estado passada'
    );
  }
}

async function filterStatesByNumber() {
  let promise = globalStates.map((state) => {
    return howManyStates(state.siglaEstado).then((result) => {
      return {
        nome: state.siglaEstado,
        quantCidades: result,
      };
    });
  });

  Promise.all(promise).then((result) => {
    result.sort((a, b) => {
      return b.quantCidades - a.quantCidades;
    });
    console.log('\nExercicio 3: Os Estados com mais cidades são:');
    console.log(result.slice(0, 5));
    console.log('\nExercicio 4: Os Estados com menos cidades são:');
    console.log(result.slice(22, 27));
  });
}

function namesCities() {
  let longestCitySolo = [];
  let shortestCitySolo = [];
  try {
    let dataFiles = readdirSync('./results-states/', 'utf-8');
    // console.log(dataFiles);
    dataFiles.forEach((file) => {
      let nameFile = './results-states/' + file;
      let dataForEach = JSON.parse(fsSync.readFileSync(nameFile, 'utf-8'));
      let longestCity = dataForEach.reduce((a, b) => {
        return a.nomeCidade.length > b.nomeCidade.length ? a : b;
      });
      let shortestCity = dataForEach.reduce((a, b) => {
        return a.nomeCidade.length > b.nomeCidade.length ? b : a;
      });
      longestCityArray = [
        ...longestCityArray,
        globalStates
          .filter(({ idEstado, siglaEstado, nomeEstado }) => {
            return idEstado == longestCity.estadoCidade
              ? siglaEstado + '-' + longestCity.nomeCidade
              : '';
          })
          .map(({ idEstado, siglaEstado, nomeEstado }) => {
            return siglaEstado + '-' + longestCity.nomeCidade;
          }),
      ];
      shortestCityArray = [
        ...shortestCityArray,
        globalStates
          .filter(({ idEstado, siglaEstado, nomeEstado }) => {
            return idEstado == shortestCity.estadoCidade;
          })
          .map(({ idEstado, siglaEstado, nomeEstado }) => {
            return siglaEstado + '-' + shortestCity.nomeCidade;
          }),
      ];
      longestCitySolo = [...longestCitySolo, longestCity];
      shortestCitySolo = [...shortestCitySolo, shortestCity];
    });
    let theLongestCity = longestCitySolo.reduce((a, b) => {
      return a.nomeCidade.length > b.nomeCidade.length ? a : b;
    });

    let theShortestCity = shortestCitySolo.reduce((a, b) => {
      return a.nomeCidade.length > b.nomeCidade.length ? b : a;
    });

    console.log('\nExercicio 5: Os maiores nomes de cidades de cada Estado:');
    console.log(longestCityArray);
    console.log('\nExercicio 6: Os menores nomes de cidades de cada Estado:');
    console.log(shortestCityArray);
    console.log('\nExercicio 7: A cidade com maior nome é: ');
    console.log(theLongestCity.nomeCidade);
    console.log('\nExercicio 8: A cidade com menor nome é: ');
    console.log(theShortestCity.nomeCidade);
  } catch (err) {
    console.log(err);
  }
}
