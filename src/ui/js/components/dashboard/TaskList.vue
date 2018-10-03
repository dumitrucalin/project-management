<template>
	<div>
		<div v-if="tasks" class="taskList">
			<p>This is the Task View</p>
			<p>Hello Tasker mister fucker mother you</p>
		</div>
		<div v-else>
			<Loading :size="loadingSize" :color="loadingColor" :duration="loadingDuration" />
		</div>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;
var Loading = require ('../Loading.vue');

module.exports = {
	name: 'TaskList',
	
	data() {
		return {

		};
	},

	components: {
		Loading
	},

	computed: {
		...mapGetters ({
			tasks: 'user/tasks'
		})
	}
};

</script>