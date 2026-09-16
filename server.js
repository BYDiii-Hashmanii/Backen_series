import app from "./src/app.js";
import connectDB from "./config/database.js";

try {
    await connectDB();

    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

} catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
}