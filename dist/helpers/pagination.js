"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
const paginationHelper = (paginationObj, query, recordCount) => {
    if (query.page) {
        paginationObj.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        paginationObj.limitItems = parseInt(query.limit);
    }
    paginationObj.totalPage = Math.ceil(recordCount / paginationObj.limitItems);
    paginationObj.skip = (paginationObj.currentPage - 1) * paginationObj.limitItems;
    return paginationObj;
};
exports.paginationHelper = paginationHelper;
