import React from 'react';
import { Link } from '@inertiajs/react';

const Pagination = ({ links }) => {
  return (
    <nav className="mb-sm-0 d-flex justify-content-center" aria-label="navigation">
      <ul className="pagination pagination-md pagination-primary-soft mb-0">
        {/* Loop through the pagination links */}
        {links.map((link, index) => (
          <li
            key={index}
            className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
          >
            <Link
              href={link.url || '#'}
              className="page-link"
              tabIndex={!link.url ? '-1' : '0'}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
