exports.registerEmailParams = (email, name, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
        <h1>Hello ${name}</h1>
        <h3>Please verify your  email address</h3>
        <p>Use the following link to complete your registration</p>
        <p>${process.env.CLIENT_URL}auth/activate/${token}</p>
        </br>
        <p>Please note, this link will expire in 1 hour</p>
        </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Complete your registration",
      },
    },
  };
};
