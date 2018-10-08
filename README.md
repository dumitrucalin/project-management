# task-manager

TODO: 
	UI (ce are - si * inseamna ca il pot face si eu, ce are doar - poti face doar tu):
	!!!!!!! DE RESPECTAT CE CODNIG STYLE AU ACUM FISIERELE .VUE
		- * bootstrap notify pe index.js
		- * data sa fie frumos prezentata
		- * adaugat si ora pentru deadline, salvata in aceeasi variabila cu data, si anume taskDeadline
		- * adaugat loading-uri oriunde e nevoie
		- * text de scris pentru partea de settings

	SERVER:
		- To update and send only the new tasks, and not all of them
		- Try/catch
		- Implement token and tasksModified variables checking with redis

	IDEAS:
        1. A given task can be assigned to multiple persons, and one of them has to take it -> reassigment of task will be used in case of deleting a user
		2. (SERVER) To send only the new tasks to the user, not all of them, when the task list has changed
        3. Have sticky notes per task
        4. Send mails when approaching the deadline, when task deleted or when a user dropped a task by exiting the group
		5. Application on android for buzzers instead of e-mails (but still, keep the e-mails)
		6. Messages per task (like a mini watsapp)
		7. To be able to upload a file, as well as download it

		OPTIONAL: UML diagram
