import React, { useMemo, useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductList } from './components/ProductList/ProductList';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleResetAll = () => {
    setQuery('');
    setSelectedUserId(null);
    setSelectedCategoryId(null);
  };

  const filteredProducts = useMemo(
    () => products.filter(
      product => (selectedUserId === null
        || product.user.id === selectedUserId)
      && (selectedCategoryId === null
        || product.user.id === selectedCategoryId)
      && (query.trim() === ''
        || product.name.toLowerCase().includes(query.trim().toLowerCase())),
    ),
    [products, selectedUserId, query],
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({ 'is-active': selectedUserId === null })}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(({ name, id }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({ 'is-active': selectedUserId === id })}
                  onClick={() => setSelectedUserId(id)}
                >
                  {name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handleQueryChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query !== '' && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategoryId(null)}
              >
                All
              </a>
              {/* {categoriesFromServer.map(({ id, name }) => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  Category 1
                </a>
              ))} */}

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

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
