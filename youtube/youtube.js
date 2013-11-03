//---------------------------------------------------
//Class component YouTube Video

/**
 * YouTube video Player 
 * @class cowboy.youtube
 * @implements {cowboy.Options}
 */
cowboy.YouTube = new Class({
	Implements: cowboy.Options,
	options: {
		height: '100%',
		width: '100%',
		videoId: null,
		playerVars: null,
		onReady: function(){},
		onStateChange: function(){},
		onPlaybackQualityChange: function(){},
		onPlaybackRateChange: function(){},
		onError: function(event){ console.log(event); },
		onApiChange: function(){}
	},
	/**
	 * Constructor
	 * @constructor
	 * @param	{Element}	element		Targeted Element to inject the player
	 * @param	{Object}	options		Complementary options
	 */
	initialize: function(container, options) {
		var _this = this;
		this.container = container;
		this.options = Object.merge(this.options, options);
		this.setElementOptions(this.options, this.container);
		this.events = ['ENDED','PLAYING','PAUSED','BUFFERING','CUED'];
		this.player = null;
		this._insertPlayerAPI();
		window.onYouTubePlayerAPIReady = function(){
			_this._onYouTubePlayerAPIReady();
		};
	}
	, _insertPlayerAPI: function(){
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/player_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	}
	, _onYouTubePlayerAPIReady: function(){
		this.options.events = {
		onReady:this._onReady.bind(this),
		onStateChange:this._onStateChange.bind(this),
		onPlaybackQualityChange:this._onPlaybackQualityChange.bind(this),
		onPlaybackRateChange:this._onPlaybackRateChange.bind(this),
		onError:this._onError.bind(this),
		onApiChange:this._onApiChange.bind(this)
		};
		this.container.empty();
		this.player = new YT.Player(this.container.id, this.options);
	}
	, _onReady: function(event){
		if (typeof this.options.onReady == 'function') return this.options.onReady(event);
	}
	, _onStateChange: function(event){
		event.name = this.events[event.data];
		if (typeof this.options.onStateChange == 'function') return this.options.onStateChange(event);
	}
	, _onPlaybackQualityChange:function(event) {
		if (typeof this.options.onPlaybackQualityChange == 'function') return this.options.onPlaybackQualityChange(event);
	}
	, _onPlaybackRateChange:function(event) {
		if (typeof this.options.onPlaybackRateChange == 'function') return this.options.onPlaybackRateChange(event);
	}
	, _onError:function(event) {
		if (typeof this.options.onError == 'function') return this.options.onError(event);
	}
	, _onApiChange:function(event) {
		if (typeof this.options.onApiChange == 'function') return this.options.onApiChange(event);
	}
});
