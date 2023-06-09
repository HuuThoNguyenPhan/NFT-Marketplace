const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/connect.js");
const auctionJob = require("./cron/aution.js");

const { NFTMarketplace } = require("./etherium/web3.js");
const { NFTFactory } = require("./etherium/web3_nft");

dotenv.config();

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () =>
      console.log(`Server started on port http://localhost:${port}`)
    );
    const nftFactory = await NFTFactory.getInstance();
  } catch (error) {
    console.error(error);
  }
};
startServer();
