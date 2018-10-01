# task-manager

TODO: 
	UI:
		- Regexes for signUp
		- Loading icon
		- Buttons from Dashboard: 
			- Create group: 
				.group name -form stabil
				.an array of users -form cu buton si lista de afisat. Onclick reset nume adauga string
			- Create task:
				.task title
				.task string
				.username receiver
				.groupname -> option
				.priority -> option
				.with/out deadline -> option
				.with/out status -> option
		- To access the given tasks, you have to console.log the response.data.tasks, and then you will see the structure
		- Regex and fail safes for create group page
		- Make a mapGetter for the tasks list (calin)

	SERVER:
		- Unhardcode group when get tasks
		- How to delete taskId from users list in group
		- Try/catch ?
		- Implement with redis -> put in npm install
