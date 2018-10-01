<template>
	<div class="createTask">
		<p>This is the task creator!</p>
		<p>Hello {{ this.user.fullName }}</p>
		<p>This is the task creator!</p>
		<form>
			<div class="form-group">
				<input id="task-Title" type="text" class="form-control input-sm chat-input"  placeholder="Task Title" v-model="taskName" />
			</div>
			<div class="form-group">
				<textarea name="message" rows="10" cols="30" v-model="taskString">Input your task.</textarea>
			</div>
			<div class="form-group">
				<input id="user-Rec" type="text" class="form-control input-sm chat-input"  placeholder="Designated User" v-model="usernameReceiver" />
			</div>
				<form id="options">
					<select v-model="groupName">
					<div>Group</div><option v-for="(item, index) in this.user.groupNames" :key="index" :value="item">{{item}}</option>
					</select><br>

					<div>DeadLine</div><input type="checkbox" @click="changeDeadline()">
					<input v-if="checkboxDeadline" type="date" name="DeadLine"><br>

					<div>Status</div><input type="checkbox" @click="changeStatus()">
					<select v-if="checkboxStatus" v-model="taskPriority">
						<option name="Urgent" value="urgent">Urgent</option>
						<option name="Moderate" value="moderate">Moderate</option>
						<option name="At leisure" value="atLeisure">At leisure</option>
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
			checkboxStatus: false,
			checkboxDeadline: false,
			usernameCreator:'',
			usernameReceiver:'',
			groupName:'',
			taskName:'',
			taskString:'',
			taskPriority:'',

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
			console.log(this.user.username);
			console.log(this.usernameReceiver);
			console.log(this.groupName);
			console.log(this.taskName);
			console.log(this.taskString);
			console.log(this.taskPriority);
			
		},
		changeStatus: function() {
			this.checkboxStatus = !this.checkboxStatus;
		},
		async submitTask(){
			await this.$store.dispatch ('user/sendTask', {
				usernameCreator:this.user.username,
				usernameReceiver:this.usernameReceiver,
				groupName:this.groupName,
				taskName:this.taskName,
				taskString:this.taskString,
				taskPriority:this.taskPriority,
			});
		},
	}
};

</script>