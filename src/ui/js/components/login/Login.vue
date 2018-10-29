
<template>
<div class="container">
	<div id="content">
		<div class="hexagon">
			<link href="https://fonts.googleapis.com/css?family=Aclonica|Cabin+Sketch|Salsa" rel="stylesheet">
			<input type="text" class="input1" placeholder="Username" @keyup.enter="login" v-model="username" /><br>
			<input type="password" class="input2" placeholder="Password" @keyup.enter="login" v-model="password" /><br>
			<input type="checkbox" class="input3" v-model="viewPassword" @click="togglePassword" />View Password<br>
			<button type="button" class="btn btn-primary" name="Submit" value="Login"  @click="login" >Login</button>
			<a href="signup.html" >Sign Up</a>
			
		</div>
		<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" v-if="loadingView"/>
	</div>
</div>
</template>

<script>

var Loading = require('../Loading.vue');
var validator = require('validator');
var Vue = require('vue');

module.exports = {
	name: 'Login',

	components: {
		Loading
	},
	
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
				title: 'Checking the Password: Fail',
				message: 'The password contains invalid characters.',
				type: 'warning'
			},
			wrongUsername: {
				title: 'Checking the Username: Fail',
				message: 'The username contains invalid characters.',
				type: 'warning'
			}
		};
	},

	methods: {
		async login() {
			if (this.next === '' || this.next === null)
				this.next = 'DASHBOARD';

			if (validator.isAlphanumeric(this.username, ['en-US'])) {
				if (validator.isAlphanumeric(this.password, ['en-US'])) {
					this.loadingView = true;

					let state = await this.$store.dispatch('user/login', {
						username: this.username,
						password: this.password
					});
					this.loadingView = false;

					if (state)
						await this.$store.dispatch('settings/redirect', this.next);
				} else {
					Vue.toast.customToast(this.wrongPassword);
				}
			} else {
				Vue.toast.customToast(this.wrongUsername);
			}

			this.username = '';
			this.password = '';
		},

		togglePassword() {
			var input = document.getElementById('password');

			if (this.viewPassword)
				input.setAttribute('type', 'password');
			else
				input.setAttribute('type', 'text');
		}
	}
};

</script>