
const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/connect.js");

dotenv.config();

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

const port = process.env.PORT || 5000;
  

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(port, () =>
      console.log(`Server started on port http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
