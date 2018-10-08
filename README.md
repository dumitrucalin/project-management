# task-manager
This is the README for a application to manage tasks in a team working on a project.

TODO: 
	UI (ce are - si * inseamna ca il pot face si eu, ce are doar - poti face doar tu):
	!!!!!!! DE RESPECTAT CE CODNIG STYLE AU ACUM FISIERELE .VUE
		- * data sa fie frumos prezentata
		- * text de scris pentru partea de settings
		- * in cazul in care task-ul a fost luat, la ceilalti useri sa nu le mai apara decat un mesaj pe care il pot sterge. Pe scurt, pentru fiecare task la care (modificare pe array-ul primit, direct in js in componenta .vue):
			-> usernamesReceiver.length === 1 && usernamesReceiver[0] !== user.usernam, arata mesaj si buton de stergere a task din lista proprie (fata tot task-ul)
			-> usernamesReceiver.length !== 1, buton cu care fiecare poate sa il stearga doar din lista proprie de task-uri
			-> usernamesReceiver.length === 1 && usernamesReceiver[0] === user.username, afiseaza task-ul normal
		- toate task-urile care au fost assigned dar nu user-ului respectiv, sau au fost terminate, sa fie asezate in partea de jos a tabelului
		- toate task-urile care trebuie sa fie assigned sa fie asezate in partea de sus a tabelului
		- * in momentul in care un user a refuzat un task care inca nu a fost assigned, sa i se stearga numele din lista de useri ce pot da assigned la task
		- * ruta pentru cazul in care un user care a primit taskul apasa pe 'Not assigned yet'
		- * buton pentru stergerea user-ului daca a fost adaugat in lista cu userii pentru crearea unui grup/task

	SERVER:
		- Implement token and tasksModified variables checking with redis
		- Route for assigning a person for a task
		- Route for deleting a user from the usernamesReceiver array from a specific task, along with the taskId from the user

	IDEAS:
		1. Have sticky notes per task
		2. Send mails when approaching the deadline, when task deleted or when a user dropped a task by exiting the group
		3. Application on android for buzzers instead of e-mails (but still, keep the e-mails)
		4. Messages per task (like a mini watsapp)
		5. To be able to upload a file, as well as download it

		OPTIONAL: UML diagram
