export async function parseJsonBody(req){

    let body = ""
    for await(const chunk of req){
        body += chunk
    }
    try {
        const bodyParses = JSON.parse(body)
        return bodyParses

    }catch(err){
        console.log(`Invalid JSON format ${err}`)
    }

}