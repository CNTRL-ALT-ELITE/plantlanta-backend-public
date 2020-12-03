import { createServer } from "./Server";
import cors from "cors";
import bodyParser from "body-parser";
import connectBusboy from "connect-busboy";
import busboyBodyParser from "busboy-body-parser";
import { PostFunctions } from "./Functions";

require("dotenv/config");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const shippo = require("shippo")(process.env.SHIPPO_API_KEY);

const server = createServer(stripe, shippo);

server.express.use(bodyParser.urlencoded({ extended: true }));
server.express.use(bodyParser.json());
server.express.use(connectBusboy());
server.express.use(busboyBodyParser());
server.express.use(cors());

server.express.post("/uploadMedia", async (req, res) => {
  const { UploadMedia } = PostFunctions;
  UploadMedia({ req, res });
});

server.start(
  {
    cors: {
      credentials: true,
      origin: ["https://localhost:3000"]
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
