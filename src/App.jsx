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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleResetAll = () => {
    setQuery('');
    setSelectedUserId(null);
    setSelectedCategories([]);
  };

  const handleCategoryToggle = (id) => {
    const index = selectedCategories.indexOf(id);

    if (index >= 0) {
      setSelectedCategories([
        ...selectedCategories.slice(0, index),
        ...selectedCategories.slice(index + 1, selectedCategories.length),
      ]);
    } else {
      setSelectedCategories([
        ...selectedCategories,
        id,
      ]);
    }
  };

  const filteredProducts = useMemo(
    () => products.filter(
      product => (selectedUserId === null
        || product.user.id === selectedUserId)
      && (selectedCategories.length === 0
        || selectedCategories.includes(product.categoryId))
      && (query.trim() === ''
        || product.name.toLowerCase().includes(query.trim().toLowerCase())),
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
                  key={id}
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
                className={classNames('button is-success mr-6',
                  { 'is-outlined': selectedCategories.length === 0 })
                }
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>
              {categoriesFromServer.map(({ id, title }) => (
                <a
                  key={id}
                  data-cy="Category"
                  className={classNames(
                    'button mr-2 my-1',
                    { 'is-info': selectedCategories.includes(id) },
                  )}
                  href="#/"
                  onClick={() => handleCategoryToggle(id)}
                >
                  {title}
                </a>
              ))}
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
