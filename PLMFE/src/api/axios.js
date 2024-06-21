import axios from "axios";
import { serverConfig } from "../config/config";
export default axios.create({
  baseURL: serverConfig?.serverUrl + "/api",
});