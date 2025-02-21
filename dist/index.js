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
        var datainput, config1, response, accessToken, data_order, config2, response_order, link, error_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
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
                    response = _d.sent();
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
                    response_order = _d.sent();
                    if (((_c = response_order === null || response_order === void 0 ? void 0 : response_order.data) === null || _c === void 0 ? void 0 : _c.status) === 'CREATED') {
                        link = response_order.data.links.find(function (item) { return item.rel == "approve"; });
                        return [2 /*return*/, {
                                status: true,
                                transaction: response_order.data,
                                url: link.href
                            }];
                    }
                    else {
                        return [2 /*return*/, { status: false }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _d.sent();
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
        var authString, config1, accessResponse, accessToken, verifyResponse, paymentStatus, error_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    authString = Buffer.from("".concat(vars.CLIENT_ID, ":").concat(vars.CLIENT_SECRET)).toString('base64');
                    config1 = {
                        method: 'post',
                        url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': "Basic ".concat(authString)
                        },
                        data: 'grant_type=client_credentials'
                    };
                    return [4 /*yield*/, axios_1.default.request(config1)];
                case 1:
                    accessResponse = _d.sent();
                    accessToken = (_b = accessResponse === null || accessResponse === void 0 ? void 0 : accessResponse.data) === null || _b === void 0 ? void 0 : _b.access_token;
                    if (!accessToken) {
                        throw new Error("PayPal authentication failed. No access token received.");
                    }
                    return [4 /*yield*/, axios_1.default.get("https://api-m.sandbox.paypal.com/v2/checkout/orders/".concat(data.payment.transaction.id), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Prefer': 'return=representation',
                                'Authorization': "Bearer ".concat(accessToken)
                            }
                        })];
                case 2:
                    verifyResponse = _d.sent();
                    paymentStatus = (_c = verifyResponse === null || verifyResponse === void 0 ? void 0 : verifyResponse.data) === null || _c === void 0 ? void 0 : _c.status;
                    if (paymentStatus === 'COMPLETED') {
                        return [2 /*return*/, { status: true }]; // پرداخت موفق بوده
                    }
                    else {
                        return [2 /*return*/, { status: false, error: "Payment status is ".concat(paymentStatus) }]; // پرداخت ناموفق
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _d.sent();
                    console.error("PayPal Verification Error:");
                    return [2 /*return*/, { status: false, error: error_2 }];
                case 4: return [2 /*return*/];
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
                starter.response({ status: result === null || result === void 0 ? void 0 : result.status, data: result });
                return [2 /*return*/];
        }
    });
}); });
