"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.editPatch = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const tasks_model_1 = __importDefault(require("../model/tasks.model"));
const pagination_1 = require("../../../helpers/pagination");
const search_1 = require("../../../helpers/search");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false
        };
        if (req.query.status) {
            find.status = req.query.status.toString();
        }
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toString();
            sort[sortKey] = req.query.sortValue;
        }
        const searchObj = (0, search_1.searchHelper)(req.query);
        if (searchObj.regex) {
            find.title = searchObj.regex;
        }
        let initPagination = {
            currentPage: 1,
            limitItems: 2
        };
        const taskCount = yield tasks_model_1.default.countDocuments(find);
        const paginationObj = (0, pagination_1.paginationHelper)(initPagination, req.query, taskCount);
        const tasks = yield tasks_model_1.default.find(find)
            .sort(sort)
            .limit(paginationObj.limitItems)
            .skip(paginationObj.skip);
        res.json({
            code: 200,
            message: "Get tasks successful",
            tasks: tasks
        });
    }
    catch (error) {
        console.log('Error occured:', error);
        res.json({
            code: 400,
            massage: "Not existed"
        });
    }
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield tasks_model_1.default.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    }
    catch (error) {
        console.log('Error occured:', error);
        res.json({
            code: 400,
            massage: "Not existed"
        });
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield tasks_model_1.default.updateOne({ _id: id }, {
            status: req.body.status
        });
        res.json({
            code: 200,
            message: 'Update status successful!'
        });
    }
    catch (error) {
        console.log('Error occured:', error);
        res.json({
            code: 400,
            massage: "Not existed"
        });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Key;
        (function (Key) {
            Key["STATUS"] = "status";
            Key["DELETE"] = "delete";
        })(Key || (Key = {}));
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case Key.STATUS:
                yield tasks_model_1.default.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: 'Update multiple status successful!'
                });
                break;
            case Key.DELETE:
                yield tasks_model_1.default.updateMany({
                    _id: { $in: ids }
                }, {
                    deleted: true,
                    deletedAt: Date()
                });
                res.json({
                    code: 200,
                    message: 'Multiple tasks deleted successfully!'
                });
                break;
            default:
                res.json({
                    code: 400,
                    massage: "Not existed"
                });
                break;
        }
    }
    catch (error) {
        console.log('Error occured:', error);
        res.json({
            code: 400,
            massage: "Not existed"
        });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.createdBy = req.user.id;
        const task = new tasks_model_1.default(req.body);
        yield task.save();
        res.json({
            code: 200,
            message: 'Create task successful!'
        });
    }
    catch (error) {
        console.log('Error occured:', error);
        res.json({
            code: 400,
            massage: "Error occurred while creating task"
        });
    }
});
exports.create = create;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield tasks_model_1.default.updateOne({ _id: id }, req.body);
        res.json({
            code: 200,
            massage: "Update task successfull!"
        });
    }
    catch (error) {
        console.log('Error occured:', error);
        res.json({
            code: 400,
            massage: "Not existed"
        });
    }
});
exports.editPatch = editPatch;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield tasks_model_1.default.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: Date()
        });
        res.json({
            code: 200,
            message: 'Task deleted successful!'
        });
    }
    catch (error) {
        console.log('Error occured:', error);
        res.json({
            code: 400,
            massage: "Error occurred while creating task"
        });
    }
});
exports.deleteTask = deleteTask;
