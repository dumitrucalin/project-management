<template>
	<div class="signupForm">
		<link href="https://fonts.googleapis.com/css?family=Aclonica|Cabin+Sketch|Salsa" rel="stylesheet">
		<input type="text" class="form-control" id="username" placeholder="Username" @keyup.enter="signup" v-model="username" />
		<input type="password" id="password" class="form-control" placeholder="Password" @keyup.enter="signup" v-model="password" />
		<input type="password" id="confirmPassword" class="form-control" placeholder="Confirm Password" @keyup.enter="signup" v-model="confirmPassword" />
		<input type="checkbox" class="form-control" id="viewPassword" v-model="viewPassword" @click="togglePassword" />View Password<br>
		<input type="text" class="form-control" id="fullname" placeholder="Full Name" @keyup.enter="signup" v-model="fullName" />
		<input type="text" class="form-control" id="email" placeholder="E-mail" @keyup.enter="signup" v-model="email" />
		<button type="button" class="btn btn-dark" name="Submit" value="Signup"  @click="signup" >Sign Up</button>
		<a href="login.html" style="text-decoration:none" >Log In</a>
		<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" v-if="loadingView"/>
	</div>
</template>

<script>

var Loading = require('../Loading.vue');
var validator = require('validator');
var Vue = require('vue');

module.exports = {
	name: 'Signup',

	components: {
		Loading
	},

	data() {
		return {
			username: '',
			password: '',
			confirmPassword: '',
			viewPassword: false,
			email: '',
			fullName: '',

			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,
			loadingView: false,

			matchingPasswords: {
				title: 'Checking the Password: Fail',
				message: 'The passwords do not match.',
				type: 'warning'
			},
			notEmail: {
				title: 'Checking the E-mail: Fail',
				message: 'The e-mail address is not valid.',
				type: 'warning'
			},
			wrongPassword: {
				title: 'Checking the Password: Fail',
				message: 'The password contains invalid characters.',
				type: 'warning'
			},
			wrongUsername: {
				title: 'Checking the Username: Fail',
				message: 'The username contains invalid characters.',
				type: 'warning'
			},

		};
	},

	methods: {
		async signup() {
			if (validator.isAlphanumeric(this.username, ['en-US'])) {
				if (validator.isAlphanumeric(this.password, ['en-US'])) {
					if (validator.isEmail(this.email, ['en-US'])) {
						if (this.password === this.confirmPassword) {
							this.loadingView = true;

							let state = await this.$store.dispatch('user/signup', {
								username: this.username,
								password: this.password,
								fullName: this.fullName,
								email: this.email
							});
							this.loadingView = false;

							if (state) {
								await this.$store.dispatch('settings/redirect', 'LOGIN');
							} else {
								this.username = '';
								this.password = '';
								this.confirmPassword = '';
								this.fullName = '';
								this.email = '';
							}
						} else {
							this.password = '';
							this.confirmPassword = '';
							Vue.toast.customToast(this.matchingPasswords);
						}
					} else {
						this.email = '';
						Vue.toast.customToast(this.notEmail);
					}
				} else {
					this.password = '';
					this.confirmPassword = '';
					Vue.toast.customToast(this.wrongPassword);
				}
			} else {
				this.username = '';
				Vue.toast.customToast(this.wrongUsername);
			}
		},

		togglePassword() {
			var password = document.getElementById('password');
			var confirmPassword = document.getElementById('confirmPassword');

			if (this.viewPassword) {
				password.setAttribute('type', 'password');
				confirmPassword.setAttribute('type', 'password');
			} else {
				password.setAttribute('type', 'text');
				confirmPassword.setAttribute('type', 'text');
			}
		}
	}
};

</script>