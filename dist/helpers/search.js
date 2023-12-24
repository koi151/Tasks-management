"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHelper = void 0;
const searchHelper = (query) => {
    let searchObj = {
        keyword: '',
    };
    if (query.keyword) {
        searchObj.keyword = query.keyword;
        const regex = new RegExp(searchObj.keyword, 'i');
        searchObj.regex = regex;
    }
    return searchObj;
};
exports.searchHelper = searchHelper;
