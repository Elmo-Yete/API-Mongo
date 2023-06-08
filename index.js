const express = require("express");
const mongoose = require("mongoose");

const app = express();

// generar un objeto con estructura y se le pasa a mongo
const koderSchema = new mongoose.Schema({
    name: {
        type:String,
        minlength:3,
        maxlength:12,
        required:true
    },
    age:{
        type:Number,
        min:18,
        max:100,
        required:true
    },
    module:{
        type:String,
        minlength:3,
        maxlength:12,
        required:true
    },
    generation:{
        type:String,
        minlength:3,
        maxlength:12,
        required:true
    },
    sex:{
        type:String,
        enum:["f","m","o"]
    }
})

// modelo  (va en mayus y siempre es en singular )

const Koder = mongoose.model("Koders", koderSchema, "Koders");



//  conectar BD
const URL = "mongodb+srv://ElmoYete:MWXfjrtCSa0vqO69@cluster0.kvpeegn.mongodb.net/Kodemia"

mongoose.connect(URL)
.then (()=> {
    console.log("Conectado")
    app.listen(8080,()=> {
        console.log("Arriba server")
    })
})
.catch((error)=> {
    console.log("No conecto",error)
})

app.get ("/",(req,res)=> {
    res.json("Estamos en el home")
})

app.get ("/koders", async (req,res)=> {
    // acceder a la bd
    const koders = await Koder.find();
    console.log("koders",koders)
})