// plugin.ts

import axios from 'axios';
import qs from 'qs';
import process from 'process';
import webito, { delivertypesCalculate_input, paymentsCreate_input, paymentsVerify_input } from 'webito-plugin-sdk'

const starter = new webito.WebitoPlugin('starter');

starter.registerHook(
    webito.hooks.paymentsCreate,
    async ({ vars, data }: { vars: { CLIENT_ID: string, CLIENT_SECRET: string }, data: paymentsCreate_input }) => {
        let datainput = qs.stringify({
            'grant_type': 'client_credentials',
            'ignoreCache': 'true',
            'return_authn_schemes': 'true',
            'return_client_metadata': 'true',
            'return_unconsented_scopes': 'true'
        });
        let config1 = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(vars.CLIENT_ID + ":" + vars.CLIENT_SECRET).toString('base64')}`,
            },
            data: datainput
        };

        axios.request(config1).then((response) => {
            let data_order = JSON.stringify({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": data.gateway.currency.code,
                            "value": data.amount
                        }
                    }
                ]
            });
            let config2 = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
                headers: {
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation',
                    // 'PayPal-Request-Id': '8dd650e5-272f-42f2-8fd3-372dc13bdccc', 
                    'Authorization': response?.data?.access_token
                },
                data: data_order
            };

            axios.request(config2).then((response_order) => {
                if (response?.data?.status == 'CREATED') {
                    return {
                        status: true,
                        transaction: response_order?.data,
                        url: response_order?.data?.links[1]?.href
                    }
                } else {
                    return {
                        status: false,
                    }
                }
            })
        })
    });

starter.registerHook(
    webito.hooks.paymentsVerify,
    async ({ vars, data }: { vars: { CLIENT_ID: string, CLIENT_SECRET: string }, data: paymentsVerify_input }) => {
        let datainput = qs.stringify({
            'grant_type': 'client_credentials',
            'ignoreCache': 'true',
            'return_authn_schemes': 'true',
            'return_client_metadata': 'true',
            'return_unconsented_scopes': 'true'
        });
        let config1 = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(vars.CLIENT_ID + ":" + vars.CLIENT_SECRET).toString('base64')}`
            },
            data: datainput
        };
        const access_axios = (await axios.request(config1))?.data

        axios.get(('https://api-m.sandbox.paypal.com/v2/checkout/orders/' + data.payment.transaction.id), {
            headers: {
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
                // 'PayPal-Request-Id': '8dd650e5-272f-42f2-8fd3-372dc13bdccc', 
                'Authorization': access_axios?.access_token
            }
        })
            .then((response: any) => {
                if (response.data.status == 'COMPLETED') {
                    return {
                        status: true,
                    }
                } else {
                    return {
                        status: true,
                    }
                }
            })
            .catch((error: any) => {
                return {
                    status: true,
                }
            });
    });

const runPlugin = async (inputData: { hook: string; data: any }) => {
    const result = await starter.executeHook(inputData.hook, inputData.data);
    return result;
};


process.stdin.on('data', async (input) => {
    const msg = JSON.parse(input.toString());
    const result: any = await runPlugin(msg);
    starter.response({ status: result?.status, data: result?.data })
});