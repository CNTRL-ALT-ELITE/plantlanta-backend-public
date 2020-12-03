import OrderModel from "../../../MongoDB/Order";

import shortId from "shortid";

import { sendOrderConfirmationEmails } from "../../../Functions/EmailFunctions";

const upsCarrierID = "60bc348995e747b98936256b2caa6364";

const PLANTLANTA_ADDRESS = {
  name: "Plantlanta",
  phone: "4704241168",
  street1: "848 Spring Street NW #1012C",
  city: "Atlanta",
  state: "GA",
  zip: "30308-1007",
  country: "US"
};

const PARCEL = {
  length: "14",
  width: "10",
  height: "7",
  distance_unit: "in",
  weight: "2",
  mass_unit: "lb"
};

const OrderStatus = {
  ORDER_PLACED: "ORDER_PLACED",
  SHIPPED_TO_USER: "SHIPPED_TO_USER",
  SHIPMENT_ISSUE: "SHIPMENT_ISSUE",
  UNDER_REVIEW: "UNDER_REVIEW",
  ITEM_SOLD: "ITEM_SOLD",
  REFUNDED: "REFUNDED",
  COMPLETE: "COMPLETE"
};

const createOrder = async (parent, args, ctx, info) => {
  const { order } = args;
  const { shippo } = ctx;

  const {
    address,
    name,
    email,
    cartAmount,
    shippingAmount,
    shippingRateID,
    paymentIntentID,
    cart
  } = order;

  console.log(args);

  const newOrder = await OrderModel.create({
    orderNumber: Date.now(),
    items: cart,
    address,
    status: OrderStatus.ORDER_PLACED,
    price_cents: cartAmount,
    shipping_cents: shippingAmount,
    total_price_cents: cartAmount + shippingAmount,
    purchased_at: new Date(),
    orderUpdatedAt: new Date(),
    paymentIntentID,
    shippingRateID,
    buyer_name: name,
    email
  });

  if (newOrder !== null && newOrder !== undefined) {
    const fetchedOrder = await OrderModel.findOne({
      _id: newOrder.id
    }).populate({
      path: "items",
      populate: {
        path: "item",
        model: "ShopItem"
      }
    });

    // Step 3: Create Shipping Labels
    const { shippingRateID } = fetchedOrder;

    // Buyer Shipment
    const buyerTransaction = await shippo.transaction.create({
      rate: shippingRateID,
      label_file_type: "PDF",
      async: false
    });

    console.log("Buyer Transaction");
    console.log(buyerTransaction);

    const shipment = {
      id: buyerTransaction.object_id,
      status: buyerTransaction.status,
      eta: new Date(buyerTransaction.eta),
      tracking_number: buyerTransaction.tracking_number,
      tracking_status: buyerTransaction.tracking_status,
      tracking_url_provider: buyerTransaction.tracking_url_provider,
      label_url: buyerTransaction.label_url,
      createdAt: new Date(buyerTransaction.object_created),
      updatedAt: new Date(buyerTransaction.object_updated)
    };

    const updatedOrderWithShipments = await OrderModel.updateOne(
      {
        _id: fetchedOrder.id
      },
      {
        shipment
      }
    );

    sendOrderConfirmationEmails(fetchedOrder);

    return "Order Successful";
  }

  return "Order Failed";
};

const createOrderPaymentIntent = async (parent, args, ctx, info) => {
  const { total } = args;
  const { user, stripe } = ctx;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
    payment_method_types: ["card"]
  });

  console.log("Payment Intent", paymentIntent);

  return paymentIntent.client_secret;
};

const validateShippingAddress = async (parent, args, ctx, info) => {
  const { address } = args;
  const { shippo } = ctx;

  const {
    name,
    phone,
    address1,
    address2,
    city_locality,
    state_province,
    postal_code
  } = address;

  const result = await shippo.address.create({
    name,
    phone,
    street1: address1,
    street2: address2,
    city: city_locality,
    state: state_province,
    zip: postal_code,
    country: "US",
    validate: true
  });

  if (!result || !result.validation_results) {
    return {
      address: null,
      shippingRateID: "",
      shipping_cents: 0,
      error: "Could not validate Address"
    };
  }

  const { validation_results } = result;

  console.log(validation_results);
  console.log(result);

  const { is_valid, messages } = validation_results;

  if (is_valid) {
    console.log("Result is valid");
    const cleanedUpAddress = {
      name,
      phone,
      address1: result.street1,
      address2: result.street2,
      city_locality: result.city,
      state_province: result.state,
      postal_code: result.zip
    };

    // Update Order shipment
    const addressTo = {
      name: cleanedUpAddress.name,
      phone: cleanedUpAddress.phone,
      street1: cleanedUpAddress.address1,
      street2: cleanedUpAddress.address2,
      city: cleanedUpAddress.city_locality,
      state: cleanedUpAddress.state_province,
      zip: cleanedUpAddress.postal_code,
      country: "US"
    };

    let shippingRateID = "";
    let shipping_cents = 0;

    const response = await createShipmentObject(
      shippo,
      addressTo,
      PLANTLANTA_ADDRESS
    );

    console.log("Created Shipment Object Result");
    console.log(response);

    shippingRateID = response.shippingRateID;
    shipping_cents = response.shipping_cents;

    console.log("Printing Shipping Result");
    console.log(shippingRateID);
    console.log(shipping_cents);

    return {
      address: cleanedUpAddress,
      shippingRateID,
      shipping_cents,
      error: ""
    };
  } else {
    return {
      address: null,
      shippingRateID: "",
      shipping_cents: 0,
      error: messages ? messages.text : "Could not validate Address"
    };
  }
};

const createShipmentObject = async (shippo, addressTo, addressFrom) => {
  let shippingRateID;
  let shipping_cents;

  console.log("Creating shipment object");
  // Domestic Shipping
  const shipment = await shippo.shipment.create({
    address_from: addressFrom,
    address_to: addressTo,
    parcels: [PARCEL],
    async: false,
    carrier_accounts: [upsCarrierID]
  });

  console.log(shipment);
  const { rates } = shipment;

  const filteredRate = rates.filter(rate => {
    return (
      rate.attributes.includes("BESTVALUE") ||
      rate.attributes.includes("CHEAPEST")
    );
  });

  const bestRate = filteredRate[0];

  shippingRateID = bestRate.object_id;
  shipping_cents = parseFloat(bestRate.amount) * 100;

  return { shippingRateID, shipping_cents };
};

const getOrders = async (shippo, addressTo, addressFrom) => {
  const orders = await OrderModel.find().populate({
    path: "items",
    populate: {
      path: "item",
      model: "ShopItem"
    }
  });

  console.log(orders);

  return orders;
};

export default {
  Mutation: {
    validateShippingAddress,
    createOrderPaymentIntent,
    createOrder
  },
  Query: {
    getOrders
  }
};
