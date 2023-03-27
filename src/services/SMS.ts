const { Vonage } = require('@vonage/server-sdk')

export default class SMS{
    vonage:any
    from:string
    public constructor(public to:string,public message:string){
      this.from = 'MexuSL Commodity'
      this.vonage = new Vonage({
        apiKey: process.env.SMS_API_KEY,
        apiSecret:process.env.SMS_SECRET_KEY
      })

    }

    /**
     * sendMessage
     */
    public async sendMessage(provider:"vonage"|"firebase"|"google") {
      if(provider ==='firebase'){
        console.log("Sending through firebase")
        return Promise.resolve("Resolved")
      }
      else if(provider === 'google'){
           console.log("Sending through google")
           return Promise.resolve("Resolved")
      }
      else if(provider === 'vonage'){
        try{
          let smsObj:{to:string,from?:string,text:string} = {
            to:this.to,
            from:this.from,
            text:this.message
          }
          let response = await this.vonage.sms.send(smsObj)
          if(response){
            return Promise.resolve(response)
          }
          else{
            return Promise.reject("Fail to send SMS")
          }
        }catch(err){
              return Promise.reject(err)
        }
      }
      else{
        try{
          let smsObj:{to:string,from?:string,text:string} = {
            to:this.to,
            from:this.from,
            text:this.message
          }
          let response = await this.vonage.sms.send(smsObj)
          if(response){
            console.log('message sent')
            return Promise.resolve(response)
          }
          else{
            return Promise.reject("Fail to send SMS")
          }

        }catch(err){
              return Promise.reject(err)
        }
      }
        
    }
}

// const from = "Vonage APIs"
// const to = "23279027241"
// const text = 'A text message sent using the Vonage SMS API'

// async function sendSMS() {
//    try{
//      let respose = await vonage.sms.send({to, from, text})
//      }catch(err){

//      }
//     }  

// sendSMS();