const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
async function jwtEncode(data) {
    let key = process.env.APP_SECRET_KEY + "";
    console.log(key);
    let encodedData = jwt.sign({ data }, key);
    return encodedData;
}

async function jwtDecode(token) {
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

(async () => {
    let r = await matchWithHashedData(
        "med",
        "$2b$10$B6nRCbdxanv7Tw9bSu13j.gt0ONf..laVC7g7cfezmbIT/EVphPU6"
    );
    // let r = await jwtEncode("1")
    // let r = await jwtDecode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMSIsImlhdCI6MTY4MDIwOTQ5Mn0.kAz7PSk0VywPehiH840LTCQ63ZJ1Wuhql8ddVSgV1Wo")
    console.log(r);
})();
