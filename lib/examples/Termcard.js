"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const index_1 = __importDefault(require("../index"));
const settings = require('./config.json');
const styles = require('./calendar.module.css');
class Termcard extends react_1.default.Component {
    render() {
        let sessionID = Math.random().toString(16).slice(2);
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                react_1.default.createElement(index_1.default, { sessionID: sessionID, settings: settings, styles: styles }))));
    }
}
exports.default = Termcard;
//# sourceMappingURL=Termcard.js.map