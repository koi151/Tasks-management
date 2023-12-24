interface PaginationObject {
  currentPage: number,
  limitItems: number, 
  skip?: number,
  totalPage?: number
}

export const paginationHelper = (
  paginationObj: PaginationObject, 
  query, 
  recordCount: number 
): PaginationObject => {

  if (query.page) {
    paginationObj.currentPage = parseInt(query.page);
  }

  if (query.limit) {
    paginationObj.limitItems = parseInt(query.limit);
  }

  paginationObj.totalPage = Math.ceil(recordCount / paginationObj.limitItems);
  paginationObj.skip = (paginationObj.currentPage - 1) * paginationObj.limitItems;

  return paginationObj;
}