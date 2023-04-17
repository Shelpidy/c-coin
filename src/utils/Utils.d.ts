export type EmailParameter = {
    displayRandomCode?: boolean;
    heading?: string;
    title?: string;
    body?: string;
};

export type BuyResponseBody = {
    productId:number,
    affiliatedId?:number,
    userId:number,
    amount:number,
}

export type MakePurchaseParams = {
     productId:number,
     affiliateId?:number,
     userId:number,
     buyerId:number
}

