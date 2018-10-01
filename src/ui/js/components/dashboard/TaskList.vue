<template>
	<div class="taskList">
		<p>This is the Task View</p>
		<p>Hello Tasker mister fucker mother you</p>
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
			tasks: 'user/tasks'
		})
	}
};

</script>