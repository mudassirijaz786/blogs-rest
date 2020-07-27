const config = require("config");
module.exports = (app) => {
  if (config.get("socket")) {
    const http = require("http").createServer(app);
    var io = require("socket.io")(http);

    io.on("connection", (socket) => {
      socket.on("newUser", async (user) => {
        io.emit("newUser", user);
      });

      socket.on("disconnect", async (user) => {
        io.emit("userLeft", user);
      });
      socket.on("connect", async (user) => {
        io.emit("new User on site", user);
      });

      socket.on("notification", async (notification) => {
        notification["created_at"] = new Date().toString();
        notification.notification["time"] = new Date().toString();
        io.emit("notification", notification);
      });
    });
  }
};
