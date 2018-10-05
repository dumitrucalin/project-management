# task-manager

TODO: 
	UI (ce are - si * inseamna ca il pot face si eu, ce are doar - poti face doar tu):
		- * pune butonul de parasire a grupului in settings, alaturi de un select pentru a seta din ce grup vrei sa iesi ????? e bine sa facem asa ?????
		- * validator pentru exitGroup din settings
		- abg pula repara update userGroup CALIN !!!!!!!!!!!!!!!!
		- un singur tabel pentru tasksList
		- fiecare celula din tasksList trebuie sa contina atat titlurile corespondente task-urilor, cat si valorile, nu doua linii separate (daca nu ai inteles exact, intreaba-ma!!!!!!!!!)
		- am mutat selectul de group din dashboard in tasksList. La el, vreau by default sa fie selectat primul grup din lista de grupuri a acelui user, "user.groupNames[0]"
		- * dupa ce da createGroup sa dea un redirect si ce mai e nevoie, fara sa trebuiasca sa dea reload din nou user-ul pentru a actualiza grupurile
		- * bootstrap notify pe index.js
		- * rute in CreateGroup pentru a verifica daca un user exista si daca GroupName e unic
		- * buton iesit din grup
		- * sa poti sa bagi useri in grup

	SERVER:
		- To implement the rest of the details about the task
		- To check if there is anyone in the group left, else to delete the group
		- Try/catch ?
		- Implement token with redis

	IDEAS:
        1. A given task can be assigned to multiple persons, and one of them has to take it -> reassigment of task will be used in case of deleting a user
		2. (SERVER) To send only the new tasks to the user, not all of them, when the task list has changed
        3. Have sticky notes per task
        4. Send mails when approaching the deadline, when task deleted or when a user dropped a task by exiting the group
		5. Messages per task (like a mini watsapp)
		6. To be able to upload a file, as well as download it
