import path from "node:path"
import fs from "node:fs/promises"

const dataFilePath = path.join(import.meta.dirname, "data.json")

export async function getSightings(){

    try{

        const data = await fs.readFile(dataFilePath, "utf8")
        const parsedData = JSON.parse(data)
        return parsedData

    }catch(err){
        console.error(err)

    }

}

export async function addSighting(sighting){
    const sightings = (await getSightings()) || []
    sightings.push(sighting)
    await fs.writeFile(dataFilePath, JSON.stringify(sightings, null, 2))
    //null means "include everything, no filtering", 2 means "indent nested content with 2 spaces", 
    // JSON.stringify actually accepts three arguments, not just one: the second argument is a replacer function or array of property names to include, the third is the space argument for indentation
    //[
    //. {
    //     "title": "Ghost",
    //.   "location": "Attic"
    //. }
    //]
    return sighting
}
