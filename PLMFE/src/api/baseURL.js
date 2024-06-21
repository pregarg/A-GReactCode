//baseURL:'http://15.206.64.89',
//baseURL:'https://api.connectclub.in',
//baseURL:'https://apiv2.connectclub.in/',
//baseURL: "https://apitest.connectclub.in/"
//http://13.233.26.11:8000/
// /http://13.235.132.156:8000/

//ADD SLASH AT THE END
//https://devapiv3.connectclub.in/
//https://apiv2.connectclub.in/
import { serverConfig } from "../config/config";
export const baseURL = serverConfig.serverUrl + "/api";