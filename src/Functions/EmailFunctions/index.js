// import { AWS_CREDENTIALS } from "../../config/aws";
import * as AWS from "aws-sdk";
import nodemailer from "nodemailer";
import { render } from "ejs";
import { readFile } from "fs";

require("dotenv/config");

const AWS_CREDENTIALS = {
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY
};

const sendDonationConfirmation = donation => {
  AWS.config.update(AWS_CREDENTIALS);
  AWS.config.update({ region: "us-east-1" });

  const transporter = nodemailer.createTransport({
    SES: new AWS.SES()
  });

  console.log(donation);
  readFile(
    __dirname + "/templates/donationConfirmation.ejs",
    undefined,
    (err, ejsTpl) => {
      const htmlBody = render(ejsTpl.toString(), {
        name: donation.name,
        donateAmount: donation.donateAmount,
        donationNumber: donation.donationNumber
      });
      transporter.sendMail(
        {
          from: "prabirvora@gmail.com",
          to: "prabirvora@gmail.com",
          subject: "Thank you for donating to Plantlanta",
          html: htmlBody
        },
        (err, info) => {
          console.log(err);
          console.log(info);
        }
      );
    }
  );
};

const sendOrderConfirmationEmails = order => {
  AWS.config.update(AWS_CREDENTIALS);
  AWS.config.update({ region: "us-east-1" });

  const transporter = nodemailer.createTransport({
    SES: new AWS.SES()
  });

  const {
    orderNumber,
    buyer_name,
    items,
    purchased_at,
    price_cents,
    shipping_cents,
    total_price_cents
  } = order;

  const itemsPrice = price_cents / 100;
  const shippingPrice = shipping_cents / 100;
  const totalPrice = total_price_cents / 100;

  let itemsString = items.reduce((output, shopItem) => {
    console.log(shopItem);
    const { quantity, item } = shopItem;
    const { name } = item;
    console.log(name);
    let newString = output + `Item: ${name}, Qty: ${quantity} `;

    return newString;
  }, "");
  // Send Confirmation Email to buyer

  readFile(
    __dirname + "/templates/orderConfirmation.ejs",
    undefined,
    (err, ejsTpl) => {
      const htmlBody = render(ejsTpl.toString(), {
        orderNumber,
        buyer_name,
        itemsString,
        purchased_at,
        itemsPrice,
        shippingPrice,
        totalPrice
      });
      transporter.sendMail(
        {
          from: "prabirvora@gmail.com",
          to: "prabirvora@gmail.com",
          subject: `Congrats! Your order for Plantlanta Merch has been confirmed`,
          html: htmlBody
        },
        (err, info) => {
          console.log(err);
          console.log(info);
        }
      );
    }
  );
};

export { sendDonationConfirmation, sendOrderConfirmationEmails };
