module.exports = (paginationObj, query, countRecords) => {
  if (query.page) {
    paginationObj.currentPage = parseInt(query.page);
  }

  if (query.limit) {
    paginationObj.limitItems = parseInt(query.limit);
  }

  paginationObj.totalPage = Math.ceil(paginationObj / paginationObj.limitItems);
  paginationObj.skip = (paginationObj.currentPage - 1) * paginationObj.limitItems;

  return paginationObj;
}