# task-manager

TODO: 
	UI:
		- un singur tabel pentru tasksList
		- fiecare celula din tasksList trebuie sa contina atat titlurile corespondente task-urilor, cat si valorile, nu doua linii separate (daca nu ai inteles exact, intreaba-ma!!!!!!!!!)
		- am mutat selectul de group din dashboard in tasksList. La el, vreau by default sa fie selectat primul grup din lista de grupuri a acelui user, "user.groupNames[0]"
		- dupa ce da createGroup sa dea un redirect si ce mai e nevoie, fara sa trebuiasca sa dea reload din nou user-ul pentru a actualiza grupurile
		- bootstrap notify pe index.js
		- rute in CreateGroup pentru a verifica daca un user exista si daca GroupName e unic
		- buton iesit din grup

	SERVER:
		- To implement the rest of the details about the task
		- To check if there is anyone in the group left, else to delete the group
		- Try/catch ?
		- Implement token with redis

	IDEAS:
        5. Messages per task (like a mini watsapp
        2. A given task can be assigned to multiple persons, and one of them has to take it
		3. (SERVER) To send only the new tasks to the user, not all of them, when the task list has changed
        6. Have sticky notes per user/task (choose one of the 2)
        7. Send mails when approaching the deadline or when task deleted
