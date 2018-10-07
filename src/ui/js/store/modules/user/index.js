var Vue = require('vue');
var setup = require('../../setup.js');

var KEY_TOKEN = 'task-manager.token';
Vue.http.interceptors.push(function(request, next) {
	if (window.localStorage.getItem(KEY_TOKEN)) {
		request.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem(KEY_TOKEN));
	}
	next();
});

module.exports = {
	namespaced: true,

	state: {
		token: window.localStorage.getItem(KEY_TOKEN),
		user: null,
		usernames: null,
		fullNames: null,
		tasks: null,
		showTasks: false,
		groupName: null
	},
	data: {
		intervalStatus: null,
		notifications:true,//To show, change to true, trebuie facut buton in dashboard
	},

	getters: {
		token(state) {
			return state.token;
		},
		user(state) {
			return state.user;
		},
		usernames(state) {
			return state.usernames;
		},
		fullNames(state) {
			return state.fullNames;
		},
		tasks(state) {
			return state.tasks;
		},
		showTasks(state) {
			return state.showTasks;
		},
		groupName(state) {
			return state.groupName;
		}
	},

	actions: {
		async login(store, credentials) {
			try {
				let response = await Vue.http.post(setup.API + '/users/login', credentials);
				if (response.data.token) {
					store.commit('token', response.data.token);
					if(this.notifications)
						Vue.toast.customToast({
							title:'Login:Success',
							message:'The token is good',
							type:'info'
						});
					return true;
				}
				if(this.notifications)
					Vue.toast.customToast({
						title:'Login:Fail',
						message:'The token is not good',
						type:'warning'
					});
				return false;
			} catch (e) {
				console.log('Login fail ' + e);//bootsrap notify
				//Login fail
				return false;
			}
		},
		async signup(store, credentials) {
			try {
				let response = await Vue.http.post(setup.API + '/users/signup', credentials);
				if (response.data.token) {
					store.commit('token', response.data.token);
					if(this.notifications)
						Vue.toast.customToast({
							title:'SignUp:Success',
							message:'The token is good',
							type:'info'
						});
					return true;
				}
				if(this.notifications)
					Vue.toast.customToast({
						title:'SignUp:Fail',
						message:'The token is not good',
						type:'warning'
					});
				return false;
			} catch (e) {
				return false;
			}
		},
		async logout(store, token) {
			try {
				let response = await Vue.http.post(setup.API + '/users/logout', token);
				store.commit('token', null);
				if (response.data.err === 0) {
					if(this.notifications)
						Vue.toast.customToast({
							title:'LogOut:Success',
							message:'Token null-ified',
							type:'info'
						});
					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'LogOut:Fail',
							message:'Could not complete the logout',
							type:'warning'
						});
					return false;
				}
			} catch (e) {
				return false;
			}
		},
		deleteToken(store) {
			store.commit('token', null);
			return true;
		},
		async getUser(store) {
			try {
				let response = await Vue.http.get(setup.API + '/users/get', store.state.token);
				if (response.data.err === 0) {
					store.commit ('user', response.data.user);
					if(this.notifications)
						Vue.toast.customToast({
							title:'GetUser:Success',
							message:'The user has been retrieved: '+ response.data.user.username,
							type:'info'
						});
					return response.data.user;
				}
				if(this.notifications)
					Vue.toast.customToast({
						title:'GetUser:Fail',
						message:'The user has not been retrieved',
						type:'warning'
					});
				return null;//bootsrap notify
			} catch (e) {
				return null;//bootsrap notify
			}
		},
		async updateUser(store) {
			try {
				let response = await Vue.http.get(setup.API + '/users/info');
				if (response.data.err === 0) {
					store.commit('user', response.data.user);
					if(this.notifications)
						Vue.toast.customToast({
							title:'UpdateUser:Success',
							message:'The user has been updated: '+ response.data.user,
							type:'info'
						});
					return true;
				} else {//bootsrap notify
					// TODO toast token expired
					if(this.notifications)
						Vue.toast.customToast({
							title:'UpdateUser:Fail',
							message:'The user token expired',
							type:'warning'
						});
					store.commit('user', null);
					store.commit('token', null);
					return false;
				}
			} catch (e) {//bootsrap notify
				if (e.status === 401) {
					store.commit('user', null);
					store.commit('token', null);
					
				}
				// TODO toast network error
				return false;//bootsrap notify
			}
		},
		async updateUserInfo(store, userInfo) {
			let response = await Vue.http.post(setup.API + '/users/update', userInfo);
			if (response.data.err === 0) {
				store.commit ('user', response.data.user);
				if(this.notifications)
					Vue.toast.customToast({
						title:'UpdateUserInfo:Success',
						message:'The user info has been updated: '+response.data.user,
						type:'info'
					});
				return true;
			} else {
				if(this.notifications)
					Vue.toast.customToast({
						title:'UpdateUserInfo:Fail',
						message:'The user info has not been updated',
						type:'warning'
					});
				return null;
			}
		},
		async sendGroup(store, groupInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/create', groupInfo);
				if (response.data.err === 0) {
					store.commit('user', response.data.user);
					if(this.notifications)
						Vue.toast.customToast({
							title:'SendGroup:Success',
							message:'The group has been sent: '+groupInfo,
							type:'info'
						});
					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'SendGroup:Fail',
							message:'The group has not been sent',
							type:'warning'
						});
					return false;//bootsrap notify
				}
			} catch(e) {
				return false;//bootsrap notify
			}
		},
		async updateGroup(store, groupInfo) {
			let response = await Vue.http.post(setup.API + '/groups/users/create', groupInfo);
			if (response.data.err === 0) {
				var newUsernames = groupInfo.usernames;
				var oldUsernames = store.getters ['usernames'];
				for (let username of oldUsernames) {
					newUsernames.push(username);
				}
				store.commit('usernames', newUsernames);

				let newResponse = await Vue.http.post(setup.API + '/users/usernames/get', {usernames: newUsernames});
				if (newResponse.data.err === 0)
					var fullNames = newResponse.data.fullNames;
				else {
					console.log(newResponse.data.message);
					if(this.notifications)
						Vue.toast.customToast({
							title:'UpdateGroup:Fail',
							message:newResponse.data.message,
							type:'warning'
						});
					return false;
				}
				store.commit('fullNames', fullNames);
				if(this.notifications)
					Vue.toast.customToast({
						title:'UpdateGroup:Success',
						message:'The group has been updated',
						type:'info'
					});
				return true;
			} else {
				return false;//bootstrap notify
			}
		},
		async sendTask(store, taskInfo) {
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
					return false;//bootsrap notify
				}
			} catch(e) {
				return false;//bootsrap notify
			}
		},
		async getUsers(store, groupName) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/users/get', {groupName: groupName});
				if (response.data.err === 0) {
					if(this.notifications)
						Vue.toast.customToast({
							title:'GetUsers:Success',
							message:'The users have been retrieved',
							type:'info'
						});
					store.commit ('usernames', response.data.usernames);
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'GetUsers:Fail',
							message:'The users have not been retrieved',
							type:'warning'
						});
					return false;
				}

				let newResponse = await Vue.http.post(setup.API + '/users/usernames/get', {usernames: response.data.usernames});
				if (newResponse.data.err === 0)
					var fullNames = newResponse.data.fullNames;
				else {
					console.log(newResponse.data.message);
					if(this.notifications)
						Vue.toast.customToast({
							title:'GetUsers:Fail',
							message:newResponse.data.message,
							type:'warning'
						});
					return false;
				}
				store.commit('fullNames', fullNames);
				if(this.notifications)
					Vue.toast.customToast({
						title:'GetUsers:Success',
						message:'Returned fullNames: '+ fullNames,
						type:'info'
					});
				return true;//bootsrap notify
			} catch (e) {
				return false;//bootsrap notify
			}
		},
		async deleteUserFromGroup(store,deleteInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/user/delete', deleteInfo);
				if(response.data.err === 0) {
					if(this.notifications)
						Vue.toast.customToast({
							title:'DeleteUserFromGroup:Success',
							message:'User ' + deleteInfo.username + ' deleted from ' + deleteInfo.groupName,
							type:'info'
						});
					return true;
				}
				if(this.notifications)
					Vue.toast.customToast({
						title:'DeleteUserFromGroup:Fail',
						message:'User ' + deleteInfo.username + ' has not been deleted from ' + deleteInfo.groupName,
						type:'warning'
					});
				return false;//bootstrap notify 
			} catch (e) {
				return false;//bootstrap notify
			}
		},
		async checkTasksStatus(store, userInfo) {
			var taskInfo = {
				username: userInfo.username,
				groupName: userInfo.groupName
			};

			let response = await Vue.http.post(setup.API + '/tasks/get', taskInfo);

			if (response.data.err === 0) {
				if(this.notifications)
					Vue.toast.customToast({
						title:'CheckTasksStatus:Success',
						message:'Task checked succsessful',
						type:'info'
					});
				store.commit ('tasks', response.data.tasks);
			}

			this.intervalStatus = setInterval( async function() {
				let response = await Vue.http.post(setup.API + '/tasks/status/get', taskInfo);

				if (response.data.err === 0) {
					if (response.data.tasksModified) {
						let response = await Vue.http.post(setup.API + '/tasks/get', taskInfo);
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
					// TODO: TOAST//bootsrap notify
				}
			}, 5000);
		},
		async deleteTask(store, taskId) {
			var groupName = store.getters['groupName'];
			let response = await Vue.http.post(setup.API + '/tasks/exist', {taskId: taskId});
			if (response.data.err === 0) {
				if(this.notifications)
					Vue.toast.customToast({
						title:'DeleteTask:Success',
						message:'Task deleted succsessfuly: ' + taskId + ' from ' + groupName,
						type:'info'
					});
				await Vue.http.post(setup.API + '/tasks/delete', {taskId: taskId, groupName: groupName});
			} else {
				if(this.notifications)
					Vue.toast.customToast({
						title:'DeleteTask:Fail',
						message:'Task not deleted',
						type:'warning'
					});
			}
			
		},
		async deleteTaskId(store, taskIdInfo) {
			let response = await Vue.http.post(setup.API + '/groups/task/delete', {taskId: taskIdInfo.taskId, groupName: taskIdInfo.groupName, username: taskIdInfo.username});
			if (response.data.err === 0) {
				return true;
			} else {
				return false;
			}
		},
		setGroupName(store, groupName) {
			store.commit('groupName', groupName);
		},
		stopCheckTasksStatus() {
			clearInterval(this.intervalStatus);
		},
		changeTasksView(store, viewTasks) {
			store.commit('showTasks', viewTasks);
		},
		async checkUsername(store, username) {
			let response = await Vue.http.post(setup.API + '/users/check/name', {username: username});
			if (response.data.err === 0) {
				if(this.notifications)
					Vue.toast.customToast({
						title:'CheckUsername:Success',
						message:'Username returned',
						type:'info'
					});
				return true;
			} else {
				if(this.notifications)
					Vue.toast.customToast({
						title:'CheckUsername:Fail',
						message:'Username no returned',
						type:'warning'
					});
				return false;
			}
		},
		async changeTaskStatus(store, task) {
			let response = await Vue.http.post(setup.API + '/tasks/change/status', {
				taskId: task.taskId, 
				taskStatus: task.taskStatus, 
				groupName: task.groupName, 
				usernameReceiver: task.usernameReceiver, 
				usernameCreator: task.usernameCreator
			});
			
			if (response.data.err === 0) {
				return true;//bootstrap
			} else {
				return false;//bootstrap
			}
		}
	},
	
	mutations: {
		token(state, value) {
			if (value !== null) {
				window.localStorage.setItem(KEY_TOKEN, value);
				state.token = value;
			} else {
				window.localStorage.removeItem(KEY_TOKEN);
				state.token = undefined;
			}
		},
		user(state, value) {
			state.user = value;
		},
		usernames(state, value) {
			state.usernames = value;
		},
		fullNames(state, value) {
			state.fullNames = value;
		},
		tasks(state, value) {
			state.tasks = value;
		},
		showTasks(state, value) {
			state.showTasks = value;
		},
		groupName(state, value) {
			state.groupName = value;
		}
	}
};