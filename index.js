import { promises as fs, read } from 'fs';

start();

let globalStates = [];
let globalCities = [];
let stateCities = [];

async function start() {
  await readAndWriteStates();
  await readAndWriteCities();
  functionsFilter();
}

function functionsFilter() {
  howManyStates('SP');
  statesWithMoreCities();
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
    console.log(
      '\n\nExercicio 2: O número de cidades no Estado solicitado é de: ' +
        numberCities
    );
  } catch (err) {
    console.log(err);
    console.log(
      'Estado Não Encontrado, confira novamente a sigla de Estado passada'
    );
  }
}

async function statesWithMoreCities() {}
