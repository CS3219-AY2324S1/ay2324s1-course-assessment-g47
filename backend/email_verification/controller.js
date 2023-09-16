const { sendOTP} = require("./../otp/controller");
const User = require("./../postgresql");

const sendVerificationOTPEmail = async (email) => {
    try {
        const existingUser = await UserActivation.findOne({ email });
        if (!existingUser) {
            throw Error("There's no account for the provided email.");
        }
        const otpDetails = {
            email,
            subject: "Email Verification",
            message: "Verify your email with the code below.",
            duration: 1,
        };
        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;
    } catch (error) {
        throw error;;
    }
};

module.exports = { sendVerificationOTPEmail };