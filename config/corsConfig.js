/** @format */
import cors from "cors";

export default cors({
    origins: ["http://localhost:3000", "https://shrutis.io", "http://localhost:8080"],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type",
    credentials: true,
  })

