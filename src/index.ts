var minimist = require('minimist')
import { PelisController, PelisControllerOptions } from "./controllers";

function parseaParams(argv):PelisControllerOptions {
  console.log(argv)
  const resultado = minimist(argv);
  
  return {
    
    action : resultado._,
    params: {
      id: resultado.id ??  0,
      title:  resultado.title ,
      tags:  resultado.tags ?? resultado.tag ?? ""
    }
}

}
async function processOptions(opciones) {
  const pelis = new PelisController();
  if (opciones.action === "get") {
    return pelis.get({ id: opciones._[1] });
  }
  if (opciones.action === "search") {
    return pelis.get({ search: opciones });
  }
  if (opciones.action === "add") {
    return pelis.add({ id: opciones.id, title: opciones.title, tags: opciones.tags });
  }
  if (!opciones.action) {
    return await pelis.peliculas.getAll()
  }
}


function main() {
  const params = parseaParams(process.argv.slice(2));
  
  processOptions(params).then((res) => console.log(res));
  
}

main();
