<template>
	<div>
		<div v-if="tasks" class="taskList">
			<p>This is the Task View</p>
			<p @click="showTasks">Hello Tasker mister fucker mother you</p>
			<div>
				Tasks Received
				<ul>
					<li v-for="(task,index) in this.tasks.tasksReceived" :key=index>
						<h3>{{task.taskName}}</h3>
						<h5>{{task.usernameCreator}}</h5>
						<p>{{task.taskString}}</p>
						<p>{{task.taskPriority}}</p>
					</li>
				</ul>
				<br><br>Tasks Given
				<ul>
					<li v-for="(task,index) in this.tasks.tasksGiven" :key=index>
						<h3>{{task.taskName}}</h3>
						<h5>{{task.usernameCreator}}</h5>
						<p>{{task.taskString}}</p>
						<p>{{task.taskPriority}}</p>
					</li>
				</ul>
			</div>
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
			loadingSize: 20,
			loadingColor: '#0000ff',
			loadingDuration: 1500,
		};
	},

	components: {
		Loading
	},
	methods:{
		showTasks(){
			console.log(this.tasks);
		}
	},

	computed: {
		...mapGetters ({
			tasks: 'user/tasks'
		})
	}
};

</script>