<template>
	<div>
		<div class="signupForm">
			<input type="text" class="inputDesign" placeholder="Username" @keyup.enter="signup" v-model="username" />
			<input type="text" class="inputDesign" placeholder="Password" @keyup.enter="signup" v-model="password" />
			<input type="text" class="inputDesign" placeholder="Confirm Password" @keyup.enter="signup" v-model="confirmPassword" />
			<input type="text" class="inputDesign" placeholder="Full Name" @keyup.enter="signup" v-model="fullName" />
			<input type="text" class="inputDesign" placeholder="E-mail" @keyup.enter="signup" v-model="email" />
			<button class="submitButton" name="Submit" value="Signup"  @click="signup" >Sign Up</button>
			<a href="login.html" >Log In</a>
		</div>
	</div>
</template>

<script>

var validator = require('validator');
var Vue = require('vue');
module.exports = {
	name: 'Signup',
	data() {
		return {
			username: '',
			password: '',
			confirmPassword: '',
			email: '',
			fullName: '',
			matchingPasswords: {
				title: 'The passwords do not match',
				message: 'Please insert your password again',
				type: 'warning'
			},
			notEmail: {
				title: 'That is not an email',
				message: 'Please insert a valid email adress',
				type: 'warning'
			},
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

		};
	},

	methods: {
		async signup () {
			if (validator.isAlphanumeric(this.username, ['en-US'])) {
				if (validator.isAlphanumeric(this.password, ['en-US'])) {
					if (validator.isEmail(this.email, ['en-US'])) {
						if (this.password === this.confirmPassword) {
							let signup = await this.$store.dispatch ('user/signup', {
								username: this.username,
								password: this.password,
								fullName: this.fullName,
								email: this.email
							});

							if (signup) {
								await this.$store.dispatch ('settings/redirect', 'DASHBOARD');
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
							console.log('The passwords do not match');
							Vue.toast.customToast(this.matchingPasswords);
						}
					} else {
						this.email = '';
						console.log('That is not an email');
						Vue.toast.customToast(this.notEmail);
					}
				} else {
					this.password = '';
					this.confirmPassword = '';
					console.log('Password contains invalid characters');
					Vue.toast.customToast(this.wrongPassword);
				}
			} else {
				this.username = '';
				console.log('Username contains invalid characters');
				Vue.toast.customToast(this.wrongUsername);
			}
		},

	},
};

</script>