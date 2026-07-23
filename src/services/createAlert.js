const alerts = []

export function createAlert(sighting) {
    const alert = {
        location: sighting.location,
        message: `New sighting reported near ${sighting.location}`,
        createdAt: new Date().toISOString()
    }

    alerts.push(alert)
    console.log(`Alert sent to ghost hunters: ${alert.message}`)

    return alert
}
