export const Alert = (message) => ({
  success: {
    message: message,
    backgroundColor: "#a2fc62",
    messageColor: "#191919",
    position: "topRight",
  },
  error: {
    message: message,
    backgroundColor: "#ff3838",
    messageColor: "#fff",
    position: "topRight",
  },
});
