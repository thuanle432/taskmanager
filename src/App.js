import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PageHome from './pages/pageHome';
import PageProject from './pages/pageProject';
import PageUser from './pages/pageUser';
import PageStatusTask from './pages/pageStatusTask';

function App() {
    return (
        <Router >
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/pagehome" element={<PageHome />} />
                <Route path="/pageuser" element={<PageUser/>} />
                <Route path="/pageprojects" element={<PageProject/>} />
                <Route path="/project/:ProjectID" element={<PageStatusTask/>} />
            </Routes>
        </Router>
    );
}

export default App;
