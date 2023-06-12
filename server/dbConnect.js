const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://Miten:MiHaKrRa88@projects.hpzcfyg.mongodb.net/?retryWrites=true&w=majority";

  try {
    const connect = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB connected : ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
