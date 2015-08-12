/**
 * @fileOverview ie
 *
 * @author David
 *
 */

$(function() {
	
	/**
     * An object of classes used in this view
     * @default null
     * @property CLASSES
     * @type {Object}
     * @final
     */

	var CLASSES = {
		thumbnail_child : '.video-tn:nth-child(4n+1)'
	};

	/**
     * An object of styles used in this view
     * @default null
     * @property STYLES
     * @type {Object}
     * @final
     */

	var STYLES = {
		margin_thumbnail : 'margin-right:0!important'
	};

	/**
     * Basic ieAdaptor view
     *
     * @class ieAdaptor
     * @constructor
     */
	var ieAdaptor = function(){
		
		/**
         * tag that we have to select
         *
         * @default null
         * @property video_thumbnail
         * @type {Function}
         * @public
         */
		this.video_thumbnail = null;

		/**
         * style that we have to add
         *
         * @default null
         * @property style_added
         * @type {Function}
         * @public
         */
		this.style_added = null;
		
		this.init();

	};

	/**
     * Initializes the Component View
     * Runs create_children and add_Styles
     *
     * @method init
     * @public
     * @chainable
     */
	ieAdaptor.prototype.init = function(){
		this.create_children()
			.add_Styles();

		return this;
	};


	/**
     * Create any child objects
     * Should only be run on initialization of the view
     *
     * @method create_children
     * @public
     * @chainable
     */
	ieAdaptor.prototype.create_children = function(){
		this.video_thumbnail = CLASSES.thumbnail_child;
		this.style_added = STYLES.margin_thumbnail;
		

		return this;
	};

	/**
     * Adds the style to the class
     *
     * @method add_Styles
     * @public
     * @chainable
     */
	ieAdaptor.prototype.add_Styles = function(){		
		$(this.video_thumbnail).attr('style', this.style_added);
		
		return this;
	};

	

	return new ieAdaptor();
	
});