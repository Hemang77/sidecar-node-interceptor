// external imports
// const moment = require('moment');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const axios = require('axios');
const uuid = require('uuid')


//internal imports
const constant = require('../../config/constant');

let product = () => { };

// add API 
product.add = async (req, res) => {
    try {
        const params = req.body;
        const urc = uuid.v4();
        console.log(`${constant.baseUrl}product/add`);
        console.log('http://localhost:6000/v1/product/add');
        await axios.post(`${constant.baseUrl}product/add`, {
            params,
            headers: {
                'URC': urc
            }
        });
        res.status(201).send({
            status: constant.statusCodes.SUCCESS,
            error: false,
            data: {}
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: constant.statusCodes.FAIL,
            message: error.message,
            error: true,
            data: {}
        });
    };
};

// get API 
product.get = async (req, res) => {
    try {
        const urc = uuid.v4();
        // console.log(req.headers);
        const resp = await axios.get(`${constant.baseUrl}product/get/${req.params.sku}`, {
            headers: {
                'URC': urc
            }
        });
        // console.log(resp);
        res.status(201).send({
            status: constant.statusCodes.SUCCESS,
            error: false,
            data: resp.data.data
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: constant.statusCodes.FAIL,
            message: error.message,
            error: true,
            data: {}
        });
    };
};

module.exports = product;