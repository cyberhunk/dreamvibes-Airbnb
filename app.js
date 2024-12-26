const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname,"/public")));

const Listing = require("./views/listings/index.ejs");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connect to db")
}).catch((err) => {
    console.log(err)
})


async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded,({extended: true}));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.get("/", function (req, res) {
    res.send("hellow i am root")
});
//
app.get("/listings", async function (req, res) {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

// new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});
// show route

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});
//create route
app.post("/listings", async (req, res) => {
    // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
    // console.log(listing);
});

//edit rout
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
});

//Update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
});




//
// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         discription: "by the beach",
//         price: 1200,
//         location: "indore",
//         country: "india"
//     });
//     await sampleListing.save();
//     console.log("sample save");
//     res.send("successfull");
// });
app.listen(3000, () => {
    console.log("server is running");
});