
Parse.Cloud.afterSave("TaskGroup", function (request) {

    var TaskGroup = request.object;


    var archiveGroupsStartedMatchingGroup = function(taskGroup) {
        var groupStartedQuery = new Parse.Query("TaskGroupStarted");
        groupStartedQuery.equalTo("taskGroup", taskGroup);
        // normally just one, so first() should in theory be fine
        // however leaving the option of having multiple
        // started groups open
        groupStartedQuery.find().then(function (taskGroupsStarted) {
            var now = new Date();
            taskGroupsStarted.forEach(function (circuitStarted) {
                circuitStarted.set('archive', true);
                circuitStarted.set('timeEnded', now);
                circuitStarted.save();
            });
        });
    };

    var archiveTasksMatchingGroup = function(taskGroup) {
        var tasksQuery = new Parse.Query("Task");
        tasksQuery.equalTo("taskGroup", taskGroup);
        tasksQuery.find().then(function (tasks) {
            tasks.forEach(function (task) {
                task.set('archive', true);
                task.save();
            });
        });
    };

    // when creating a TaskGroup for the first time
    // generate a TaskGroupStarted right away
    if (!TaskGroup.has('createdDay')) {
        console.log("Create new TaskGroup");
        Parse.Cloud.run("createTaskGroupStarted", {
            objectId: TaskGroup.id
        });
    }

    // when archiving started TaskGroup and all
    // child task should be archived as well
    if (TaskGroup.get('archive')) {
        console.log("Archiving TaskGroup");
        archiveGroupsStartedMatchingGroup(TaskGroup);
        archiveTasksMatchingGroup(TaskGroup);
    }
});

Parse.Cloud.define("createTaskGroupStarted", function(request, response) {


    var createTaskGroupStarted = function(taskGroup) {

        console.log("createTaskGroupStarted");

        var promises = [];

        var now = new Date();

        taskGroup.set('createdTime', now);
        taskGroup.set('createdDay', now.getDay());

        var TaskGroupStarted = Parse.Object.extend("TaskGroupStarted");
        var taskGroupStarted  = new TaskGroupStarted();
        Object.keys(taskGroup.attributes).forEach(function (fieldName) {
            taskGroupStarted.set(fieldName, taskGroup.get(fieldName));
        });
        taskGroupStarted.set('taskGroup', taskGroup);
        taskGroupStarted.set('timeStarted', now);

        promises.push(taskGroupStarted.save());
        promises.push(taskGroup.save());

        return Parse.Promise.when(promises);
    };

    var resetTasksMatchingGroup = function(taskGroup) {

        var queryCompleted = new Parse.Query("Task");
        queryCompleted.exists('guard');

        queryCompleted.equalTo('taskGroup', taskGroup);
        return queryCompleted.each(function(task) {
            task.unset('guard');
            task.set('isAborted', false);

            return task.save();
        });
    };

    var fetchTaskGroup = function(objectId) {
        var TaskGroup = Parse.Object.extend("TaskGroup");
        var query = new Parse.Query(TaskGroup);
        return query.get(objectId);
    };

    fetchTaskGroup(request.params.objectId)
    .then(function(taskGroup) {

        var promises = [];

        promises.push(resetTasksMatchingGroup(taskGroup));
        promises.push(createTaskGroupStarted(taskGroup));

        return Parse.Promise.when(promises);
    }).then(function() {
        response.success("Successfully created TaskGroupStarted");
    }, function(error) {
        response.error(error.message);
    });

});




