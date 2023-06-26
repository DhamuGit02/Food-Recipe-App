
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const apiKey = "7e72c94189d44e3eaefb39302d95df37"   //account 2 active
const bearer_token = "d0cfed810f94cf5349a479a56bb7e2a4cd4d79a6"
const fs = require("fs")
const path = require("path")
const multer = require("multer")
const FormData = require('form-data');
const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "temp/")
        console.log("dest")
    },
    filename: (req, file, cb) => {
        console.log(file)
        const date = new Date()
        cb(null, String(date.getMilliseconds()) + path.extname(file.originalname))
        console.log("filename")
    }
})
const upload = multer({ storage: storage })
app.use(cors())
app.use(express.json({ limit: "1mb" }))
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(8000, () => console.log("server connected"))
app.get("/api/cuisine/:country/:offset", async (req, res) => {
    try {
        const query = `https://api.spoonacular.com/recipes/complexSearch?cuisine=${req.params.country}&number=100&offset=${req.params.offset}&addRecipeInformation=true&apiKey=${apiKey}`
        const recipes = await axios.get(query)
        const result = []
        const length = recipes.data.results.length
        const results = recipes.data.results
        for (let i = 0; i < length; i++) {
            const obj = Object()
            obj["id"] = results[i].id
            obj["title"] = results[i].title
            obj["vegetarian"] = results[i].vegetarian
            obj["likes"] = results[i].aggregateLikes
            obj["readyInMinutes"] = results[i].readyInMinutes
            obj["image"] = results[i].image
            result.push(obj)
        }
        return res.json(result)
    } catch (error) {
        return res.json(error)
    }
})

app.get("/api/get-random-recipes", async (req, res) => {
    try {
        const query = `https://api.spoonacular.com/recipes/random?number=100&apiKey=${apiKey}`
        const randomRecipes = await axios.get(query)
        const result = []
        const length = randomRecipes.data.recipes.length
        const results = randomRecipes.data.recipes
        for (let i = 0; i < length; i++) {
            const obj = Object()
            obj["id"] = results[i].id
            obj["title"] = results[i].title
            obj["vegetarian"] = results[i].vegetarian
            obj["likes"] = results[i].aggregateLikes
            obj["readyInMinutes"] = results[i].readyInMinutes
            obj["image"] = results[i].image
            result.push(obj)
        }
        return res.json(result)
    } catch (error) {
        return res.json(error)
    }
})

app.get("/api/search/:query", async (req, res) => {
    try {
        const searchQuery = req.params.query
        const query = `https://api.spoonacular.com/recipes/autocomplete?query=${searchQuery}&number=10&apiKey=${apiKey}`
        const searchResults = await axios.get(query)
        const result = searchResults.data.map((searchResult) => {
            return { label: searchResult.title }
        })
        return res.json(result)
    } catch (error) {
        return res.json(error)
    }
})

app.get("/api/similar/:title/:offset", async (req, res) => {
    try {
        const query = `https://api.spoonacular.com/recipes/complexSearch?titleMatch=${req.params.title}&apiKey=${apiKey}&addRecipeInformation=true&number=100&offset=${Number(req.params.offset)}`
        const similarRecipes = await axios.get(query)
        const result = []
        const length = similarRecipes.data.results.length
        const results = similarRecipes.data.results
        for (let i = 0; i < length; i++) {
            const obj = Object()
            obj["id"] = results[i].id
            obj["title"] = results[i].title
            obj["vegetarian"] = results[i].vegetarian
            obj["likes"] = results[i].aggregateLikes
            obj["readyInMinutes"] = results[i].readyInMinutes
            obj["image"] = results[i].image
            result.push(obj)
        }
        return res.json(result)
    } catch (error) {
        return res.json(error)
    }
})

app.get("/api/get-recipe-information/:id", async (req, res) => {
    try {
        const result = Object()
        const temp1 = []
        const temp2 = []
        const id = req.params.id
        const nutritionIngredients = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`)
        const ingredients = nutritionIngredients.data.extendedIngredients
        const nutrients = nutritionIngredients.data.nutrition.nutrients
        const length = ingredients.length
        for (let i = 0; i < length; i++) {
            temp1.push(ingredients[i].original)
            temp2.push({ "name": nutrients[i].name, "amount": nutrients[i].amount, "unit": nutrients[i].unit })
        }
        result['ingredients'] = temp1
        result['nutrients'] = temp2
        const instructions = await axios.get(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`)
        const steps = instructions.data[0].steps
        const temp3 = steps.map((step) => { return step.step })
        result['steps'] = temp3
        const equipments = await axios.get(`https://api.spoonacular.com/recipes/${id}/equipmentWidget.json?apiKey=${apiKey}`)
        const temp4 = equipments.data.equipment.map((equipment) => { return equipment.name })
        result['equipments'] = temp4
        result['id'] = nutritionIngredients.data.id
        result['title'] = nutritionIngredients.data.title
        result['time'] = nutritionIngredients.data.readyInMinutes
        return res.json(result)
    } catch (err) {
        return res.json(err)
    }
})

