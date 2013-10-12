//---------------------------------------------------
//Class component Drag & Drop

/**
 * Drad And Drop Zone for an Image
 * @class cowboy.DragAndDropImage
 * @implements {cowboy.Options}
 */
cowboy.DragAndDropImage = new Class({
	Implements: cowboy.Options,

	options: {
		requiredType:null,
		typeSupported:['image/gif','image/jpeg','image/pjpeg','image/png','image/tiff'],
		sizeMax:2000000,
		width:400,
		height:300,
		hideInputFile: true,
		position:null,
		text: "Please drop your image or click",
		textDragHover: "You're almost there, just drop your image now !",
		textNoSupport: "Your browser does not support Drag and Drop, please click.",
		textTypeNotSupported : "Sorry, this file type is not supported.",
		textSize: "Sorry, your file is too big. ({sizeMax})",
		textImageTooSmall: "Your image is not big enough : {width}*{height} min."
	},

	/**
	 * Create a FormAjax
	 * @constructor
	 * @param  {Element}	dropzone	div element
 	 * @param  {Element}	input		input[type='file'] element
	 * @param  {Object}		options		
	 */
	initialize: function(dropzone, input, options){
		var _this = this;
		this.dropzone = dropzone;
		this.input = input;

		this.options = Object.merge(this.options, options);

		// Set Options and overload options by properties in the dropzone
		this.setElementOptions(this.options, dropzone);

		// Hide the input[type="file"] that host the image's file
		if(this.options.hideInputFile) this.input.setStyle("display","none");

		// Set the dropzone's size
		this.dropzone.setStyles({
			'width':this.options.width,
			'height':this.options.height,
			'line-height':this.options.height
		});

		// Set the dropzone's text
		this.dropzone.set('text',this.options.text);
		
		// Emulate a click event on the dropzone for the input[type="file"] : prompt the file selector
		this.dropzone.addEvent('click', function() { _this.input.click(); });

		// Set the input Position
		this.inputPosition = new Element('input',{
			type:'hidden',
			id:this.dropzone.id+'_position',
			name:this.dropzone.id+'_position',
			value:'0,0'
		});
		this.inputPosition.inject(this.dropzone,'after');
		
		// Enable DnD for Browser that support it
		if(window.File && window.FileReader && window.FileList && window.Blob) {

			// Define the support of these events for "addEvent" method of MooTools
			Element.NativeEvents.dragenter = 2;
			Element.NativeEvents.dragleave = 2;
			Element.NativeEvents.dragover = 2;
			Element.NativeEvents.dragend = 2;
			Element.NativeEvents.drop = 2;

			// onDragEnter
			this.dropzone.addEvent('dragenter', function() { 
				_this.dropzone.addClass('dragover'); 
				_this.dropzone.set('text',_this.options.textDragHover); 
				return false;
			});
			// onDragLeave
			this.dropzone.addEvent('dragleave', function() { 
				_this.dropzone.removeClass('dragover'); 
				_this.dropzone.set('text',_this.options.text); 
				return false;
			});
			// onDragEnd
			this.dropzone.addEvent('dragend', function() { 
				_this.dropzone.removeClass('dragover'); 
				_this.dropzone.set('text',_this.options.text); 
				return false;
			});
			// onDragOver (needed by Firefox)
			this.dropzone.addEvent('dragover', function() { return false; });
			document.body.addEvent('dragover', function() { return false; });
			document.body.addEvent('drop', function() { return false; });
			this.dropzone.addEvent('drop', _this._drop.bind(_this)); 

			this.input.addEvent('change', _this._click.bind(_this));
		}
		// Fallback by Clickbox width input[type=file]
		else {
			this.dropzone.removeClass('dropzone').addClass('clickzone');
			this.dropzone.set('html',this.options.textNoSupport);
			this.input.addEvent('change', function(e) { 
				_this.input.setStyle('display','block'); 
				_this.dropzone.destroy();
			});
		}
	}
	/**
	 * Check if file meets expectations
	 * @method _checkFile
	 */
	, _checkFile: function(file) {
		var type = file.type;
		var size = file.size;
		// Check if the file size
		if(size<=this.options.sizeMax) {
			// Check if the type is supported 
			if(this.options.typeSupported.contains(type)) {
				if(this.options.requiredType!=null) {
					if(this.options.requiredType==type) {
						return true;
					}
					else { // Type not supported
						this.dropzone.addClass('dropzone-error');
						this.dropzone.set('text',this.options.textTypeNotSupported);
						return false;
					} 
				}
				else return true;
			}
			else { // Type not supported
				this.dropzone.addClass('dropzone-error');
				this.dropzone.set('text',this.options.textTypeNotSupported);
				return false;
			} 
		}
		else { // Size Exceed
			this.dropzone.addClass('dropzone-error');
			var sizeMaxStr = ((this.options.sizeMax > 1000000) ? String(Math.round(this.options.sizeMax / 1000000)) + "Mo" : String(Math.round(this.options.sizeMax / 1000)) + "Ko");
			this.dropzone.set('text',this.options.textSize.substitute({"size": sizeMaxStr}));
		}
			
	}
	, _readFile: function(file) {
		var _this = this;
		if(_this._checkFile(file)) {
			var reader = new FileReader();
			reader.onload = function(event) {
				// Build image element
				var img = new Element('img',{
					'src':event.target.result,
					'draggable':'false' // Prevent dragging the image has been droped
				});
				img.onload = function() {
					var widthIn = img.width;
					var heightIn = img.height;
					// Image too small
					if((widthIn+1)<_this.options.width || (heightIn+1)<_this.options.height) {
						_this.dropzone.addClass('dropzone-error');
						_this.dropzone.set('text',this.options.textImageTooSmall.substitute({"width":_this.options.width,"height":_this.options.height}));
					}
					else {
						// Height is too high
						if((widthIn/heightIn).round(2)<(_this.options.width/_this.options.height).round(2)) {
							var widthOut = _this.options.width;
							var heightOut = ((widthOut*heightIn)/widthIn).round();
							var orientation = 'y';
						}
						// Width is too larg
						else {
							var heightOut = _this.options.height;
							var widthOut = ((heightOut*widthIn)/heightIn).round();
							var orientation = 'x';
						}
						// Push the image at an optimized size
						_this.dropzone.empty();
						img.setProperties({'width':widthOut,'height':heightOut});
						_this.dropzone.addClass("dropzone-valid");
						img.inject(_this.dropzone);
						_this.input.files[0] = file;
						_this._move(img,orientation);
					}	
				}
			};
			reader.readAsDataURL(file);

		}
	}
	, _drop: function(drop) {
		drop.stop();
		var _this = this;
		_this.dropzone.removeClass('dragover').removeClass('dropzone-error');
		var file = drop.event.dataTransfer.files[0];
		_this._readFile(file);
		return false;
	}
	, _click: function(e) {
		e.stop();
		var _this = this;
		var file = _this.input.files[0]; //e.event.dataTransfer.files[0];
		_this._readFile(file);
	}
	, _move: function(img,orientation) {
		var _this = this;
		this.dropzone.removeEvents('click');
		img.setStyles({
			'top':0,
			'left':0,
			'position':'relative'
		})
		if(orientation=='y') {
			img.setStyle('cursor','ns-resize');
			var imgHeight = -img.offsetHeight+this.dropzone.offsetHeight;
			img.addEvent('mousedown',function (e) { 
				var topStart = e.target.getStyle('top').toInt();
				var posYStart = e.event.clientY;
				img.addEvent('mousemove',function (e) {
					var top = e.event.clientY-posYStart+topStart;
					if(top<=0 && top>imgHeight) {
						img.setStyle('top',top);
					}
				});
			});
		}
		if(orientation=='x') {
			img.setStyle('cursor','ew-resize');
			var imgWidth = -img.offsetWidth+this.dropzone.offsetWidth;
			img.addEvent('mousedown',function (e) { 
				var leftStart = e.target.getStyle('left').toInt();
				var posYStart = e.event.clientX;
				img.addEvent('mousemove',function (e) {
					var left = e.event.clientX-posYStart+leftStart;
					if(left<=0 && left>imgWidth) {
						img.setStyle('left',left);
					}
				});
			});
		}
		img.addEvent('mouseup',function () { 
			_this.inputPosition.value = img.getStyle('left').toInt()+','+img.getStyle('top').toInt();
			img.removeEvents('mousemove');
		});
		img.addEvent('mouseleave',function () {
			_this.inputPosition.value = img.getStyle('left').toInt()+','+img.getStyle('top').toInt();
			img.removeEvents('mousemove');
		});
	}
}); 