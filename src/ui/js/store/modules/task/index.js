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
					if(this.notifications)
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

		async check(store, userInfo) {
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
				}, 5000);
			} catch(error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async delete(store, taskInfo) {
			try {
				var taskId = taskInfo.taskId;
				var groupName = taskInfo.groupName;
				
				let response = await Vue.http.post(setup.API + '/tasks/exist', {
					taskId: taskId
				});

				if (response.data.err === 0) {
					await Vue.http.post(setup.API + '/tasks/delete', {
						taskId: taskId, 
						groupName: groupName
					});

					if(this.notifications)
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
				let response = await Vue.http.post(setup.API + '/tasks/change/status', {
					taskId: task.taskId, 
					taskStatus: task.taskStatus
				});
				
				if (response.data.err === 0) {
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