app.post("/api/analyze", upload.single("file"), async (req, res) => {
    try {
        // const resizer = new Resizer.default(req.file, 512)
        // resizer.resizeImage().then((value) => {
        //     fs.createWriteStream(`./temp/${req.file.filename}`)
        // })
        console.log(req.file.filename)
        let data = new FormData();
        data.append('image', fs.createReadStream(req.file.path));
        console.log(req.body.type)
        const url = String(req.body.type) === "dish" ? 'https://api.logmeal.es/v2/image/recognition/complete' : 'https://api.logmeal.es/v2/image/segmentation/complete'
        console.log(url)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'Authorization': 'Bearer ' + bearer_token,
                ...data.getHeaders()
            },
            data: data
        };
        const response = await axios.request(config)
        if(req.body.type === "dish") {
            res.status(200).json({
                foodFamily:response.data.foodFamily,
                occasion:response.data.occasion,
                recognition_results:response.data.recognition_results.slice(0, 3)
            })
        }
        else {
            //har ek segementation result me multiple recognition results he jisme se sirf first prediction lena he
            const temp = []
            for(let i = 0; i < response.data.segmentation_results.length; i++) {
                temp.push(response.data.segmentation_results[i].recognition_results[0])
            }
            res.status(200).json({
                foodFamily:response.data.foodFamily,
                occasion:response.data.occasion,
                segmentation_results:temp
            })
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
    finally {
        fs.unlink(req.file.path, (err) => {
            if(err) console.log(err)
            return
        })
    }
})


//Database endpoints
// -------------------------------------------------------------------------------------------------------------------------------------------
// 


app.post('/api/signup', async (req, res) => {
    console.log(req.body.email, req.body.password)
    try {
        const response = await axios.post('http://localhost:9000/signup', { email: req.body.email, name: req.body.name, password: req.body.password })
        console.log(response.data.id)
        if (response.status == 200) return res.json(response.data)
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
    // res.sendStatus(200)
})

app.post('/api/signin', async (req, res) => {
    console.log(req.body.email, req.body.password)
    try {
        const response = await axios.post('http://localhost:9000/signin', { email: req.body.email, password: req.body.password })
        console.log(response.data)
        return res.json(response.data)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.put("/api/reset-password", async (req, res) => {
    try {
        const response = await axios.put("http://localhost:9000/reset-password", {email:req.body.email, password:req.body.password})
        res.status(200).json(response.data)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/api/get-username/:id', async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:9000/get-username/${req.params.id}`)
        res.status(200).json(response.data)
    } catch (error) {

    }
})

app.put('/api/add-to-favourites', async (req, res) => {
    try {
        const response = await axios.put("http://localhost:9000/add-to-favourites", {
            uid: req.body.uid,
            id: req.body.id,
            title: req.body.title,
            time: req.body.time,
            image: req.body.image
        })
        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})

app.get("/api/get-favourites/:uid", async (req, res) => {
    // res.json(req.params.uid)
    try {
        const response = await axios.get(`http://localhost:9000/get-favourites/${req.params.uid}`)
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ value: false, message: "cannot fetch data" })
    }
})

app.get("/api/get-favourites-count/:uid", async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:9000/get-favourites-count/${req.params.uid}`)
        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post("/api/delete-recipe-from-favourites", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:9000/delete-recipe-from-favourites", {uid:req.body.uid, id:req.body.id})
        res.status(200).json({message:"deleted successfully!", value:true})
    } catch (error) {
        res.sendStatus(500)
        console.log(error)
    }
})

//Testing --------------------------------------
app.get("/test", async (req, res) => {
    try {
        const response = await axios.get("https://api.spoonacular.com/recipes/64779/information?instructionsRequired=true&apiKey=7e72c94189d44e3eaefb39302d95df37&includeNutrition=true&number=1")
        return res.json(response.data.nutrition.nutrients)
    } catch (err) { }
})