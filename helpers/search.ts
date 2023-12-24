interface SearchObj {
  keyword: string,
  regex?: RegExp
}

export const searchHelper = (query): SearchObj => {
  let searchObj: SearchObj = {
    keyword: '',
  }

  if (query.keyword) {
    searchObj.keyword = query.keyword;

    const regex = new RegExp(searchObj.keyword, 'i');
    searchObj.regex = regex;
  }

  return searchObj;
}