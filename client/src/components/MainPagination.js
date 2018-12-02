import React from 'react';
import { Pagination } from 'semantic-ui-react';

const MainPagination = ({ activePage, totalPages, changePage }) => (
  <Pagination
    activePage={activePage}
    totalPages={totalPages}
    firstItem={null}
    lastItem={null}
    size="mini"
    onPageChange={changePage}
  />
);

export default MainPagination;
