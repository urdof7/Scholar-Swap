// SearchResults.js
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const minPrice = queryParams.get('minPrice');
  const maxPrice = queryParams.get('maxPrice');

  return (
    <div>
      <h2>Search Results</h2>
      <p>Searching for: {query}</p>
      <p>Price Range: ${minPrice} - ${maxPrice}</p>
      {/* Here you can fetch and display results based on the query and price range */}
    </div>
  );
}
