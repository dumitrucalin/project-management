<template>
	<div>
		<div class="dashboard">
			<p>This is the dashboard!</p>
			<button class="submitButton" name="Submit" value="Logout"  @click="logout" >Logout</button>
		</div>
	</div>
</template>

<script>

module.exports = {
	name: 'Dashboard',
	
	data() {
		return {
			token: ''
		};
	},

	methods: {
		async logout() {
			this.token = await this.$store.getters['user/token'];
			let logout = await this.$store.dispatch('user/logout', {
				token: this.token
			});
			if (logout)
				await this.$store.dispatch('settings/redirect', 'LOGIN');
		}
	},
};

</script>