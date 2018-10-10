# task-manager

This is the README for a application to manage tasks in a team working on a project.

TODO: 
	UI (ce are - si * inseamna ca il pot face si eu, ce are doar - poti face doar tu):
	!!!!!!! DE RESPECTAT CE CODNIG STYLE AU ACUM FISIERELE .VUE
		- * data sa fie frumos prezentata
		- * text de scris pentru partea de settings
		- * in cazul in care task-ul a fost luat, la ceilalti useri sa nu le mai apara decat un mesaj pe care il pot sterge. Pe scurt, pentru fiecare task la care (modificare pe array-ul primit, direct in js in componenta .vue, prin crearea a trei noi array-uri):
			-> usernamesReceiver.length === 1 && usernamesReceiver[0] !== user.username, arata mesaj si buton de stergere a task din lista proprie
			-> usernamesReceiver.length !== 1, buton cu care fiecare poate sa il stearga doar din lista proprie de task-uri
			-> usernamesReceiver.length === 1 && usernamesReceiver[0] === user.username, afiseaza task-ul normal
		- toate task-urile care au fost assigned dar nu user-ului respectiv, sau au fost terminate, sa fie asezate in partea de jos a tabelului
		- toate task-urile care trebuie sa fie assigned sa fie asezate in partea de sus a tabelului
		- la cel care a creat un task pentru mai multe persoane, sa ii arate ce persoane mai pot inca lua task-ul
		- * buton pentru stergerea user-ului daca a fost adaugat in lista cu userii pentru crearea unui grup/task
		- * buton pentru a afisa notificarile de succes sau nu
		- * sa incercam sa face ca notificarile sa ramana chiar daca pagina s-a reincarcat
		- * refacut partea cu afisarea username-urilor si a fullName-urilor din fiecare grup

	SERVER:
		- Implement token and tasksModified variables checking with redis
		- To see how you can reassign a task from a user who exit the group

	CSS:
		- sa nu mai apara niciunde acel highlight albastru din jurul atributului pe care il apesi cu mouse-ul (exemplu, input din login)
		- toate paginile sa aibe elementele incadrate la stanga, intr-un div care nu acopera toate latimea ecranului, ci are un maximumWidth
		- schimbat fontul din tot site-ul
		- in tabelul mare, cu tasksGiven si tasksReceived, task-urile sa nu mai apara centrate pe inaltime (daca nu intelegi, intreba-ma pe mine sau pe many)
		- lista cu userii sa se afle in partea dreapta a ecranului, si sa nu fie fie foarte mari (vezi facebook)
		- butonul de logout sa se afle in partea din dreapta a dashboard-ului, alaturi de acel mesaj cu hello, username-ul si fullName-ul
		- sa nu mai apara propunerile de la google chrome pentru input-uri

	IDEAS:
		1. Have sticky notes per task
		2. Cache for tasks per groupName
		3. Send mails when approaching the deadline, when task deleted or when a user dropped a task by exiting the group
		4. Application on android for buzzers instead of e-mails (but still, keep the e-mails)
		5. Messages per task (like a mini watsapp)
		6. To be able to upload a file, as well as download it

		OPTIONAL: UML diagram
