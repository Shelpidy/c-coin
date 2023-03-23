import type { EmailParameter } from "./Utils.d";

export function generateAccountNumber(id: string | any) {
    let numOfDigit: number = String(id).length;
    if (numOfDigit === 2) {
        return numOfDigit.toString() + "COM" + (id * 100000000).toString();
    } else if (numOfDigit === 3) {
        return numOfDigit.toString() + "COM" + (id * 10000000).toString();
    } else if (numOfDigit === 4) {
        return numOfDigit.toString() + "COM" + (id * 1000000).toString();
    } else if (numOfDigit === 5) {
        return numOfDigit.toString() + "COM" + (id * 100000).toString();
    } else if (numOfDigit === 6) {
        return numOfDigit.toString() + "COM" + (id * 10000).toString();
    } else if (numOfDigit === 7) {
        return numOfDigit.toString() + "COM" + (id * 1000).toString();
    } else if (numOfDigit === 8) {
        return numOfDigit.toString() + "COM" + (id * 100).toString();
    } else if (numOfDigit === 9) {
        return numOfDigit.toString() + "COM" + (id * 10).toString();
    } else if (numOfDigit === 10) {
        return numOfDigit.toString() + "COM" + id.toString();
    } else {
        return numOfDigit.toString() + "COM" + (id * 1000000000).toString();
    }
}

export function getIdFromAccountNumber(accountNumber: any | string) {
    let c = accountNumber.split("COM")[1];
    let numOfDigit: number = parseInt(accountNumber.split("COM")[0]);
    if (numOfDigit === 2) {
        return c / 100000000;
    } else if (numOfDigit === 3) {
        return c / 10000000;
    } else if (numOfDigit === 4) {
        return c / 1000000;
    } else if (numOfDigit === 5) {
        return c / 100000;
    } else if (numOfDigit === 6) {
        return c / 10000;
    } else if (numOfDigit === 7) {
        return c / 1000;
    } else if (numOfDigit === 8) {
        return c / 100;
    } else if (numOfDigit === 9) {
        return c / 10;
    } else if (numOfDigit === 10) {
        return c;
    } else {
        return c / 1000000000;
    }
    // return parseInt(c);
}

export function generateEmailHTML({
    displayRandomCode,
    body,
    heading,
    title,
}: EmailParameter) {
    let randCode = Math.floor(Math.random() * (99999 - 10000) + 100000);
    if (displayRandomCode) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Bungee+Inline" rel="stylesheet">
       
            <title>MEXU|MAIL</title>
        </head>
        <body style="padding: 4px;font-family: serif">
            <div>
                <h2 style="text-align: center;color:#000;opacity:0.7">Email Confirmation</h2>
                <div style="background-color:#000;height: 300px;padding: 8px;">
                    <h3 style="color:white;text-align: center;">MEXU | commodity</h3>
                    <p style='text-align:center; font-family:serif;color:white;letter-spacing:2px;' >
                        Thank you for accessing Mexu Commodity.To confirm that you are owner of this email,use to confirmation code below to continue validating your account.
                    </p>
                    <h1 style="color:white;text-align:center;letter-spacing:4px;">${randCode}</h1>     
                </div>
            </div>    
        </body>
        </html>`;
    } else {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Bungee+Inline" rel="stylesheet">
       
            <title>MEXU|MAIL</title>
        </head>
        <body style="padding: 4px;font-family: serif">
            <div>
                <h2 style="text-align: center;color:#000;opacity:0.7">${title}</h2>
                <div style="background-color:#000;height: 300px;padding: 8px;">
                    <h3 style="color:white;text-align: center;">${heading}</h3>
                    <p style='text-align:center; font-family:serif;color:white;letter-spacing:2px;' >
                       ${body}
                    </p>     
                </div>
            </div>    
        </body>
        </html>`;
    }
}

export function getPhoneNumberCompany(phoneNumber: string) {
    let code = phoneNumber.slice(0, 6);
    console.log(code);
    let companiesCode: Record<string, string[]> = {
        africell: [
            "+23277",
            "+23233",
            "+23230",
            "+23288",
            "+23299",
            "+23270",
            "+23280",
            "+23290",
        ],
        orange: [
            "+23271",
            "+23272",
            "+23273",
            "+23274",
            "+23275",
            "+23276",
            "+23278",
            "+23279",
        ],
        qcell: ["+23231", "+23232", "+23234"],
    };
    for (let key of Object.keys(companiesCode)) {
        let codes = companiesCode[key];
        if (codes.includes(code)) {
            return key;
        }
    }
    return "qcell";
}

export const responseStatusCode = {
    UNATHORIZED: 401,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNPROCESSIBLE_ENTITY: 422,
};

export const responseStatus = {
    SUCCESS: "success",
    ERROR: "error",
    UNATHORIZED: "unathorized",
    WARNING: "warning",
    UNPROCESSED: "unprocessed",
};
