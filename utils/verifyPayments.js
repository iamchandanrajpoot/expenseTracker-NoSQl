const razorpay = require("../config/razarpay");

async function verifyPaymentStatus(paymentId){
    try {
        const payment= await razorpay.payments.fetch(paymentId);
        if(payment.status == "captured"){
            return true
        }else{
            return false;
        }
    } catch (error) {
        console.error("Error verifying payment status:", error);
        return false; // Error occurred or payment not found
    }
}

module.exports = verifyPaymentStatus;