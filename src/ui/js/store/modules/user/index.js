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
		intervalStatus: null
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
					return true;
				}
				return false;
			} catch (e) {
				console.log('Login fail ' + e);//bootsrap notify
				return false;
			}
		},
		async signup(store, credentials) {
			try {
				let response = await Vue.http.post(setup.API + '/users/signup', credentials);
				if (response.data.token) {
					store.commit('token', response.data.token);
					return true;
				}
				return false;
			} catch (e) {
				console.log('Sign up fail ' + e);//bootsrap notify
				return false;
			}
		},
		async logout(store, token) {
			try {
				let response = await Vue.http.post(setup.API + '/users/logout', token);
				store.commit('token', null);
				if (response.data.err === 0) {
					return true;
				} else {
					return false;
				}
			} catch (e) {
				console.log('Logout fail ' + e);//bootsrap notify
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
					return response.data.user;
				}
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
					return true;
				} else {//bootsrap notify
					// TODO toast token expired
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
				return true;
			} else {
				return null;
			}
		},
		async sendGroup(store, groupInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/create', groupInfo);
				if (response.data.err === 0) {
					store.commit('user', response.data.user);
					return true;
				} else {
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
					return false;
				}
				store.commit('fullNames', fullNames);
				return true;
			} else {
				return false;//bootstrap notify
			}
		},
		async sendTask(store, taskInfo) {
			try {
				this.$set(taskInfo, 'taskPriority', 'moderate');
				console.log(taskInfo);
				setTimeout(function() {
					console.log('aici sunt in index');
				}, 4000);
				let response = await Vue.http.post(setup.API + '/tasks/create', taskInfo);
				if (response.data.err === 0) {
					console.log('got it');
					return true;
				} else {
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
					store.commit ('usernames', response.data.usernames);
				} else {
					return false;
				}

				let newResponse = await Vue.http.post(setup.API + '/users/usernames/get', {usernames: response.data.usernames});
				if (newResponse.data.err === 0)
					var fullNames = newResponse.data.fullNames;
				else {
					console.log(newResponse.data.message);
					return false;
				}
				store.commit('fullNames', fullNames);
				return true;//bootsrap notify
			} catch (e) {
				return false;//bootsrap notify
			}
		},
		async deleteUserFromGroup(store,deleteInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/user/delete', deleteInfo);
				if(response.data.err === 0) {
					return true;
				}
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
				store.commit ('tasks', response.data.tasks);
			}

			this.intervalStatus = setInterval( async function() {
				let response = await Vue.http.post(setup.API + '/tasks/status/get', taskInfo);

				if (response.data.err === 0) {
					if (response.data.tasksModified) {
						let response = await Vue.http.post(setup.API + '/tasks/get', taskInfo);
						store.commit('tasks', response.data.tasks);
						console.log(response.data.tasks);
					}
				} else {
					// TODO: TOAST//bootsrap notify
				}
			}, 1000);
		},
		async deleteTask(store, taskId) {
			var groupName = store.getters['groupName'];
			let response = await Vue.http.post(setup.API + '/tasks/exist', {taskId: taskId});
			if (response.data.err === 0) {
				await Vue.http.post(setup.API + '/tasks/delete', {taskId: taskId, groupName: groupName});
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
				return true;
			} else {
				return false;
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