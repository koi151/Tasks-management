
module.exports = (query) => {
  const searchObj = {
    keyword: '',
    regex: ''
  }

  if (query.keyword) {
    searchObj.keyword = query.keyword;
    searchObj.regex = new RegExp(query.keyword, 'i');
  }

  return searchObj;
}