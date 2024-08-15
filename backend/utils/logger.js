// Extracted logging into a separate module is a good practice, as it allows for easy modification of the logging behavior in the future.
// Modify to not print console.log in test mode: - not obstructing the test execution output
const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

module.exports = {
  info,
  error,
};
