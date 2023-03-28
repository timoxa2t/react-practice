import classNames from 'classnames';
import React, { useState } from 'react';

const columns = [
  {
    id: 'id',
    title: 'ID',
  },
  {
    id: 'product',
    title: 'Product',
  },
  {
    id: 'category',
    title: 'Category',
  },
  {
    id: 'user',
    title: 'User',
  },

];

const SORT_ASC = 'asc';
const SORT_DESC = 'desc';

export const ProductList = ({ products }) => {
  const [sortType, setSortType] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedProducts = sortType === ''
    ? [...products]
    : [...products].sort((a, b) => {
      let dif = 0;

      switch (sortType) {
        case 'id':
          dif = a.id - b.id;
          break;
        case 'product':
          dif = a.name.localeCompare(b.name);
          break;
        case 'category':
          dif = a.category.title.localeCompare(b.category.title);
          break;
        case 'user':
          dif = a.user.name.localeCompare(b.user.name);
          break;
        default:
          dif = 0;
      }

      return sortOrder === SORT_ASC ? dif : -dif;
    });

  const handleSelectSort = (id) => {
    if (sortType !== id) {
      setSortType(id);
      setSortOrder(SORT_ASC);
    } else if (sortOrder === SORT_ASC) {
      setSortOrder(SORT_DESC);
    } else {
      setSortType('');
    }
  };

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          {columns.map(({ id, title }) => (
            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                {title}

                <a
                  href="#/"
                  onClick={() => handleSelectSort(id)}
                >
                  <span className="icon">
                    <i
                      data-cy="SortIcon"
                      className={classNames(
                        'fas',
                        {
                          'fa-sort': id !== sortType,
                          'fa-sort-down': id === sortType
                            && sortOrder === SORT_DESC,
                          'fa-sort-up': id === sortType
                            && sortOrder === SORT_ASC,
                        },
                      )}
                    />
                  </span>
                </a>
              </span>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {sortedProducts.map(({
          id,
          name,
          category,
          user,
        }) => (
          <tr data-cy="Product" key={id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {id}
            </td>

            <td data-cy="ProductName">{name}</td>
            <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

            <td
              data-cy="ProductUser"
              className={
                user.sex === 'f'
                  ? 'has-text-danger'
                  : 'has-text-link'
              }
            >
              {user.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
