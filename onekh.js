// List of tasks
// Task

/*
Actions:
    Load
        - loadServer()
        - update task list
        - render task list
    Add
        - add form - showAddForm()
        - add to server - addServer(data)
        - hide form
        - update task list
        - render task list

    Edit
        - edit form - showEditForm(task)
        - edit in server - editServer(data)
        - hide form
        - update task list
        - render task list

    Delete
        - delete - showDeleteModal(task)
        - delete from server - deleteServer(data)
        - hide form
        - update task list
        - render task list
*/


function TaskManager(){
    this.taskList;

    this.taskContainer = document.getElementById('task-list');
    this.taskPanel = document.getElementById('task-panel')

    this.addButton = document.getElementById('add-button');
    this.addButton.onclick = this.showAddForm();

    this.addForm = document.getElementById('add-form');
    this.editForm = document.getElementById('edit-form');
    this.deleteForm = document.getElementById('delete-form');

    this.addForm.querySelector('input[type="submit"]').onclick = this.addAction();
    this.editForm.querySelector('input[type="submit"]').onclick = this.editAction();
    this.deleteForm.querySelector('input[type="submit"]').onclick = this.deleteAction();

    this.showElem = function(elem){
        /* show modal */
    }

    this.hideElem = function(elem){
        /* hide modal */
    }

    this.addUI = function(){
        this.showElem(this.addForm);
    }

    this.editUI = function(task){
        /* fill form with task */
        this.showElem(this.editForm);
    }

    this.deleteUI = function(task){
        /* add task data to delete form */
        this.showElem(this.deleteForm);
    }

    this.getAction = function(){
        this.server(null, 'GET', GET_URL, {})
    }

    this.addAction = function(){
        /* get data from form*/
        this.hideElem(this.addForm);
        this.server('POST', ADD_URL, data);
    }

    this.editAction = function(){
        /* get data from form*/
        this.hideElem(this.editForm);
        this.server('PUT', EDIT_URL, data);
    }

    this.deleteAction = function(){
        /* get data from delete modal*/
        this.hideElem(this.deleteForm);
        this.server('DELETE', DELETE_URL, data)
    }

    this.filter = function(name){
        var timeSpent = 0;
        this.taskList.forEach((t)=>{
            if((name == null ) | (t.name==name)){
                t.div.style.display = 'block'
                timeSpent = timeSpent + t.timeSpent;
            }
            else{
                t.div.style.display = 'none';
            }
        })
        /* render panel*/
    }

    this.render = function(){
        var timeSpent = 0;
        this.taskContainer.innerHTML = "";
        this.taskList.forEach((t)=>{
            taskContainer.appendChild(t.toHTML());
            timeSpent = timeSpent + t.timeSpent;
        })
        /* render panel*/
    }

    this.server = function(method, url, data){
        $.ajax({
            type: method,
            async: false,
            url: url,
            data: data,
            success: function(data) {
                this.taskList = data['tasks'];
                this.render();
            },
            error: function(xhr) {
                console.log("error", xhr);
            },
        });
    }
}

function Task(name, notes, timeSpent, manager){
    this.name = name;
    this.notes = notes;
    this.timeSpent = timeSpent;
    this.date = Date.now();
    this.div = document.getElementById('task').querySelector('div');
    this.manager = manager
    this.toHTML = function(){
            for(a of ['name', 'notes', 'timeSpent', 'date']){
                var elem = this.div.querySelector('[name="task-{{a}}"'.replace("{{a}}", a))
                elem.innerHTML = elem.innerHTML.replace('{{a}}'.replace('a', a), this[a]);
                elem.querySelector('.edit-button').onclick=()=>{
                    this.manager.editUI(this);
                }
                elem.querySelector('.delete-button').onclick=()=>{
                    this.manager.deleteUI(this);
                }
        }
    }
}

