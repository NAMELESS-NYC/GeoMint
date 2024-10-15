import express from "express";
import cors from "cors";

import { aptos, getAptosAccount } from "./configs/aptos.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002; // Your server will run on localhost:3002

app.use(express.json());
app.use(cors());

app.post("/api/verify-location", async (req, res) => {
  console.log(req.body);
  const { geo_address, lat, lat_is_neg, lng, lng_is_neg, user_address } =
    req.body;

  try {
    // Create the transaction payload
    const func = `${process.env.GEO_CONTRACT_ADDRESS}::on_chain_geo_v1::is_within_geo`;

    // Get the account from the config
    const aptosAccount = getAptosAccount();
    console.log(aptosAccount);

    console.log(geo_address);

    //Generate a random token_id
    const token_id = Math.floor(10000000 + Math.random() * 90000000).toString();

    const transaction = await aptos.transaction.build.simple({
      sender: aptosAccount.accountAddress,
      data: {
        function: func,
        typeArguments: [],
        functionArguments: [
          geo_address,
          lng,
          lng_is_neg,
          lat,
          lat_is_neg,
          token_id,
          user_address,
        ],
      },
    });

    // submit transaction
    const committedTransaction = await aptos.signAndSubmitTransaction({
      signer: aptosAccount,
      transaction: transaction,
    });
    console.log(committedTransaction);

    const waitForTransaction = await aptos.waitForTransaction({
      transactionHash: committedTransaction.hash,
    });

    if (waitForTransaction.success) {
      res.send({ status: "success", message: "Token Created Successfully" });
    }
  } catch (e) {
    console.log(e);
    res.send({ status: "error", message: `Error Creating Token: ${e}` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
