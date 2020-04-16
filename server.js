const express = require("express");
const app = express();
const bodyParser = require('body-parser')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})

const fs = require('fs')


app.get('/getPosts',(req,res)=>{

    let data = fs.readFileSync(__dirname+"/public/data/posts.txt",'utf8')
    
    console.log()

    data = JSON.parse(data)
    let orderedData = []
    for(let i = 0 ,j = data.length-1 ;i<data.length ; i++,j--){
        console.log(data[i])
        orderedData[j]= data[i]
    }
    
    res.send(orderedData)

})


app.post('/addSubscriber',(req,res)=>{
    console.log(req.body)
})

app.listen(5000)