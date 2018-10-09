var $ = require ('jquery');
require ('bootstrap-notify');

module.exports.install = function(Vue) {
	let data = {};
	Vue.toast = {
		serverErrorToast(error) {
			let time = 3000;

			if (!data['error']) {
				data['error'] = true;
				setTimeout (function ()
				{
					data['error'] = null;
				}, time + 500);

				$.notify({
					title: 'SERVER ERROR',
					message: 'Couldn\'t connect to the server!<br>Error: ' + error + '.<br>Please try again later.'
				}, {
					type: 'danger',
					delay: time,
					allow_dismiss: true,
					animate: {
						enter: 'animated zoomInDown',
						exit: 'animated zoomOutUp'
					},
					template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
							'<span data-notify="title"><strong>{1}</strong></span><br>' +
							'<span data-notify="message">{2}</span>' +
							'<button type="button" data-notify="dismiss">X</button>' +
							'</div>'
				});
			}
		},

		customToast(component) {
			let time = 3000;

			$.notify({
				title: component.title,
				message: component.message
			}, {
				type: component.type,
				delay: time,
				allow_dismiss: true,
				animate: {
					enter: 'animated zoomInDown',
					exit: 'animated zoomOutUp'
				},
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
						'<span data-notify="title"><strong>{1}</strong></span><br>' +
						'<span data-notify="message">{2}</span>' +
						'<button type="button" data-notify="dismiss">X</button>' +
						'</div>'
			});
		}
	};
};