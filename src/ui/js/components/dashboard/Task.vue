<template>
	<div class="task">
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the task creator!</p>
		<!--<button class="submitButton" name="Submit" value="Logout" >Logout</button>-->
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;

module.exports = {
	name: 'Task',
	
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
		/*async submit(){

		}*/
	},
};

</script>