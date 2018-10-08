<template>
	<div class="hexagon">
		<input type="text" id="inputDesign" placeholder="Username" @keyup.enter="login" v-model="username" />
		<input type="password" id="inputDesign" class="inputDesign" placeholder="Password" @keyup.enter="login" v-model="password" />
		<input id="checkyBox" type="checkbox" v-model="viewPassword" @click="togglePassword" />View Password
		<button class="submitButton" name="Submit" value="Login"  @click="login" >Login</button>
		<a href="signup.html" >Sign Up</a>
		<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" v-if="loadingView"/>
	</div>
</template>

<script>

var Loading = require ('../Loading.vue');
var validator = require('validator');
var Vue = require ('vue');

module.exports = {
	name: 'Login',
	
	data() {
		var urlParams = new URLSearchParams(window.location.search);
		return {
			username: '',
			password: '',
			viewPassword: false,

			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,
			loadingView: false,
			
			next: urlParams.get ('redirect'),
			
			wrongPassword: {
				title: 'Password contains invalid characters',
				message: 'Please insert your password again',
				type: 'warning'
			},
			wrongUsername: {
				title: 'Username contains invalid characters',
				message: 'Please insert your username again',
				type: 'warning'
			},
			wrongLogIn: {
				title: 'Incorrect Log In!',
				message: 'Please insert your username and password again.',
				type: 'warning'
			},
		};
	},

	components: {
		Loading
	},

	methods: {
		async login () {
			if (this.next === '' || this.next === null)
				this.next = 'DASHBOARD';

			if (validator.isAlphanumeric(this.username, ['en-US'])) {
				if (validator.isAlphanumeric(this.password, ['en-US'])) {
					this.loadingView = true;

					let login = await this.$store.dispatch ('user/login', {
						username: this.username,
						password: this.password
					});
					this.loadingView = false;

					if (login)
						await this.$store.dispatch ('settings/redirect', this.next);
					else {
						this.username = '';
						this.password = '';
						Vue.toast.customToast(this.wrongLogIn);
					}
				} else {
					this.username = '';
					this.password = '';
					Vue.toast.customToast(this.wrongPassword);
				}
			} else {
				this.username = '';
				this.password = '';
				Vue.toast.customToast(this.wrongUsername);
			}
		},
		togglePassword () {
			var input = document.getElementById('password');
			if (this.viewPassword === true)
				input.setAttribute('type', 'password');
			else
				input.setAttribute('type', 'text');
		}
	},
};

</script>