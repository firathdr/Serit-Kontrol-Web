import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./pages/home.tsx";
import Login from "./pages/login.tsx"
import Navbar from "./components/Navbar";
import Register from "./pages/register.tsx";
import Araclar from "./pages/araclar.tsx"
import ItirazList from "./pages/itiraz.tsx";
import Admin from "./pages/admin.tsx";
const App: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/araclar" element={<Araclar/>} />
                <Route path="/itirazlarim" element={<ItirazList />} />
                <Route path="/admin" element={<Admin />} />



            </Routes>
        </Router>
    );
};

export default App;