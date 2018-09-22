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
		};
	},

	methods: {
		async logout() {
			let logout = await this.$store.dispatch('user/logout');
			if (logout)
				await this.$store.dispatch('settings/redirect', 'LOGIN');
		}
	},
};

</script>