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
                <Route path="/" element={<Home />} />
                <Route path="/read" element={<Read />} />
                <Route path="/sightings/:uuid" element={<SightingDetail />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/alerts" element={<Alerts />} />
            </Routes>
            <Footer />
        </>
    )
}
