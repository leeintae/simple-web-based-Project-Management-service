var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');

var db = mongoose.connection;
db.on('error', function(err){
    console.log("error: " + err);
});
db.on('connected', function(){
    console.log("Connected successfully to server");
});

var Schema = mongoose.Schema;
var taskSchema = new Schema({
    title: String,
    status: String,
    content: String
});

var Task = mongoose.model('Task', taskSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getAllTaskDocuments', function(req, res, next){
    Task.find(function(err, documents){
        if(err)
          return console.error(err);

        var s = {
            msg: "firstLoading",
            tasks: documents
        };

        res.send(JSON.stringify(s));
    });
});

router.post('/addTaskDocument', function(req, res, next){
    var t = new Task();
    t.title = req.body.title;
    t.content = req.body.content;
    t.status = "todo";

    t.save(function(err, savedDocument){
        if(err)
            return console.error(err);
    });

    var s = {
        msg: "addNewTaskSuccess",
        task_id: t._id.toString()
    };

    res.send(JSON.stringify(s));
});

router.post('/deleteTaskDocument', function(req, res, next){
    Task.remove({_id: req.body.id}, function(err, result){
        if(err)
            return console.log("err " + err);

        var s = {
            msg: "deleteTaskSuccess"
        };

        res.send(JSON.stringify(s));
    });
});

router.post('/changeTaskStatus', function(req, res, next){
    var changeId = req.body.myId;
    var changeStatus = req.body.myStatus;

    Task.findOneAndUpdate({_id: changeId}, {status: changeStatus}, function(err, result){
        if(err)
          return console.log("err " + err);
    });
});

module.exports = router;
