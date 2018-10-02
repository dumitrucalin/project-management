# task-manager

TODO: 
	UI:
		- Loading icon
		- To access the given tasks, you have to console.log the response.data.tasks, and then you will see the structure
		- Regex and fail safes for create group page + bootstrap notify
		- Send the selected group from dashboard.vue to dashboard.js through reload and URL

	SERVER:
		- Route to send the users in a specifc group
		- Try/catch ?
		- Implement with redis -> put in npm install

	IDEAS:
		- Messages per task (like a mini watsapp)
		- A given task can be assigned to multiple persons, and one of them has to take it
            - The creator user can delete tge given task
            - Have sticky notes per user/task (choose one of the 2)
            - Send mails when approaching the deadline or when task deleted
