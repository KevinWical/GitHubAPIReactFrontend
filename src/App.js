import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

const SearchRepositories = lazy(() => import('./SearchRepositories'));
const SearchUsers = lazy(() => import('./SearchUsers'));

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>GitHub Search</h1>
          <nav aria-label="Main Navigation">
          <ul>
            <li><Link to="/repositories" aria-label="Search Repositories">Search Repositories</Link></li>
            <li><Link to="/users" aria-label="Search Users">Search Users</Link></li>
          </ul>
        </nav>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/repositories" element={<SearchRepositories />} />
            <Route path="/users" element={<SearchUsers />} />
            <Route path="/" element={<SearchRepositories />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
