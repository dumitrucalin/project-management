# task-manager

TODO: 
	UI (ce are - si * inseamna ca il pot face si eu, ce are doar - poti face doar tu):
		- * nu imi arata bine numele din taskList
		- * getUsers se apeleaza de 2 ori la reload de dashboard
		- * eventual sa iti arate la users fullname-ul, si nu username-ul
		- * functia pentru butonul de parasire a grupului in settings.vue && validator pentru exitGroup din settings
		- un singur tabel pentru tasksList
		- fiecare celula din tasksList trebuie sa contina atat titlurile corespondente task-urilor, cat si valorile, nu doua linii separate (daca nu ai inteles exact, intreaba-ma!!!!!!!!!)
		- am mutat selectul de group din dashboard in tasksList. La el, vreau by default sa fie selectat primul grup din lista de grupuri a acelui user, "user.groupNames[0]"
		- * bootstrap notify pe index.js

	SERVER:
		- To update and send only the new tasks, and not all of them
		- To implement the rest of the details about the task
		- Try/catch ?
		- Implement token with redis

	IDEAS:
        1. A given task can be assigned to multiple persons, and one of them has to take it -> reassigment of task will be used in case of deleting a user
		2. (SERVER) To send only the new tasks to the user, not all of them, when the task list has changed
        3. Have sticky notes per task
        4. Send mails when approaching the deadline, when task deleted or when a user dropped a task by exiting the group
		5. Messages per task (like a mini watsapp)
		6. To be able to upload a file, as well as download it

		OPTIONAL: UML diagram
