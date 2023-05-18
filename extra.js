const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
function jwtEncode(data) {
    let key = process.env.APP_SECRET_KEY + "";
    console.log(key);
    let encodedData = jwt.sign({ data }, "33");
    return encodedData;
}

function jwtDecode(token) {
    let decodedData = jwt.decode(token);

    return decodedData;
}

async function hashData(data) {
    let salt = await bcrypt.genSalt(10);
    let encryptedData = await bcrypt.hash(data, salt);
    return encryptedData;
}

async function matchWithHashedData(data, hashedData) {
    let isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
}

// let r = jwtEncode("hey")
let r = jwtDecode(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoibWV4dUBnbWFpbC5jb20iLCJhY2NvdW50TnVtYmVyIjoiMUNPTTMwMDAwMDAwMDAiLCJkZXZpY2VJZCI6ImdnMmcyZ2prZHVpZWIyIiwiZm9sbG93aW5nSWRzIjpbeyJpZCI6MSwiZm9sbG93ZXJJZCI6MywiZm9sbG93aW5nSWQiOjQsImNyZWF0ZWRBdCI6IjIwMjMtMDQtMDlUMTY6MDY6NDkuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjMtMDQtMDlUMTY6MDY6NDkuMDAwWiJ9XSwiaWF0IjoxNjgzMjg1MTAzfQ.gRTMW5uSVQsWg2IcdKSw_wftYayLUXf9zdT0wgC_0zs"
);
console.log(r);
