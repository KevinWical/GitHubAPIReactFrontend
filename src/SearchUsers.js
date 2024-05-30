import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const SearchUsers = () => {
  // state hooks
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/search/users', {
        params: { q: query, page, per_page: perPage },
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`
        }
      });

      setResults(response.data.items);
      setTotalPages(Math.ceil(response.data.total_count / perPage));
      setPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('An error occurred while fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers();
  };

  const handlePageChange = (newPage) => {
    searchUsers(newPage);
  };

  // helper for size of repo
  const formatSize = (sizeInKB) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(2)} KB`;
    } else if (sizeInKB < 1024 * 1024) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    } else if (sizeInKB < 1024 * 1024 * 1024) {
      return `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`;
    } else {
      return `${(sizeInKB / (1024 * 1024 * 1024)).toFixed(2)} TB`;
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
        />
        <select value={perPage} onChange={(e) => setPerPage(e.target.value)}>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="30">30 per page</option>
          <option value="50">50 per page</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="results">
          {results.map((user) => (
            <div className="user" key={user.id}>
              <img src={user.avatar_url} alt={`${user.login}'s avatar`} width="150" height="150"/>
              <div className="user-details">
                <h3>{user.login}</h3>
                <p>Public Repositories: {user.public_repos}</p>
                <p>Total Forks: {user.total_forks}</p>
                <p>Total Stars: {user.total_stars}</p>
                <p>Average Repository Size: {user.average_size ? formatSize(user.average_size) : 'N/A'}</p>
                <p>Top Languages:</p>
                <ul>
                  {user.top_languages.map(([language, count]) => (
                    <li key={language}>{language}: {count} projects</li>
                  ))}
                </ul>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  View Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="button-container">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchUsers;
