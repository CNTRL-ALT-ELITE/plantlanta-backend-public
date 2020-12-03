import DonationModel from "../../../MongoDB/Donation";
import { sendDonationConfirmation } from "../../../Functions/EmailFunctions";

const createDonationPaymentIntent = async (parent, args, ctx, info) => {
  const { donateAmount } = args;
  const { user, stripe } = ctx;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: donateAmount * 100,
    currency: "usd",
    payment_method_types: ["card"]
  });

  console.log("Payment Intent", paymentIntent);

  return paymentIntent.client_secret;
};

const onDonationSuccess = async (parent, args, ctx, info) => {
  const { name, email, donateAmount, paymentIntentID } = args;

  const donationNumber = new Date().valueOf();

  const newDonation = await DonationModel.create({
    donationNumber,
    name,
    email,
    donateAmount,
    paymentIntentID
  });

  if (newDonation !== null && newDonation !== undefined) {
    sendDonationConfirmation(newDonation);
    return donationNumber;
  }
};

export default {
  Mutation: {
    createDonationPaymentIntent,
    onDonationSuccess
  },
  Query: {}
};
