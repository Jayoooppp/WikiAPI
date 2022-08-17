const express = require("express")
const ejs  = require('ejs')
const mongoose = require("mongoose")
const parser = require("body-parser")

const app = express()
app.use(parser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set("view engine" , ejs)


mongoose.connect("mongodb://localhost:27017/wikiDB");


const article_schema = new mongoose.Schema({
    title: String,
    content: String
})


const Article = mongoose.model("artical" , article_schema);

app.route("/articles")


// requests targeting all the articles
.get(function (req , res) { 
    Article.find(function (err  , result) { 
        if(err)
        {
            console.log(err);
        }else{
            res.send(result)
        }
     })
 })
 
 .post(function (req , res) { 
    let a_title = req.body.title;
    let a_content = req.body.content;
    const new_article = new Article({
        title: a_title,
        content: a_content
    })
    new_article.save(function (err) { 
        if(err){
            res.send(err)
        }else{
            res.send("Data saved in the database")
        }
     });
 })
 
 .delete(function (req  , res) { 
    Article.deleteMany(function (err) { 
        if(err)
        {
            res.send(err);
        }else{
            res.send("Data deleted from the database")
        }
     })
});



// requests targeting specific articles
app.route("/articles/:title")
.get(function (req , res) { 
    let titletofind = req.params.title;
    Article.findOne({title: titletofind} , function (err , article) { 
        if(err)
        {
            res.send("No article found in the database by name of" + titletofind)
        }else{
            res.send(article)
        }
     })
 })
.put(function (req , res) { 
    let titletoupdate = req.params.title;
    Article.updateOne(
        {title: titletoupdate} ,
        {title: req.body.title , content: req.body.content},
        function (err) { 
            if(err){
                res.send("Data couldn't updated due to some error")
            }else{
                res.send("Data is updated successfully")
            }
         })
 })
.patch(function (req , res) { 

    let titletoupdate = req.params.title;
    Article.updateOne(
        {title: titletoupdate} ,
        {$set: {title: req.body.title , content: req.body.content}},
        function (err) { 
            if(err){
                res.send("Data couldn't updated due to some error")
            }else{
                res.send("Data is updated successfully")
            }
         })

 })
.delete(function (req , res) { 
    let titletodelete = req.params.title;
    Article.deleteOne({title: titletodelete} , function (err) { 
        if(err)
        {
            res.send("Data is not present in the database")
        }else{
            res.send("Data is successfully deleted from the database")
        }
     })
 });



app.listen(3000  , function () { 
    console.log("Server Started");
 })

