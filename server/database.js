const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(9000, () => console.log('database server running on port 9000'))

async function connectToMongoDB() {
    const uri = "YOUR_MONGODB_URL";

    await mongoose.connect(uri)
    console.log('Connected to MongoDB Atlas')
    // Perform database operations
}
connectToMongoDB()

const usersSchema = mongoose.Schema({
    email: String,
    name: String,
    password: String,
    recipes: Array
})

const UsersModel = mongoose.model("users", usersSchema)


app.post("/signup", async (req, res) => {
    console.log(req.body.email, req.body.password)
    try {
        const getUsers = await UsersModel.find({ email: req.body.email })
        if (getUsers.length >= 1) {
            console.log(getUsers)
            return res.status(200).json({ message: "Exists", value: true })
        }
        else {
            let usersModel = new UsersModel()
            usersModel.email = req.body.email
            usersModel.name = req.body.name
            usersModel.password = req.body.password
            const doc = await usersModel.save()
            console.log(doc._id)
            return res.status(200).json({ id: doc._id })
        }
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

app.post("/signin", async (req, res) => {
    console.log(req.body.email, req.body.password)
    try {
        const doc = await UsersModel.find({ $and: [{ email: req.body.email }, { password: req.body.password }] })
        if (doc.length == 0) {
            return res.status(200).json({ value: false })
        }
        else {
            console.log(doc, doc[0]._id)
            res.status(200).json({ value: true, id: doc[0]._id })
        }
    } catch (error) {
        res.sendStatus(500)
    }
})

app.put("/reset-password", async (req, res) => {
    try {
        const doc = await UsersModel.find({email:req.body.email})
        if(doc.length == 0) {
            res.status(200).json({message:"Email doesn't exists!", value:false})
        }
        else {
            const doc = await UsersModel.updateOne({email:req.body.email}, {$set:{
                password:req.body.password
            }})
            if(doc.acknowledged) {
                res.status(200).json({message:"Password changed!", value:true})
            }
            else {
                console.log(doc)
                res.status(200).json({message:"unable to change password!", value:false})
            }
        }
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

app.get("/get-username/:id", async (req, res) => {
    try {
        const doc = await UsersModel.find({ _id: req.params.id }, { name: 1 })
        return res.status(200).json({ name: doc[0].name })
    } catch (error) {

    }
})

app.put("/add-to-favourites", async (req, res) => {
    try {

        const doc = await UsersModel.find({ _id: req.body.uid }, { recipes: 1 })
        let isPresent = false
        const recipes = Object(doc[0].recipes)
        if (recipes.length === 0) {
            const response = await UsersModel.updateOne(
                { _id: req.body.uid },
                {
                    $push: {
                        recipes: { "id": Number(req.body.id), "title": req.body.title, "time": Number(req.body.time), "image": req.body.image }
                    }
                }
            )
            res.status(200).json({ value: true, message: "added" })
        }
        else {
            for (let i = 0; i < recipes.length; i++) {
                if (recipes[i].id === Number(req.body.id)) {
                    isPresent = true
                    break
                }
            }
            if (!isPresent) {
                const response = await UsersModel.updateOne(
                    { _id: req.body.uid },
                    {
                        $push: {
                            recipes: { "id": Number(req.body.id), "title": req.body.title, "time": Number(req.body.time), "image": req.body.image }
                        }
                    }
                )
                res.status(200).json({ value: true, message: "added" })
            }
            else res.status(200).json({ value: false, message: "Recipe Exists!" })
        }
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

app.post("/delete-recipe-from-favourites", async (req, res) => {
    try {
        const doc = await UsersModel.find({ _id: req.body.uid }, { recipes: 1 })
        doc[0].recipes = doc[0].recipes.filter((recipe) => recipe.id !== Number(req.body.id))
        const response = await UsersModel.updateOne({ _id: req.body.uid }, { $set: { recipes: doc[0].recipes } })
        res.status(200).json(response)
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

app.get("/get-favourites/:uid", async (req, res) => {
    try {
        const doc = await UsersModel.find({ _id: req.params.uid }, { recipes: 1 })
        res.status(200).json({ list: doc[0].recipes })
    } catch (error) {
        console.log(error)
    }
})

app.get("/get-favourites-count/:uid", async (req, res) => {
    try {
        const doc = await UsersModel.find({ _id: req.params.uid }, { recipes: 1 })
        res.status(200).json({ count: doc[0].recipes.length })
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

app.get("/test", async (req, res) => {
    try {
        const docs = await UsersModel.find({}, { _id: 1 })
        res.json(docs)
    } catch (error) { }
})
