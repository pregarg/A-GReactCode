export const USER = "contractor";
export const PASSWORD = "password";
export const serverConfig = {
  serverUrl:
    window.location.port === "3000"
      ? "http://localhost:8081"
      : window.location.origin + "/SelfService",
};
