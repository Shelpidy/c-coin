
function generateAccountNumber(code:string|any){
    let numOfDigit:number = String(code).length
    if(numOfDigit === 2){
        return numOfDigit.toString()+'COM'+(code*100000000).toString()
        
    }
    else if(numOfDigit === 3){
        return numOfDigit.toString()+'COM'+(code*10000000).toString() 
    }

    else if(numOfDigit === 4){
        return numOfDigit.toString()+'COM'+(code*1000000).toString() 
    }

    else if(numOfDigit === 5){
        return numOfDigit.toString()+'COM'+(code*100000).toString() 
    }
    else if(numOfDigit === 6){
        return numOfDigit.toString()+'COM'+(code*10000).toString() 
    }

    else if(numOfDigit === 7){
        return numOfDigit.toString()+'COM'+(code*1000).toString() 
    }
    else if(numOfDigit === 8){
        return numOfDigit.toString()+'COM'+(code*100).toString() 
    }

    else if(numOfDigit === 9){
        return numOfDigit.toString()+'COM'+(code*10).toString() 
    }
    else if(numOfDigit === 10){
        return numOfDigit.toString()+'COM'+(code).toString() 
    }

    else{
        return numOfDigit.toString()+'COM'+(code*1000000000).toString() 
    }
}

const getIdFromCode = (code:any|string)=>{
    let c = code.split('COM')[1];
    let numOfDigit:number = parseInt(code.split('COM')[0])
    if(numOfDigit === 2){
        return c/100000000
        
    }
    else if(numOfDigit === 3){
        return c/10000000}

    else if(numOfDigit === 4){
        return c/1000000
    }

    else if(numOfDigit === 5){
        return c/100000
    }
    else if(numOfDigit === 6){
        return c/10000
    }

    else if(numOfDigit === 7){
        return c/1000
    }
    else if(numOfDigit === 8){
        return c/100
    }

    else if(numOfDigit === 9){
        return c/10
    }
    else if(numOfDigit === 10){
        return c
    }

    else{
        return c/1000000000
    }
    // return parseInt(c);

}