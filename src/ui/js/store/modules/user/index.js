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
		usernames(state){
			return state.usernames;
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
		async sendGroup(store, groupInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/create', groupInfo);
				if (response.data.err === 0) {
					store.commit('user',response.data.user);
					return true;
				} else {
					return false;//bootsrap notify
				}
			} catch(e) {
				return false;//bootsrap notify
			}
		},
		async sendTask(store, taskInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/tasks/create', taskInfo);
				if (response.data.err === 0) {
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
				let response = await Vue.http.post(setup.API + '/groups/users/get', groupName);
				if (response.data.err === 0) {
					store.commit ('usernames', response.data.users);
					return response.data.users;
				}
				return null;//bootsrap notify
			} catch (e) {
				return null;//bootsrap notify
			}
		},
		async deleteUserFromGroup(deleteInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/groups/user/delete', deleteInfo);
				if(response.data.err === 0) {
					return response.data.err;
				}
				return null;//bootstrap notify 
			} catch (e) {
				return null;//bootstrap notify
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
						let response = await Vue.http.post(setup.API + '/tasks/get');
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
			let response = await Vue.http.post(setup.API + '/tasks/exist', {taskId});
			if (response.data.err === 0) {
				await Vue.http.post(setup.API + '/tasks/delete', {taskId, groupName});
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