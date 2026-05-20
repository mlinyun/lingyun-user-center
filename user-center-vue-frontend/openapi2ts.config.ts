export default {
    requestLibPath: 'import { http } from "@/utils/request/http.ts";',
    schemaPath: "http://localhost:8100/api/v3/api-docs",
    authorization: "Basic " + Buffer.from("admin:admin1024").toString("base64"),
    serversPath: "./src/gen",
};
