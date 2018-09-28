<template>
	<div class="taskList">
		<p>This is the Task View</p>
		<p>Hello Tasker mister fucker mother{{ this.user.fullName }}</p>
		<!--<button class="submitButton" name="Submit" value="Logout" >Logout</button>-->
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;

module.exports = {
	name: 'TaskList',
	
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