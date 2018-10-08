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
							title:'SendTask:Success',
							message:'The task has been set!',
							type:'info'
						});

					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'SendTask:Fail',
							message:'The task has not been sent: ',
							type:'warning'
						});

					return false;
				}
			} catch(e) {
				return false;//bootsrap notify server
			}
		},

		async check(store, userInfo) {
			try {
				// var taskInfo = {
				// 	username: userInfo.username,
				// 	groupName: userInfo.groupName
				// };

				let response = await Vue.http.post(setup.API + '/tasks/get', {
					username: userInfo.username,
					groupName: userInfo.groupName
				});

				if (response.data.err === 0) {
					store.commit('tasks', response.data.tasks);

					if(this.notifications)
						Vue.toast.customToast({
							title:'CheckTasksStatus:Success',
							message:'Task checked succsessful',
							type:'info'
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

							if(this.notifications)
								Vue.toast.customToast({
									title:'CheckTasksStatus:Success',
									message:'Task comitted succsessful: ' + response.data.tasks,
									type:'info'
								});
								
							console.log(response.data.tasks);
						}
					} else {
						if(this.notifications)
							Vue.toast.customToast({
								title:'CheckTasksStatus:Fail',
								message:'Task chheck failed ',
								type:'warning'
							});
					}
				}, 5000);
			} catch(e) {
				return false;//bootstrap notify server
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
							title:'DeleteTask:Success',
							message:'Task deleted succsessfuly: ' + taskId + ' from ' + groupName,
							type:'info'
						});

					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'DeleteTask:Fail',
							message:'Task not deleted',
							type:'warning'
						});

					return false;
				}
			} catch(e) {
				return false;//bootstrap notify server
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
					return true;//bootstrap notify custom
				} else {
					return false;//bootstrap notify custom
				}
			} catch(e) {
				return false;//bootstrap notify server
			}
		},

		async change(store, task) {
			try {
				let response = await Vue.http.post(setup.API + '/tasks/change/status', {
					taskId: task.taskId, 
					taskStatus: task.taskStatus, 
					groupName: task.groupName, 
					usernameReceiver: task.usernameReceiver, 
					usernameCreator: task.usernameCreator
				});
				
				if (response.data.err === 0) {
					return true;//bootstrap notify custom
				} else {
					return false;//bootstrap notify custom
				}
			} catch(e) {
				return false;//bootstrap notify server
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