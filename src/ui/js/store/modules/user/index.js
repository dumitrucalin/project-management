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
	},

	getters: {
		token(state) {
			return state.token;
		},
		user(state) {
			return state.user;
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
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'Login:Fail',
							message:'The token is not good',
							type:'warning'
						});

					return false;
				}
			} catch (e) {
				return false;//bootstrap notify server
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
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'SignUp:Fail',
							message:'The token is not good',
							type:'warning'
						});

					return false;
				}
			} catch (e) {
				return false;//bootstrap notify server
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
				return false;//bootstrap notify server
			}
		},

		token(store) {
			store.commit('token', null);
			return true;
		},

		async get(store) {
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
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title:'GetUser:Fail',
							message:'The user has not been retrieved',
							type:'warning'
						});

					return null;
				}
			} catch (e) {
				return null;//bootsrap notify server
			}
		},

		async update(store, userInfo) {
			try {
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

					return false;
				}
			} catch (e) {
				return false;//bootstrap notify server
			}
		},

		async check(store, username) {
			try {
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
			} catch (e) {
				return false;//bootstrap notify server
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
		}
	}
};