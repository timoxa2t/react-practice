import React, { useMemo, useState } from 'react';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductList } from './components/ProductList';
import { UserFilter } from './components/UserFilter';
import { QueryFilter } from './components/QueryFilter';
import { CategoryFilter } from './components/CategoryFilter';

const defaultProducts = productsFromServer.map((product) => {
  const copy = { ...product };

  copy.category = categoriesFromServer.find(
    category => category.id === product.categoryId,
  );
  copy.user = usersFromServer.find(
    user => user.id === copy.category.ownerId,
  );

  return copy;
});

export const App = () => {
  const [products] = useState(defaultProducts);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [query, setQuery] = useState('');

  const handleResetAll = () => {
    setQuery('');
    setSelectedUserId(null);
    setSelectedCategories([]);
  };

  const filteredProducts = useMemo(
    () => products.filter(
      (product) => {
        const userIdFilter = selectedUserId === null
          || product.user.id === selectedUserId;
        const selectedCategoriesFilter = selectedCategories.length === 0
          || selectedCategories.includes(product.categoryId);

        const cleanQuery = query.trim().toLowerCase();
        const queryFilter = cleanQuery === ''
          || product.name.toLowerCase().includes(cleanQuery);

        return userIdFilter
          && selectedCategoriesFilter
          && queryFilter;
      },
    ),
    [products, selectedUserId, query, selectedCategories],
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <UserFilter
              users={usersFromServer}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
            />

            <QueryFilter query={query} setQuery={setQuery} />

            <CategoryFilter
              categories={categoriesFromServer}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : <ProductList products={filteredProducts} /> }

        </div>
      </div>
    </div>
  );
};
