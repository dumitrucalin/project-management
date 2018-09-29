<template>
	<div class="createTask">
		<p>This is the task creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the task creator!</p>
		<form>
			<div class="form-group">
				<input id="task-Title" type="text" class="form-control input-sm chat-input"  placeholder="Task Title" v-model="taskTitle" />
			</div>
			<div class="form-group">
				<textarea name="message" rows="10" cols="30">Input your task.
				Here is text.
				here is not text.
				</textarea>
			</div>
			<div class="form-group">
				<input id="user-Rec" type="text" class="form-control input-sm chat-input"  placeholder="Designated User" v-model="userRec" />
			</div>
				<form id="options">
					<input type="text" name="GroupName" class="form-control input-sm chat-input" placeholder="Group Name"><br>
					<input type="checkbox" name="Status" onchange="changeDeadline()"><br>
					<input :v-if="checkboxDeadline" type="date" name="DeadLine" ><br>
					<input type="checkbox" name="Status" onchange="changeStatus()"><br>
					<form :v-if="checkboxStatus">
						<input type="checkbox" name="Urgent">
						<input type="checkbox" name="Moderate">
						<input type="checkbox" name="At leisure">
					</form>
				</form>
			<button type="submit">Create Task</button>
		</form>
	</div>
</template>

<script>

var mapGetters = require ('vuex').mapGetters;

module.exports = {
	name: 'CreateTask',
	
	data() {
		return {
			checkboxStatus:false,
			checkboxDeadline:false,
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		changeDeadline:function(){
			this.checkboxDeadline=!this.checkboxDeadline;
		},
		changeStatus:function(){
			this.checkboxStatus=!this.checkboxStatus;
		}
	},
};

</script>