require('bootstrap');
var bootbox = require('bootbox');
var _ = require('lodash');

module.exports.install = function(Vue) {
	var modalSerial = 0;
	Vue.bootbox = {
		alert: bootbox.alert,
		confirm: bootbox.confirm,
		prompt: bootbox.prompt,
		dialog: function(component, props, options) {
			var serial = modalSerial++;
			// console.log (_.assign (options, {
			// 	message: '<div id="modal_'+serial+'"></div>'
			// }));

			var buttonf = function(button) {
				var res;
				var that = this;
				// console.log (this);
				// console.log (button);
				if (_.isFunction(vue.$children[0][button])) {
					var args = [function() {
						if (that.originalCallback) that.originalCallback.apply(that, arguments);
					}];
					res = vue.$children[0][button].apply(vue.$children[0], args);
				}
				if (res instanceof Promise) {
					res.then(function(result) {
						console.log(result);
						if (result) {
							dialog.modal('hide');
						}
					}).catch(function(err) {
						console.log(err);
					});
					return false;
				} else {
					return res;
				}
			};

			_.each(options.buttons, function(button, title) {
				button.originalCallback = button.callback;
				// console.log (button);
				button.callback = buttonf.bind(button, title);
			});

			var dialog = bootbox.dialog(_.assign(options, {
				message: '<div id="modal_' + serial + '"></div>',
				onEscape: function() {
					// console.log ('escape');
					if (_.isFunction(vue.$children[0].escape)) {
						return vue.$children[0].escape();
					} else return false;
				}
			}));

			var vue = new Vue({
				el: '#modal_' + serial,
				render: function(render) {
					return render(component, {
						props: _.assign({ dialog: dialog }, props)
					});
				}
			});

			return dialog;
		}
	};
};