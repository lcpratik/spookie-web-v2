import { Routes, Route } from "react-router-dom"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Home from "./pages/Home.jsx"
import Read from "./pages/Read.jsx"
import SightingDetail from "./pages/SightingDetail.jsx"
import MapPage from "./pages/MapPage.jsx"
import Upload from "./pages/Upload.jsx"
import Alerts from "./pages/Alerts.jsx"

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Homeee />} />
                <Route path="/read" element={<Readdd />} />
                <Route path="/sightings/:uuid" element={<SightingDetailll />} />
                <Route path="/map" element={<MapPageee />} />
                <Route path="/upload" element={<Uploaddd />} />
                <Route path="/alerts" element={<Alertsss />} />
            </Routes>
            <Footer />
        </>
    )
}
