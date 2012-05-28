(function($){

	// Stamps
	$("#stamps").on('mouseenter mouseleave', 'a', function( e ){

		var $stamp = $(this),
			$icon = $stamp.find(".icon");

		$stamp.stop().animate({ width: e.type === 'mouseenter' ? '130px' : '64px' }, 'easeOutExpo' );
		$icon.stop().animate({ width: e.type === 'mouseenter' ? '0' : '64px' }, 'easeOutExpo' );

	});

	// Tweed
	$('#tweets').find('ul.tweets').tweed('@Darsain', {
		limit: 7,
		template: '<li><a href="https://twitter.com/{{author}}">{{avatar_bigger}}</a><div class="tweet"><span class="text">{{tweet}}</span><a href="{{tweet_url}}" class="time">{{time}}</a></div></li>'
	});

	// On page load
	$(window).load(function(){

		// State animation in
		var $progress = $('#progress'),
			percent  = 15,
			maxWidth = 594,
			width    = Math.round( maxWidth / 100 * percent );

		$progress.find('.bar').animate( { width : width+'px' }, 1500 + percent * 20 );

		// Background animation
		var fps     = 20,
			speed   = 1,
			streaks = $progress.find('.streaks')[0],
			timeout = 1000 / fps,
			bgWidth = 32, // to prevent numbers overflowing 53bits (uncle JS can't work with that)
			left    = 0;

		(function streaking(){

			left = left >= bgWidth ? speed - left % speed : left+speed;

			streaks.style.backgroundPosition = '-'+left+'px 0px';

			setTimeout( streaking, timeout );

		})();

	});

})( jQuery, undefined );