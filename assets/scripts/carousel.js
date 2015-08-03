/**
 * @fileOverview Carousel
 *
 * @author nerdery
 */
$(function() {

    /**
     * Timing variables used in this view
     * @property TIMING
     * @type {Object}
     * @final
     */
    var TIMING = {
        INTERVAL: 4000
    };

    /**
     * An object of classes used in this view
     * @default null
     * @property CLASSES
     * @type {Object}
     * @final
     */
    var CLASSES = {
        ACTIVE_SLIDE_CLASS: 'carousel-item_isActive',
        INACTIVE_SLIDE_CLASS: 'carousel-item_isInactive',
        INACTIVE_ELLIPSIS: 'js-ellipsis',
        ACTIVE_ELLIPSIS: 'js-ellipsis-active'
    };

    /**
     * An object of selectors used in this view
     * @default null
     * @property SELECTORS
     * @type {Object}
     * @final
     */
    var SELECTORS = {
        CAROUSEL_ID: '#js-carousel',
        ARROW_LEFT_ID: '#arrow-left',  /* by David*/
        ARROW_RIGHT_ID: '#arrow-right', /* by David*/
        CAROUSEL_WRAPPER: '#js-carousel-w', /* by David*/
        ELLIPSIS_WRAPPER: '#js-ellipsis-w'
    };

    /**
     * Basic carousel view
     *
     * @class Carousel
     * @constructor
     */
    var Carousel = function() {

        /**
         * A reference to the carousel
         *
         * @default null
         * @property $carousel
         * @type {jQuery}
         * @public
         */
        this.$carousel = null;

        /**
         * A reference to the carousel slides
         *
         * @default null
         * @property $slides
         * @type {jQuery}
         * @public
         */
        this.$slides = null;

        /**
         * A reference to the current carousel slide
         *
         * @default null
         * @property $currentSlide
         * @type {jQuery}
         * @public
         */
        this.$currentSlide = null;

        /**
         * The current index of the active slide
         *
         * @default 0
         * @property currentIndex
         * @type {Number}
         * @public
         */
        this.currentIndex = 0;

        /**
         * The number of slides that exist in the carousel
         *
         * @default 0
         * @property numSlides
         * @type {Number}
         * @public
         */
        this.numSlides = 0;

        /**
         * The number of slides that exist in the carousel
         *
         * @default null
         * @property timer
         * @type {Function}
         * @public
         */
        this.timer = null;

        /**
         * Tracks whether component is enabled
         *
         * @default false
         * @property isEnabled
         * @type {Boolean}
         * @public
         */
        this.isEnabled = false;

        /**
         * A reference to the left Arrow - by David
         *
         * @default null
         * @property leftArrow
         * @type {jQuery}
         * @public
         */
        this.$leftArrow = null;

        /**
         * A reference to the right Arrow - by David
         *
         * @default null
         * @property rightArrow
         * @type {jQuery}
         * @public
         */
        this.$rightArrow = null;

        this.init();
    };

    /**
     * Initializes the UI Component View
     * Runs createChildren, setupHandlers, enable, startSlideshow and ellipsis
     *
     * @method init
     * @public
     * @chainable
     */
    Carousel.prototype.init = function() {
        this.createChildren()
            .setupHandlers()
            .enable()
            .startSlideshow()
            .ellipsis(this.numSlides); // by David
                    
        return this;
    };

    /**
     * Binds the scope of any handler functions
     * Should only be run on initialization of the view
     *
     * @method setupHandlers
     * @public
     * @chainable
     */
    Carousel.prototype.setupHandlers = function() {
        this.handleCarouselMouseEnter = $.proxy(this.onCarouselMouseEnter, this);
        this.handleCarouselMouseLeave = $.proxy(this.onCarouselMouseLeave, this);

        this.handleClickLeft = $.proxy(this.onLeftArrow, this); // by David
        this.handleClickRight = $.proxy(this.onRightArrow, this); // by David
        
        return this;
    };

    /**
     * Create any child objects or references to DOM elements
     * Should only be run on initialization of the view
     *
     * @method createChildren
     * @public
     * @chainable
     */
    Carousel.prototype.createChildren = function() {
        this.$carousel = $(SELECTORS.CAROUSEL_ID);
        this.$slides = this.$carousel.children();
        this.$currentSlide = this.$slides.eq(this.currentIndex);

        // Count the slides
        this.numSlides = this.$slides.length;

        // Make first slide active
        this.$currentSlide.addClass(CLASSES.ACTIVE_SLIDE_CLASS);

        // Make all slides but the first inactive
        this.$slides.not(this.$currentSlide).addClass(CLASSES.INACTIVE_SLIDE_CLASS);
        
        // assign the selectors of the arrows - by David
        this.$leftArrow = $(SELECTORS.ARROW_LEFT_ID);
        this.$rightArrow = $(SELECTORS.ARROW_RIGHT_ID);
        
        return this;
    };

    /**
     * Enables the component
     * Performs any event binding to handlers
     *
     * @method enable
     * @public
     * @chainable
     */

    Carousel.prototype.enable = function() {
        if (this.isEnabled) {
            return this;
        }

        this.$carousel.on('mouseenter', this.handleCarouselMouseEnter);
        this.$carousel.on('mouseleave', this.handleCarouselMouseLeave);

        
        this.$leftArrow.on('click', this.handleClickLeft); // by David
        this.$rightArrow.on('click', this.handleClickRight); // by David
        
        this.isEnabled = true;

        return this;
    };

    /**
     * Disables the component
     * Tears down any event binding to handlers
     *
     * @method disable
     * @public
     * @chainable
     */

    Carousel.prototype.disable = function() {
        if (!this.isEnabled) {
            return this;
        }

        this.$carousel.off('mouseenter', this.handleCarouselMouseEnter);
        this.$carousel.off('mouseleave', this.handleCarouselMouseLeave);

        this.$leftArrow.off('click', this.handleClickLeft);
        this.$rightArrow.off('click', this.handleClickRight); // by David

        this.isEnabled = false;

        return this;
    };

    /**
     * Start the carousel auto rotation
     *
     * @method startSlideshow
     * @public
     * @chainable
     */
    Carousel.prototype.startSlideshow = function() {
        var self = this;

        this.timer = setInterval(function() { 
            self.goToNextSlide();
            self.activeEllipsis(self.currentIndex,self.numSlides); // by David
        }, TIMING.INTERVAL);

        return this;
    };

    /**
     * Stop the carousel auto rotation
     *
     * @method stopSlideshow
     * @public
     * @chainable
     */
    Carousel.prototype.stopSlideshow = function() {
        clearInterval(this.timer);

        return this;
    };

    /**
     * Go forward to the next slide
     *
     * @method gotoNextSlide
     * @public
     * @chainable
     */
    Carousel.prototype.goToNextSlide = function() {
        this.goToSlide(this.currentIndex + 1);
        this.activeEllipsis(this.currentIndex); // by David
        return this;
    };

    /**
     * Go back to the previous slide
     *
     * @method gotoNextSlide
     * @public
     * @chainable
     */
    Carousel.prototype.goToPreviousSlide = function() {
        this.goToSlide(this.currentIndex - 1);
        this.activeEllipsis(this.currentIndex); //  by David
        return this;
    };

    /**
     * Go to a specific slide
     *
     * @method goToSlide
     * @public
     * @param {Number} index of the target slide
     * @chainable
     */
    Carousel.prototype.goToSlide = function(index) {
        if (index >= this.numSlides) {
            index = 0;
        } else if (index < 0) {
            index = this.numSlides - 1;
        }

        this.$currentSlide
            .removeClass(CLASSES.ACTIVE_SLIDE_CLASS)
            .addClass(CLASSES.INACTIVE_SLIDE_CLASS);

        this.$currentSlide = this.$slides.eq(index);

        this.$currentSlide
            .removeClass(CLASSES.INACTIVE_SLIDE_CLASS)
            .addClass(CLASSES.ACTIVE_SLIDE_CLASS);

        this.currentIndex = index;

        this.activeEllipsis(this.currentIndex); // by David

        return this;
    };

    /**
     * Creates the ellipsis inside a wrapper - David
     *
     * @method ellipsis
     * @public
     * @param {Number} index of the target slide
     * @chainable
     */

    Carousel.prototype.ellipsis = function(index){
        var slides = index; //index that will tall us how many slides we have

        // Creating wrapper for the ellipsis
        var $carrousel_selector = $(SELECTORS.CAROUSEL_WRAPPER);

        // Creating the div to wrap all the ellipses
        var iDiv = $carrousel_selector.append('<div id="'+ SELECTORS.ELLIPSIS_WRAPPER.substring(1) +'"></div>');
        
        // Creating ellipses
        for (var i = 0, len = slides; i < len; i++) {
            //making the firs ellipse active
            if(i==0){
                $(SELECTORS.ELLIPSIS_WRAPPER).append('<div class="' + CLASSES.INACTIVE_ELLIPSIS + ' ' + CLASSES.ACTIVE_ELLIPSIS +'"></div>');// make active the first ellipsis
            }else{
                $(SELECTORS.ELLIPSIS_WRAPPER).append('<div class="' + CLASSES.INACTIVE_ELLIPSIS + '"></div>');
            }
        }        
        
        return this;
    }

    /**
     * Add class to the ellipsis to make it active - David
     *
     * @method activeEllipsis
     * @public
     * @param {Number} index of the active slide
     * @chainable
     */

    Carousel.prototype.activeEllipsis = function(index){
        var cSlide = index;
        
        var $el = $('.' + CLASSES.INACTIVE_ELLIPSIS);
        // we make the actual ellipsis active and the other inactive
        $el.each(function(index2){
            if(cSlide == index2){                
                $el.eq(index2).addClass(CLASSES.ACTIVE_ELLIPSIS);
            }else{
                $el.eq(index2).removeClass(CLASSES.ACTIVE_ELLIPSIS);
            }
        });    

        return this;    
    }

    
    //////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////

    /**
     * Stop slideshow on mouse enter
     * @method onCarouselMouseEnter
     * @public
     * @param {Object} event The event object
     */
    Carousel.prototype.onCarouselMouseEnter = function(e) {
        this.stopSlideshow();
    };

    /**
     * Start slideshow on mouse leave
     * @method onCarouselMouseLeave
     * @public
     * @param {Object} event The event object
     */
    Carousel.prototype.onCarouselMouseLeave = function(e) {
        this.startSlideshow();
    };

     /**
     * Goes to previous slide on mouse click - by David
     * @method onLeftArrow
     * @public
     * @param {Object} event The event object
     */

    Carousel.prototype.onLeftArrow = function(e){
        this.stopSlideshow();
        this.goToPreviousSlide();
        
    }
    
    /**
     * Goes to next slide on mouse click - by David
     * @method onRightArrow
     * @public
     * @param {Object} event The event object
     */
    Carousel.prototype.onRightArrow = function(e){
        this.stopSlideshow();
        this.goToNextSlide();
    }


    return new Carousel();

});