<template>
	<div class="task">
		<h5>Welcome to TaskManager2018</h5>
		<p>This is the Task View</p>
		<p>Hello Tasker mister fucker mother{{ this.user.fullName }}</p>
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