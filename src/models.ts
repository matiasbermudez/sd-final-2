import * as jsonfile from "jsonfile";
import "./pelis.json"
//JOla
type SearchOptions = { title?: string; tag?: string };
class Peli {
  id: number
  title: string
  tags: string[]
}

class PelisCollection {
  data: Peli[] = []

  async getAll(): Promise<any> {
    const peliculas: Peli[] =  await jsonfile.readFile(__dirname + '/pelis.json').then((data) => {
      this.data = data
       return data })
    return peliculas
  }

  async getById(id: number): Promise<Peli> {
    const peliculas = await this.getAll()
    const pelis = peliculas.find(peli => peli.id === id)
    console.log("Peli",pelis)
    return pelis
  }
  async add(peli: Peli): Promise<boolean> {

    const lista = await this.getAll()
    const isRepeat = lista.some(peliDeLista => peliDeLista.id === peli.id)
    if(!isRepeat){
      lista.push(peli)
      await jsonfile.writeFile(__dirname + '/pelis.json', lista)
     
      return true
    } else {
      return false
    }
  }
  
  async search(options?: SearchOptions): Promise<Peli[]> {
    
    const lista = await this.getAll();

    if (options.tag && options.title) {
      return lista.filter((peli) => {
        return (
          peli.tags.includes(options.tag) &&
          peli.title.includes(options.title.toString())
        );
      })
    }else if(options.title){
      const titleFiltradas = lista.filter((listaTitle)=> listaTitle.title.includes(options.title.toString()))
      return titleFiltradas
    }else if (options.tag){
      const tagsFiltradas = lista.filter((listatags)=> listatags.tags.includes(options.tag))
      return tagsFiltradas
    }else{
      return lista
    }
  }
}
    
  


export { PelisCollection, Peli };
