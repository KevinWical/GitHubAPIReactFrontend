import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const SearchRepositories = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('stars');
  const [order, setOrder] = useState('desc');
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const searchRepositories = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/search/repositories', {
        params: { q: query, page, per_page: perPage, sort, order },
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
    searchRepositories();
  };

  const handlePageChange = (newPage) => {
    searchRepositories(newPage);
  };

  return (
    <div className="App">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories..."
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
          <option value="updated">Updated</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
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
          {results.map((repo) => (
            <div className="repo" key={repo.id}>
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <p>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count} | Last updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                View Repository
              </a>
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

export default SearchRepositories;
