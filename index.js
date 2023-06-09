const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json())

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


app.get ("/koders", async (request,response)=> {
    try {
        // const {name} = request.query
        // acceder a la bd
        const koders = await Koder.find(request.query);
        // console.log("koders",koders)
        response.json({
            succes:true,
            data:koders
        })
    }catch(error) {
        response.status(400)
        response.json({
            succes:false,
            message:error.message
        })
    }
})

app.post("/koders", async (request,response)=> {
try {
// console.log("request:",request.body)
    const koder = await  Koder.create(request.body)
    response.status(201);
    response.json ({
        succes:true,
        data:koder
    })
} catch (error) {
    response.status(400)
    response.json ({
        succes:false,
        message:error.message
    })
}
})

app.get ("/koders/:id", async (request,response)=> {
    const {id} = request.params
    try {
        const koder = await Koder.findById(id);
        response.status(200)
        response.json ({
            succes:true,
            data:koder
        })
    } catch (error) {
        if (id.length < 8) {
            response.status(400)
            response.json ({
                succes:false,
                message:"El id es demasiado corto, vuelva a intentar"
            })
        } else {
            response.status(418) // 404
            response.json({
                succes:false,
                message:"El koder que buscabas no existe"
            })
        }
    }
})