# Class: cowboy.Modal

A class allowing to easily create a modal, based on a portion of the page, or on an other page, loaded by an AJAX transaction.

### Implements:

* cowboy.Options

## Modal method : constructor ##

### Syntax

	var myModal = new cowboy.Modal(element[, options]);


### Arguments

1. element - (*Element*) Element the modal will show
2. options - (*Object*, optional) Object with options for the instance

### Options:

* trigger - (*Element or Array of Elements*- default to null) Element(s) that show the modal
* transition - (*String* - default to 'Expo.easeOut') Transition to use
* duration - (*Integer*- default to 500) Duration of the transition
* hiddenClass - (*String* - default to 'hidden') Class for hidden elements
* bckgClass - (*String* - default to 'modal-bckg') Background class
* closeOnBlur - (*Boolean* - default to true) Close the modal when the user clicks out of it
* escape - (*Boolean* - default to true) Close the modal when the user pushes escape key
* showOnInit - (*Boolean* - default to false) Show the modal when it is initialized
* reloadOnEach - (*Boolean* - default to false) Reload the content via AJAX on each modal call
* callback - (*function*) Function to execute when the modal is closed

### See also:

* [Fx.Transition](https://github.com/mootools/mootools-core/wiki/Fx.Transitions)


## Modal method : showAdapter

Select the function to use to show the modal

### Syntax :

	myModal.showAdapter();

### Returns :

* (*Function*) - Function to execute

### See also :

* [Modal.show](#modal-method-show)
* [Modal.showAjax](#modal-method-showajax)

## Modal method : show

Show the modal from an hidden element.

### Syntax :

	myModal.show();

## Modal method : showAjax

Show the modal by loading the content with an AJAX transaction.

### Syntax :

	myModal.showAjax();

## Modal method : hide

Hide the modal and executes the callback.

### Syntax :

	myModal.hide();

## Modal method : toggle

According to the current state of the modal, show or hide it.

### Syntax :

	myModal.toggle();
