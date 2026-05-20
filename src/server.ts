import app from "./app.js";
import { connectDB } from "./config/Db.js";
import { config } from "./config/index.js";

connectDB()

app.listen(config.port , () => {
    console.log(`The server is running on PORT ${config.port}`)
})