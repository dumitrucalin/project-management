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
					return true;
				} else {
					Vue.toast.customToast({
						title: 'Login: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch (error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async signup(store, credentials) {
			try {
				let response = await Vue.http.post(setup.API + '/users/signup', credentials);

				if (response.data.token) {
					store.commit('token', response.data.token);
					return true;
				} else {
					Vue.toast.customToast({
						title: 'Sign Up: Fail',
						message: 'Your user couldn\'t be created.',
						type: 'warning'
					});

					return false;
				}
			} catch (error) {
				Vue.toast.serverErrorToast(error);
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
					Vue.toast.customToast({
						title: 'Log Out: Fail',
						message: 'Could not complete the logout.',
						type: 'warning'
					});

					return false;
				}
			} catch (error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		token(store) {
			store.commit('token', null);
			return true;
		},

		async get(store) {
			try {
				let response = await Vue.http.post(setup.API + '/users/get', store.state.token);

				if (response.data.err === 0) {
					store.commit ('user', response.data.user);
					return response.data.user;
				} else {
					Vue.toast.customToast({
						title: 'Get the User:Fail',
						message: response.data.message,
						type: 'warning'
					});

					return null;
				}
			} catch (error) {
				Vue.toast.serverErrorToast(error);
				return null;
			}
		},

		async update(store, userInfo) {
			try {
				let response = await Vue.http.post(setup.API + '/users/update', userInfo);

				if (response.data.err === 0) {
					store.commit ('user', response.data.user);

					if(this.notifications)
						Vue.toast.customToast({
							title: 'Update Personal Informations: Success',
							message: 'The personal informations have been updated.',
							type: 'info'
						});

					return true;
				} else {
					if(this.notifications)
						Vue.toast.customToast({
							title: 'Update Personal Informations: Fail',
							message: response.data.message,
							type: 'warning'
						});

					return false;
				}
			} catch (error) {
				Vue.toast.serverErrorToast(error);
				return false;
			}
		},

		async check(store, username) {
			try {
				let response = await Vue.http.post(setup.API + '/users/check/name', {username: username});

				if (response.data.err === 0) {
					return true;
				} else {
					Vue.toast.customToast({
						title: 'Checking the Username: Fail',
						message: response.data.message,
						type: 'warning'
					});

					return false;
				}
			} catch (error) {
				Vue.toast.serverErrorToast(error);
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
		}
	}
};