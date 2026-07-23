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
    return sighting
}
