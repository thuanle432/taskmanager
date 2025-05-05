import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import PageHome from './pages/pageHome';
import PageProject from './pages/pageProject';
import PageUser from './pages/pageUser';
import PageStatusTask from './pages/pageStatusTask';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router >
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/pagehome" 
                element={
                    <PrivateRoute>
                        <PageHome />
                    </PrivateRoute>
                } />
                <Route path="/pageuser" 
                element={
                    <PrivateRoute>
                        <PageUser/>
                    </PrivateRoute>
                } />
                <Route path="/pageprojects" 
                element={
                    <PrivateRoute>
                        <PageProject/>
                    </PrivateRoute>
                } />
                <Route path="/project/:ProjectID" 
                element={
                    <PrivateRoute>
                        <PageStatusTask/>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
