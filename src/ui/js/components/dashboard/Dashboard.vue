<template>
	<div>
		<div class="dashboard">
			<p>This is the dashboard!</p>
			<p>Hello {{ name }}</p>
			<button class="submitButton" name="Submit" value="Logout"  @click="logout" >Logout</button>
		</div>
	</div>
</template>

<script>



// var mapGetters = require ('vuex').mapGetters;
// TODO: INCLUDE MAPGETTERS

module.exports = {
	name: 'Dashboard',
	
	data() {
		return {
			token: '',
			name: ''
		};
	},

	// computed: {
	// 	...mapGetters ({
	// 		fullName: 'signup/fullName'
	// 	})
	// },

	methods: {
		async logout() {
			this.token = await this.$store.getters['user/token'];
			this.name = await this.$store.getters['user/fullName'];
			let logout = await this.$store.dispatch('user/logout', {
				token: this.token
			});
			if (logout)
				await this.$store.dispatch('settings/redirect', 'LOGIN');
		}
	},
};

</script>