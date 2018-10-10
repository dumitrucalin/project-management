var Vue = require('vue');
var setup = require('../../setup.js');

module.exports = {
	namespaced: true,

	state: {
		tasks: null,
		show: false,
	},

	data: {
		intervalStatus: null,
		notifications: true,//To show, change to true, trebuie facut buton in dashboard
	},

	getters: {
		tasks(state) {
			return state.tasks;
		},
		show(state) {
			return state.show;
		}
	},

	actions: {
		async create(store, taskInfo) {
			try {
				if (taskInfo.taskDeadline === null)
					delete (taskInfo.taskDeadline);
				if (taskInfo.taskPriority === '')
					delete (taskInfo.taskPriority);

				let response = await Vue.http.post(setup.API + '/tasks/create', taskInfo);

				if (response.data.err === 0) {
					var tasks = JSON.parse(JSON.stringify(store.getters ['tasks']));
					taskInfo.taskId = response.data.taskId;
					if (taskInfo.usernamesReceiver.length === 1 && taskInfo.usernameCreator === taskInfo.usernamesReceiver[0])
						tasks.tasksReceived.push(taskInfo);
					else
						tasks.tasksGiven.push(taskInfo);

					store.commit('tasks', tasks);

					Vue.toast.customToast({
						title: 'Create Task: Success',
						message: 'The task has been created!',
						type: 'info'
					});

					return true;
				} else {
					Vue.toast.customToast({
						title: 'Create Task: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async checkOnce(store, userInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/tasks/get', {
					username: userInfo.username,
					groupName: userInfo.groupName
				});

				if (response.data.err === 0) {
					store.commit('tasks', response.data.tasks);
				} else {
					Vue.toast.customToast({
						title: 'Check if Tasks were Modified: Failed',
						message: response.data.message,
						type: 'warning'
					});
				}

				console.log(response.data.tasks);

			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		check(store, userInfo) {
			try {
				this.intervalStatus = setInterval( async function() {
					let response = await Vue.http.post(setup.API + '/tasks/status/get', {
						username: userInfo.username,
						groupName: userInfo.groupName
					});

					if (response.data.err === 0) {
						if (response.data.tasksModified) {
							let response = await Vue.http.post(setup.API + '/tasks/get', {
								username: userInfo.username,
								groupName: userInfo.groupName
							});

							store.commit('tasks', response.data.tasks);
								
							console.log(response.data.tasks);
						}
					} else {
						Vue.toast.customToast({
							title: 'Check if Tasks were Modified: Failed',
							message: response.data.message,
							type: 'warning'
						});
					}
				}, 1000);
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async delete(store, taskInfo) {
			try {
				var taskId = taskInfo.taskId;
				var groupName = taskInfo.groupName;
				
				let response = await Vue.http.post(setup.API + '/tasks/delete', {
					taskId: taskId, 
					groupName: groupName
				});

				if (response.data.err === 0) {
					var tasks = JSON.parse(JSON.stringify(store.getters ['tasks']));
					for (var id in tasks.tasksGiven) {
						if (tasks.tasksGiven[id].taskId === taskInfo.taskId)
							tasks.tasksGiven.splice(id, 1);
					}

					store.commit('tasks', tasks);

					Vue.toast.customToast({
						title: 'Task Deleted: Success',
						message: 'Task deleted succsessfuly.',
						type: 'info'
					});

					return true;
				} else {
					Vue.toast.customToast({
						title: 'Task Deleted: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async deleteId(store, taskIdInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/task/delete', {
					taskId: taskIdInfo.taskId, 
					groupName: taskIdInfo.groupName, 
					username: taskIdInfo.username
				});

				if (response.data.err === 0) {
					var tasks = JSON.parse(JSON.stringify(store.getters ['tasks']));
					var tasksReceived = tasks.tasksReceived;
					tasksReceived = tasksReceived.filter(function(taskDeleteId) {
						return taskDeleteId.taskId !== taskIdInfo.taskId;
					});

					tasks.tasksReceived = tasksReceived;
					store.commit('tasks', tasks);

					return true;
				} else {
					Vue.toast.customToast({
						title: 'Task Deleted from Personal List: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async change(store, task) {
			try {
				let response = await Vue.http.post(setup.API + '/tasks/status/change', {
					taskId: task.taskId, 
					taskStatus: task.taskStatus,
					usernameCreator: task.usernameCreator,
					groupName: task.groupName
				});

				if (response.data.err === 0) {
					var tasks = JSON.parse(JSON.stringify(store.getters ['tasks']));
					for (let id in tasks.tasksReceived) {
						if (tasks.tasksReceived[id].taskId === task.taskId)
							tasks.tasksReceived[id].taskStatus = task.taskStatus;
					}

					store.commit('tasks', tasks);

					return true;
				} else {
					Vue.toast.customToast({
						title: 'Change the Task Status: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async receivers(store, taskInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/tasks/receivers', {
					taskId: taskInfo.taskId,
					usernamesReceiver: taskInfo.usernamesReceiver
				});

				if (response.data.err === 0) {
					Vue.toast.customToast({
						title: 'Change the Task Status: Success',
						message: 'Task assigned successfully to you.',
						type: 'info'
					});

					return true;
				} else {
					Vue.toast.customToast({
						title: 'Change the Task Status: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		stopCheck() {
			clearInterval(this.intervalStatus);
		},

		view(store, viewTasks) {
			store.commit('show', viewTasks);
		},
	},
	
	mutations: {
		tasks(state, value) {
			state.tasks = value;
		},
		show(state, value) {
			state.show = value;
		}
	}
};