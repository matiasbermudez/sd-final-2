import { PelisCollection, Peli } from "./models";

class PelisControllerOptions {
  action: "get" | "add" | "tag" | "search";
  params: Peli;
}

type Options = {
  id?: number;
  search?: {
    title?: string;
    tag?: string;
  };
};

class PelisController {
  peliculas: PelisCollection;

  opciones: Options
  constructor() {
    this.peliculas = new PelisCollection();

  }

  async get(options?: Options): Promise<any> {
    //Si el objeto tiene la propiedad id, debe devolver la película con ese id.
    console.log(options)
    if (options.id && options.id != 0) {
      const respuesta: Peli = await this.peliculas.getById(options.id).then(resp => {
        return resp
      })
      return respuesta
    }else if('title' in options.search && !('tag' in options.search)){
      const respuestaTitle: Peli[] = await this.peliculas.search(options.search).then(resp => {
        options.search.title = ""
        return resp})
        let peliculasFiltradas: Peli[] = respuestaTitle.filter(peli => peli.title.includes(options.search.title));
        return peliculasFiltradas
    }
    //Si el objeto tiene la propiedad search y tiene la propiedad title o tag, debe buscar las pelis que tengan ese string en el títuloo tag .
    //Si recibe las dos debe filtrar por ambas.
    else if (options.search) {

      if (options.search.tag != "" && options.search.title != "") {
        const respuestaTitle: Peli[] = await this.peliculas.search(options.search).then(resp => {
          options.search.title = ""
          return resp
        })
        const respuestaTag: Peli[] = await this.peliculas.search(options.search).then(resp => {
          return resp
        })
        //PRIMERO TRAIGO EN RESPUESTATAG Y TITLE LAS PELICULAS QUE CUMPLAN CON LOS IDS Y TAGS, LUEGOS LAS FILTRO Y ELIMINO LOS DUPLICADOS
        const respuestaConcatenada = respuestaTitle.concat(respuestaTag)
        let peliculasFiltradas: Peli[] = respuestaConcatenada.filter(peli => peli.title.includes(options.search.title));
        peliculasFiltradas = peliculasFiltradas.filter(peli => peli.tags.includes(options.search.tag))
        const peliculasSinDuplicados: Peli[] = peliculasFiltradas.filter((peli, index, self) =>
          index === self.findIndex((t) => (
            t.id === peli.id
          )))
        return peliculasSinDuplicados

      }
      const respuesta: Peli | Peli[] = await this.peliculas.search(options.search).then(resp => {
        return resp
      })
      return respuesta
    }else if (options.search.tag){
      console.log("ENTRA?",options.search.tag)
      const respuestaTag: Peli[] = await this.peliculas.search(options.search).then(resp => {
        return resp})
        return respuestaTag
    }
    const respuesta: Peli[] = await this.peliculas.getAll()
    return respuesta
  }


  async add(peli: Peli) {
    const peliNew:Peli ={
      id: peli.id,
      title: peli.title,
      tags: peli.tags}
    try {
      await this.peliculas.add(peliNew)
    }
    catch (error) {
      console.error("El Error Fue ", error)
    }
  }
 
 
}
//ACA TERMINE PELISCONTROLLERS
export {
  PelisController,
  PelisControllerOptions
};
