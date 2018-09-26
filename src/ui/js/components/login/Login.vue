<template>
	<div>
		<div class="loginForm">
			<input type="text" class="inputDesign" placeholder="Username" @keyup.enter="login" v-model="username" />
			<input type="text" class="inputDesign" placeholder="Password" @keyup.enter="login" v-model="password" />
			<button class="submitButton" name="Submit" value="Login"  @click="login" >Login</button>
			<a href="signup.html" >Sign Up</a>
		</div>
	</div>
</template>

<script>

module.exports = {
	name: 'Login',
	
	data() {
		var urlParams = new URLSearchParams(window.location.search);
		return {
			username: '',
			password: '',
			next: urlParams.get ('redirect')
		};
	},

	methods: {
		async login () {
			if (this.next === '' || this.next === null)
				this.next = 'DASHBOARD';
				
			let login = await this.$store.dispatch ('user/login', {
				username: this.username,
				password: this.password
			});

			if (login)
				await this.$store.dispatch ('settings/redirect', this.next);
			else {
				console.log('Incorrect credentials');
				this.username = '';
				this.password = '';
			}
		},
	},
};

</script>