const nodemailer = require("nodemailer");
const config = require("config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get("email"),
    pass: config.get("emailPassword"),
  },
});

sendEmailForResetPassword = (to, text, _id) => {
  const t =
    "<a href='" +
    config.get("frontEndURL") +
    "/resetPassword/?id=" +
    _id +
    "'>Reset Password</a>";

  const mailOptions = {
    from: config.get("email"),
    to: to,
    subject: "Account recovery.",
    html: t,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: ", info.response);
      return true;
    }
  });
};
module.exports = sendEmailForResetPassword;
// module.exports = sendEmailVerificationCode = (to, code) => {
//   const mailOptions = {
//     from: config.get("email"),
//     to: to,
//     subject: "Please enter following code to verify your account",
//     text: "enter " + code + " to verify your email",
//   };

// };

// module.exports = sendNotification = (to, subject, content) => {
//   const mailOptions = {
//     from: config.get("email"),
//     to: to,
//     subject: subject,
//     text: content,
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       return false;
//     } else {
//       console.log("Email sent: ", info.response);
//       return true;
//     }
//   });
// };
