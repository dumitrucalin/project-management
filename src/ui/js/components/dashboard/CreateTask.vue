<template>
	<div class="createTask">
		<p>This is the task creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the task creator!</p>
		<form>
			<div class="form-group">
				<input id="task-Title" type="text" class="form-control input-sm chat-input"  placeholder="Task Title" v-model="taskInfo.taskTitle" />
			</div>
			<div class="form-group">
				<textarea name="message" rows="10" cols="30" v-model="taskInfo.taskString">Input your task.</textarea>
			</div>
			<div class="form-group">
				<input id="user-Rec" type="text" class="form-control input-sm chat-input"  placeholder="Designated User" v-model="userRec" />
			</div>
				<form id="options">
					<select>
					<div>Group</div><option v-for="(item, index) in this.user.groupNames" :key="index">{{item}}</option>
					</select><br>

					<div>DeadLine</div><input type="checkbox" @click="changeDeadline()">
					<input v-if="this.checkboxDeadline" type="date" name="DeadLine"><br>

					<div>Status</div><input type="checkbox" @click="changeStatus()">
					<select v-if="this.checkboxStatus">
						<option name="Urgent">Urgent</option>
						<option name="Moderate">Moderate</option>
						<option name="At leisure">At leisure</option>
					</select>
				</form>
			<button type="submit" @click="submitTask">Create Task</button>
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
			taskInfo:{
				taskTitle:'',
				taskString:'',
			}
		};
	},

	computed: {
		...mapGetters ({
			user: 'user/user'
		})
	},

	methods: {
		changeDeadline: function() {
			this.checkboxDeadline = !this.checkboxDeadline;
		},
		changeStatus: function() {
			this.checkboxStatus = !this.checkboxStatus;
		},
		async submitTask(){
			await this.$store.dispatch ('user/sendTask', {
				taskInfo:this.taskInfo,
			});
		},
	}
};

</script>