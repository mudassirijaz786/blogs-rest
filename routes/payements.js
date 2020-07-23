// :TODO:
/**THE REST OF THE WORK TO BE DONE JUST IT IS A TEMPLATE ..... */
//
//
const stripe_key = require("config").get("stripe_key");
const stripe = require("stripe")(stripe_key);
const cors = require("cors");
const uuid = require("uuid/v4");
const router = require("express").Router();

router.post("/postCharge", async (req, res) => {
  let error;

  let status;
  let charge;
  try {
    const { product, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotency_key = uuid();
    charge = await stripe.charges.create(
      {
        amount: parseInt(req.body.total) * 100,
        currency: "pkr",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        idempotency_key,
      }
    );
    // console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status, charge });
});

module.exports = router;

// const router = require("express").Router();

// // Token is created using Stripe Checkout or Elements!
// // Get the payment token ID submitted by the form:

// router.post("/", async (request, response) => {
//   const token = request.body.stripeToken; // Using Express

//   const charge = await stripe.charges.create({
//     amount: 999,
//     currency: "usd",
//     description: "Example charge",
//     source: token,
//   });
// });
