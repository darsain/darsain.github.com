/*global Motio, tim, store, Base64 */
(function($){
	'use strict';

	// On page load
	$(window).load(function () {
		// State animation in
		var $progress = $('#progress');
		var bar = $progress.find('.streaks')[0];
		var percent = $progress.data('percent') / 1;

		if (!bar) return;

		// Animate progress bar size
		$progress.find('.bar').css({ width : percent + '%' });

		// Bar animation
		new Motio(bar, {
			fps: 30,
			speedX: -15,
			bgWidth: 32
		}).play();
	});

	// ==========================================================================
	//   Works
	// ==========================================================================
	var apiBase = 'https://api.github.com';
	var reposURL = apiBase + '/users/darsain/repos?sort=updated';
	var experimentsURL = apiBase + '/repos/darsain/lab/contents/experiments.json';
	var extensions = {
		items: [
			{
				name: 'Example',
				url: 'https://chrome.google.com/webstore/detail/oahsfohg',
				description: 'Description.'
			}
		]
	};

	/**
	 * Do a cached request with callbacks.
	 *
	 * cachedRequest(url, callback1, callback2, ...);
	 *
	 * Callback receives `false` when request fails.
	 *
	 * @param  {String} url Request URL.
	 *
	 * @return {Void}
	 */
	function cachedRequest(url) {
		var callbacks = Array.prototype.slice.call(arguments, 1);
		var key = url.match(/[a-z0-9_\-]/gi).join('');
		var data = store.get(key);
		var refreshInterval = 60 * 60 * 1000; // milliseconds

		if (data && data.lastcall > +new Date() - refreshInterval) {
			for (var i = 0, l = callbacks.length; i < l; i++) {
				callbacks[i](data.response);
			}
		} else {
			$.ajax(url, {type: 'GET', dataType: 'jsonp', headers: {'Accept':'application/vnd.github.v1+json'}, timeout: 3000}).done(function (response) {
				store.set(key, {
					lastcall: +new Date(),
					response: response
				});

				for (var i = 0, l = callbacks.length; i < l; i++) {
					callbacks[i](response);
				}
			}).fail(function () {
				for (var i = 0, l = callbacks.length; i < l; i++) {
					callbacks[i](false);
				}
			});
		}
	}

	function displayProjects(response) {
		var $projects = $('#projects');
		if (!response) {
			$projects.html(tim('listmessage', { status: 'failed', message: 'Loading repositories failed' }));
			return;
		}

		var ignore = $projects.data('ignore').split(',');
		$projects.html(tim('projects', {
			items: $.grep(response.data, function (repo) {
				repo.url = repo.homepage || repo.html_url;
				return $.inArray(repo.name, ignore) === -1;
			})
		}));
	}

	function displayExperiments(response) {
		var $experiments = $('#experiments');
		if (!response.data.content) {
			$experiments.html(tim('listmessage', { status: 'failed', message: 'Loading experiments failed' }));
			return;
		}

		var experiments = JSON.parse(Base64.decode(response.data.content));
		$experiments.html(tim('experiments', { items: experiments }));
	}

	function displayExtensions(response) {
		var $extensions = $('#extensions');
		if (!response) {
			$extensions.html(tim('listmessage', { status: 'failed', message: 'Loading extensions failed' }));
			return;
		}

		$extensions.html(tim('extensions', response));
	}

	// Make requests
	cachedRequest(reposURL, displayProjects);
	cachedRequest(experimentsURL, displayExperiments);
	displayExtensions(extensions);
})(jQuery, undefined);