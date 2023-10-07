const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Código executado na thread principal
  const numTrabalhadores = 3;
  const distanciaCorrida = 100;

  console.log('Iniciando a corrida!');

  const trabalhadores = [];

  for (let i = 0; i < numTrabalhadores; i++) {
    const trabalhador = new Worker(__filename, {
      workerData: { id: i + 1, distanciaCorrida },
    });
    trabalhadores.push(trabalhador);
  }

  let idVencedor = null;

  for (const trabalhador of trabalhadores) {
    trabalhador.on('message', (mensagem) => {
      if (mensagem.vencedor) {
        idVencedor = mensagem.vencedor;
        trabalhadores.forEach((t) => t.terminate());
      }
    });
  }

  process.on('exit', () => {
    console.log(`A Thread ${idVencedor} venceu a corrida!`);
  });
} else {
  
  const { id, distanciaCorrida } = workerData;

  function correrCorrida() {
    let distanciaPercorrida = 0;
    while (distanciaPercorrida < distanciaCorrida) {
      distanciaPercorrida += Math.random() * 10;
    }

    parentPort.postMessage({ vencedor: id });
  }

  correrCorrida();
}
