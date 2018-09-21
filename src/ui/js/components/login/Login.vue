<template>
	<div>
		<div class="loginForm">
			<input type="text" class="inputDesign" placeholder="Username" @keyup.enter="login" v-model="username" />
			<input type="text" class="inputDesign" placeholder="Password" @keyup.enter="login" v-model="password" />
			<button class="submitButton" name="Submit" value="Login"  @click="login" >Login</button>
		</div>
		<div v-if="incorrectLogin">
			<p>The credintials are incorrect</p>
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
			incorrectLogin: false,
			next: urlParams.get ('redirect')
		};
	},

	methods: {
		async login () {
			let login = await this.$store.dispatch ('user/login', {
				username: this.username,
				password: this.password
			});

			if (login)
				await this.$store.dispatch ('settings/redirect', this.next);
			else {
				this.incorrectLogin = true;
				console.log('Incorrect credentials');
				this.username = '';
				this.password = '';
			}
		}
	},
};

</script>