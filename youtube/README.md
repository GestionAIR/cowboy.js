# Class: cowboy.YouTube

A class to insert a YouTube video player by the API method. This Clas allowing to easily control the video by its state.

### Implements:

* cowboy.Options

## Modal method : constructor ##

### Syntax

	var myPlayer = new cowboy.YouTube(element[, options]);


### Arguments

1. element - (*Element*) Element the player will apply
2. options - (*Object*, optional) Object with options for the instance

### Options:

* height - (*String*- default to '100%') Height of the video
* width - (*String*- default to '100%') Width of the video
* videoId - (*String*- default to null) YouTube Id's of the video
* playerVars - (*Object* - default to null) Object of YouTube's API e.g. {'hd': 1, 'controls':1 }
* onReady - (*Function* - default to null) Function applying on Ready State 
* onStateChange - (*Function* - default to null) Function applying on changing state of the Player. List of events triggered by the API : ENDED,PLAYING,PAUSED,BUFFERING,CUED
* onPlaybackQualityChange - (*Function* - default to null) 
* onPlaybackRateChange - (*Function* - default to null) 
* onError - (*Function* - default to null) 
* onApiChange - (*Function* - default to null) 

## Modal method : _insertPlayerAPI

Insert the script for the YouTube API controller.

### Syntax :

	myPlayer._insertPlayerAPI();

## Modal method : _onYouTubePlayerAPIReady

Bind all event triggered by the YouTube API Video Player and initialize the YouTube Video Player Object provided by the API. 

### Syntax :

	myModal._onYouTubePlayerAPIReady();

## Modal method : _onReady

Function called when the player is ready.

### Syntax :

	myModal._onReady();

## Modal method : _onStateChange

Function called when the state of the player has been changed. List of events' code : ENDED,PLAYING,PAUSED,BUFFERING,CUED

### Syntax :

	myModal._onStateChange();

## Modal method : _onPlaybackQualityChange

Function called when the quality of the video is changed

### Syntax :

	myModal._onPlaybackQualityChange();

## Modal method : _onPlaybackRateChange

Function called when the speed rate of the video is changed

### Syntax :

	myModal._onPlaybackRateChange();

## Modal method : _onError

Function called when the player push an error

### Syntax :

	myModal._onError();

## Modal method : _onApiChange

Function called when the api changed.

### Syntax :

	myModal._onApiChange();
