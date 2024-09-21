const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");



main().then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wonderlust');

};

const initDb = async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
      ...obj,
      owner:"66d1e724138e60a4c9bf1a88",
    }));
    await listing.insertMany(initData.data);
    console.log("data initlized");


};
initDb();