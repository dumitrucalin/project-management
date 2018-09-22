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
		user: null
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
				console.log(response);
				if (response.data.token) 
					store.commit('token', response.data.token);
				return true;
			} catch (e) {
				console.log('Login fail ' + e);
				return false;
			}
		},
		async signup(store, credentials) {
			try {
				let response = await Vue.http.post(setup.API + '/users/signup', credentials);
				if (response.data.token)
					store.commit('token', response.data.token);
				return true;
			} catch (e) {
				console.log('Login fail ' + e);
				return false;
			}
		},
		async logout(store) {
			try {
				let response = await Vue.http.get(setup.API + '/users/logout');
				store.commit('token', null);
				if (response.data.err === 0) {
					return true;
				} else {
					return false;
				}
			} catch (e) {
				console.log('Logout fail ' + e);
				return false;
			}
		},
		async getUser(store, token) {
			try {
				let response = await Vue.http.get(setup.API + '/users/get/' + token);
				if (response.data.err === 0) {
					return response.data.user;
				}
				return false;
			} catch (e) {
				return false;
			}
		},
		async updateUser(store) {
			try {
				let response = await Vue.http.get(setup.API + '/users/info');
				if (response.data.err === 0) {
					store.commit('user', response.data.user);
					return true;
				} else {
					// TODO toast token expired
					store.commit('user', null);
					store.commit('token', null);
					return false;
				}
			} catch (e) {
				if (e.status === 401) {
					store.commit('user', null);
					store.commit('token', null);
				}
				// TODO toast network error
				return false;
			}
		},
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