/*
 * @Author: your name
 * @Date: 2021-08-14 00:44:18
 * @LastEditTime: 2021-09-15 14:44:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \first-project\controller\mongoose.js
 */

const mongoose = require("mongoose");
// mongoose.connect("mongodb://172.17.0.2:27017/test1", {
// mongoose.connect("mongodb://172.21.0.3:27017/test1", {
// mongoose.connect("mongodb://172.17.0.4:27017/admin", {
// mongoose.connect("mongodb://172.23.0.4:27017/test1", {
// mongoose.connect("mongodb://172.23.0.2:27017/test1", {
mongoose.connect("mongodb://mongo-solid-pollution:27017/test1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ?建立集合结构(表结构)
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: String, // String is shorthand for {type: String}
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
});

const Cat = mongoose.model("Cat", { name: String });

const kitty = new Cat({ name: "Zildjian" });
kitty.save().then(() => {
    console.log("meowdd");
    mongoose.disconnect();
});
