const axios = require('axios');
var FormData = require('form-data');
var { promisify } = require('util');

var bodyFormData = new FormData();
bodyFormData.append('username', 'george.stoica0310');
bodyFormData.append('password', 'InterPl@netaryFunksmanship94');

var config = { headers: { 'Content-Type': 'multipart/form-data' } };


async function makeReq() {
	try {
		// console.log(bodyFormData);
		var response = await axios.post('https://cluster.grid.pub.ro/loginExternal.php', bodyFormData, config);
		// var response = await axios.post('https://cluster.grid.pub.ro/loginExternal.php', bodyFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
		console.log(response);
	} catch (err) {
		console.log(err);
	}
}

makeReq();