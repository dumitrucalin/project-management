# task-manager

TODO: 
	UI:
		- Loading icon
		- To access the given tasks, you have to console.log the response.data.tasks, and then you will see the structure
		- Regex and fail safes for create group page + bootstrap notify//alfanumeric //
		- Send the selected group from dashboard.vue to dashboard.js through reload and URL
		- https://stackoverflow.com/questions/41501920/is-it-possible-to-trigger-a-function-upon-a-vue-data-element-change (cu porcaria asta o sa facem reload-ul de task-uri in functie de grupul selectat)
		- Check the order of loads of the tasks and the user
		- The tasksUpdate function shoul not be call again, and it's variable should be taken from the sotre maybe
		-rute in CreateGroup pentru a verifica daca un user exista si daca GroupName e unic
		-v-if select group la tasklist diferit de 0.
		-buton iesit din grup

	SERVER:
		- Try/catch ?
		- Implement token with redis

	IDEAS:
        5. Messages per task (like a mini watsapp
        4. A given task can be assigned to multiple persons, and one of them has to take it
        1. The creator user can delete the given task
        3. Have sticky notes per user/task (choose one of the 2)
        2. Send mails when approaching the deadline or when task deleted
