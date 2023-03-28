import classNames from 'classnames';
import React from 'react';

export const UserFilter = ({ users, selectedUserId, setSelectedUserId }) => (
  <p className="panel-tabs has-text-weight-bold">
    <a
      data-cy="FilterAllUsers"
      href="#/"
      className={classNames({ 'is-active': selectedUserId === null })}
      onClick={() => setSelectedUserId(null)}
    >
      All
    </a>

    {users.map(({ name, id }) => (
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
);
