# task-manager

TODO: 
	UI:
		- bootstrap notify pe index.js
		- rute in CreateGroup pentru a verifica daca un user exista si daca GroupName e unic
		- buton iesit din grup
		- buton sters task de catre creator

	SERVER:
		- Try/catch ?
		- Implement token with redis
		- Routes in server to verify if the username is already in the database or not, for createGroup.
		- Routes in server to verify if the groupName is unique for createGroup.

	IDEAS:
        5. Messages per task (like a mini watsapp
        2. A given task can be assigned to multiple persons, and one of them has to take it
        1. The creator user can delete the given task
        6. Have sticky notes per user/task (choose one of the 2)
        7. Send mails when approaching the deadline or when task deleted
