"use strict";
// plugin.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var qs_1 = __importDefault(require("qs"));
var process_1 = __importDefault(require("process"));
var webito_plugin_sdk_1 = __importDefault(require("webito-plugin-sdk"));
var starter = new webito_plugin_sdk_1.default.WebitoPlugin('starter');
starter.registerHook(webito_plugin_sdk_1.default.hooks.paymentsCreate, function (_a) {
    var vars = _a.vars, data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        var datainput, config1, response, accessToken, data_order, config2, response_order, error_1;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 3, , 4]);
                    datainput = qs_1.default.stringify({
                        'grant_type': 'client_credentials'
                    });
                    config1 = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': "Basic ".concat(Buffer.from(vars.CLIENT_ID + ":" + vars.CLIENT_SECRET).toString('base64'))
                        },
                        data: datainput
                    };
                    return [4 /*yield*/, axios_1.default.request(config1)];
                case 1:
                    response = _g.sent();
                    accessToken = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.access_token;
                    if (!accessToken) {
                        throw new Error("PayPal authentication failed. No access token received.");
                    }
                    data_order = {
                        "intent": "CAPTURE",
                        "purchase_units": [
                            {
                                "amount": {
                                    "currency_code": data.gateway.currency.code,
                                    "value": data.amount
                                }
                            }
                        ]
                    };
                    config2 = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
                        headers: {
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation',
                            'Authorization': "Bearer ".concat(accessToken)
                        },
                        data: JSON.stringify(data_order)
                    };
                    return [4 /*yield*/, axios_1.default.request(config2)];
                case 2:
                    response_order = _g.sent();
                    if (((_c = response_order === null || response_order === void 0 ? void 0 : response_order.data) === null || _c === void 0 ? void 0 : _c.status) === 'CREATED') {
                        return [2 /*return*/, {
                                status: true,
                                transaction: response_order === null || response_order === void 0 ? void 0 : response_order.data,
                                url: (_f = (_e = (_d = response_order === null || response_order === void 0 ? void 0 : response_order.data) === null || _d === void 0 ? void 0 : _d.links) === null || _e === void 0 ? void 0 : _e.find(function (link) { return link.rel === "approve"; })) === null || _f === void 0 ? void 0 : _f.href
                            }];
                    }
                    else {
                        return [2 /*return*/, { status: false }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _g.sent();
                    console.log(error_1);
                    return [2 /*return*/, { status: false, error: error_1 }];
                case 4: return [2 /*return*/];
            }
        });
    });
});
starter.registerHook(webito_plugin_sdk_1.default.hooks.paymentsVerify, function (_a) {
    var vars = _a.vars, data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        var datainput, config1, access_axios;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    datainput = qs_1.default.stringify({
                        'grant_type': 'client_credentials',
                        'ignoreCache': 'true',
                        'return_authn_schemes': 'true',
                        'return_client_metadata': 'true',
                        'return_unconsented_scopes': 'true'
                    });
                    config1 = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': "Basic ".concat(Buffer.from(vars.CLIENT_ID + ":" + vars.CLIENT_SECRET).toString('base64'))
                        },
                        data: datainput
                    };
                    return [4 /*yield*/, axios_1.default.request(config1)];
                case 1:
                    access_axios = (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.data;
                    axios_1.default.get(('https://api-m.sandbox.paypal.com/v2/checkout/orders/' + data.payment.transaction.id), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation',
                            // 'PayPal-Request-Id': '8dd650e5-272f-42f2-8fd3-372dc13bdccc', 
                            'Authorization': access_axios === null || access_axios === void 0 ? void 0 : access_axios.access_token
                        }
                    })
                        .then(function (response) {
                        if (response.data.status == 'COMPLETED') {
                            return {
                                status: true,
                            };
                        }
                        else {
                            return {
                                status: true,
                            };
                        }
                    })
                        .catch(function (error) {
                        return {
                            status: true,
                        };
                    });
                    return [2 /*return*/];
            }
        });
    });
});
var runPlugin = function (inputData) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, starter.executeHook(inputData.hook, inputData.data)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
process_1.default.stdin.on('data', function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msg = JSON.parse(input.toString());
                return [4 /*yield*/, runPlugin(msg)];
            case 1:
                result = _a.sent();
                starter.response({ status: result === null || result === void 0 ? void 0 : result.status, data: result === null || result === void 0 ? void 0 : result.data });
                return [2 /*return*/];
        }
    });
}); });
