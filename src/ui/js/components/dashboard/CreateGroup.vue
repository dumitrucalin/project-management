<template>
	<div class="createGroup">
		<p>This is the group creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<!--<button class="submitButton" name="Submit" value="Logout" >Logout</button>-->
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;

module.exports = {
	name: 'CreateGroup',
	
	data() {
		return {
			group: true,
			task: false,
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		/*async submit(){

		}*/
	},
};

</script>