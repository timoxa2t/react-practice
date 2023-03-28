import classNames from 'classnames';
import React from 'react';

export const CategoryFilter = ({
  categories,
  selectedCategories,
  setSelectedCategories,
}) => {
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

  return (
    <div className="panel-block is-flex-wrap-wrap">
      <a
        href="#/"
        data-cy="AllCategories"
        className={classNames('button is-success mr-6',
          { 'is-outlined': selectedCategories.length !== 0 })
        }
        onClick={() => setSelectedCategories([])}
      >
        All
      </a>
      {categories.map(({ id, title }) => (
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
  );
};
