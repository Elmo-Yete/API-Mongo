const express = require("express");
const mongoose = require("mongoose");
const { devoptions } = require("nodemon/lib/config");

const app = express();

// * primer middleware
app.use(express.json())

// TODO: generar un objeto con estructura y se le pasa a mongo
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

// ! modelo  (va en mayus y siempre es en singular )

const Koder = mongoose.model("Koders", koderSchema, "Koders");

// ? middleware de prueba con obj date
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
})
// ? midd encapsulado 
const capsuladeMidd = (req,res,next) => {
    console.log("soy un mid encapsulado en una const")
    next()
}
// ! conectar BD
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

app.get ("/",capsuladeMidd,(req,res)=> {
    res.json("Estamos en el home")
})


app.get ("/koders", async (request,response)=> {
    try {
        // * const {name} = request.query
        // * acceder a la bd
        const koders = await Koder.find(request.query);
        // * console.log("koders",koders)
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
// * console.log("request:",request.body)
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
            response.status(418) // *404
            response.json({
                succes:false,
                message:"El koder que buscabas no existe"
            })
        }
    }
})

app.delete ("/koders/:id", async (request,response)=>{
    const {id} = request.params
    let _succes = true;
    try {
        const deleteKoder = await Koder.findByIdAndDelete(id)
        if (!deleteKoder) {
            succes:false;
            response.status(404)
        }
        console.log(deleteKoder)
        response.status(200)
        response.json ({
            succes:_succes,
            message:"koder eliminado"
        })
    } catch (error) {
        response.status(404)
        response.json({
            succes:false,
            message:error.message
        })
    }
})

app.patch("/koders/:id", async (req,res)=> {
    const {id} = req.params
    try {
        const updateKoder = await Koder.findByIdAndUpdate(id,{name:"test2"},{returnDocument:'after'})
        if (id.length === 0) {
            res.json ({
                message:"No se ingreso un ID"
            })
        }
        res.status(200);
        res.json({
            succes:true,
            message:`El koder ${updateKoder.name} fue actualizado`,
            data:updateKoder
        })
    } catch (error) {
        if (id.length < 8) {
            res.status(400)
            res.json ({
                succes:false,
                message:"El id es demasiado corto, vuelva a intentar"
            })
        } else {
            res.status(404)
            res.json ({
                message:"El ID ingresado no corresponde con ningun Koder"
            })
        }
    }
})