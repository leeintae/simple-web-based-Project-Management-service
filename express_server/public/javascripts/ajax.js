var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        var resultJSON = JSON.parse(this.responseText);

        if(resultJSON.msg == "addNewTaskSuccess"){
            var title = document.getElementById('newTitle').value;
            var content = document.getElementById('newContent').value;
            var id = resultJSON.task_id;
            document.getElementById('newTitle').value = "";
            document.getElementById('newContent').value = "";

            showTask('todoTasks', id, title, content);
        }
        else if(resultJSON.msg == "firstLoading"){
            var tasks = resultJSON.tasks;
            for(var i in tasks) {
                switch (tasks[i].status) {
                    case 'todo':
                        showTask('todoTasks', tasks[i]._id.toString(), tasks[i].title, tasks[i].content);
                        break;
                    case 'doing':
                        showTask('doingTasks', tasks[i]._id.toString(), tasks[i].title, tasks[i].content);
                        break;
                    case 'done':
                        showTask('doneTasks', tasks[i]._id.toString(), tasks[i].title, tasks[i].content);
                        break;
                }
            }
        }else if(resultJSON.msg == "deleteTaskSuccess"){
            alert("delete success");
        }
    }
}

function showTask(location, id, title, content){
    var loc = location + "";
    var div = document.createElement('div');
    var t = document.createElement('div');
    var c = document.createElement('div');
    var i = document.createElement('input');

    div.setAttribute("id", id);
    div.setAttribute("class", "task_show");
    div.setAttribute("draggable", "true");
    div.setAttribute("ondragstart", "drag(event)");
    div.appendChild(t);
    div.appendChild(c);
    div.appendChild(i);

    t.innerHTML = title;
    c.innerHTML = content;
    i.setAttribute("type", "button");
    i.setAttribute("value", "delete");
    i.setAttribute("onclick", "deleteTask(this)");

    document.getElementById(loc).appendChild(div);
}

window.onload = function(){
    var url = "/getAllTaskDocuments";
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function addNewTask(){
    var url = "/addTaskDocument";
    var data = {
        title: document.getElementById('newTitle').value,
        content: document.getElementById('newContent').value
    };
    if(data.title == "" || data.content == ""){
        alert("empty!");
    }else{
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(data));
    }
}

function deleteTask(input){
    var url = "/deleteTaskDocument";
    var data = {
        id: input.parentNode.getAttribute("id")
    };

    input.parentNode.parentNode.removeChild(input.parentNode);

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev){
    var el = ev.target;
    ev.preventDefault();
    var eleid = ev.dataTransfer.getData("text");
    if (el.id  != 'todoTasks' && el.id != 'doingTasks' && el.id != 'doneTasks') {
        el = el.parentNode;
    }
    el.appendChild(document.getElementById(eleid));

    var url = "/changeTaskStatus";
    var mystatus;
    switch(el.id){
        case 'todoTasks':
            mystatus = 'todo';
            break;
        case 'doingTasks':
            mystatus = 'doing';
            break;
        case 'doneTasks':
            mystatus = 'done';
    }
    var data = {
        myId: eleid,
        myStatus: mystatus
    };

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(data));
}