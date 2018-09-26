<template>
	<div v-if="user">
		<div class="dashboard">
			<p>This is the dashboard!</p>
			<p>Hello {{ this.user.fullName }}</p>
			<button class="submitButton" name="Submit" value="Logout"  @click="logout" >Logout</button>
		</div>
	</div>
	<div v-else>
		Loading
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;

module.exports = {
	name: 'Dashboard',
	
	data() {
		return {
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		async logout() {
			let token = await this.$store.getters['user/token'];
			let logout = await this.$store.dispatch('user/logout', {
				token: token
			});
			if (logout)
				await this.$store.dispatch('settings/redirect', 'LOGIN');
		}
	},
};

</script>