"use strict";

(function(){
    /**
     * infinity slider plugin 
     * Author: yehuda yadid
     */

    /**
     * binding dom element with slider
     */
    Object.prototype.Slider = function(options){
        var elem = this;
        new Slider(options, elem);
    }

    /**
     * main function update default options
     * @param Object (slider options)
     */
    var Slider = function(options, elem){    
        if(options){
            extend(this.options, options);
        }
        
        // if loop = true -> infinity = true
        this.options.loop == true ? this.options.infinity = true : this.options.infinity = this.options.infinity ; 
        this.element = elem;
        this.interval; // for loop function

        //============ TEST
            this.init();
            this.width();
            this.speed();
            this.arrow();
            this.loop();
        //============ TEST
    }

    /**
     * slider default options
     */
    Slider.prototype.options = {
        dot: true,
        arrow: true,
        loop: true,
        loop_speed: 2000, // the time of setInterval
        speed: 500, // the time of container transition
        direction: 'rtl',
        classes: {
            root: 'infinity-slider',
            slides: 'infinity-slider-slide',
            dot: 'infinity-slider-dot',
            container: 'infinity-slider-container',
            arrow: {
                root: 'infinity-slider-arrow',
                left: 'infinity-slider-a-left',
                right: 'infinity-slider-a-right',
                hide: 'infinity-slider-hide'
            }
        }
    }

    /**
     * for infinity setTimeout
     */
    Slider.prototype.infinity_timeout = true;

    /**
     * current slide in the view
     */
    Slider.prototype.current = 0;

    /**
     * slider init 
     * - add slider class
     * - creaete container div
     * @return this {element, slides, container}
     */
    Slider.prototype.init = function(){
        var options = this.options;

        this.element.classList.add(options.classes.root);

        // create container elem   
        var container = document.createElement('div');
            container.classList.add(options.classes.container);
            container.classList.add(options.direction);

        // create dot main div
        if(options.dot){
            var dot = document.createElement('div');
                dot.classList.add(options.classes.dot);
        }

        // clone and append parent child into container
        while(this.element.childNodes.length > 0){
            var child = this.element.firstChild;
            var clone = child.cloneNode(true);
            this.element.removeChild(child);

            if(child.nodeName != "#text"){
                clone.classList.add(this.options.classes.slides);

                // create dot for this slide
                if(options.dot){
                    var span = document.createElement('span');
                    dot.appendChild(span);
                }
            }

            container.appendChild(clone);
        }

        this.element.appendChild(container);
        if(options.dot){
            this.element.appendChild(dot);
        }
        this.slides = this.clean(container); // return clean childern (without '#text')
        this.container = container;
    }

    /**
     * clean element childNode from '#text' 
     * @param Object (element)
     * @return Array of Object (childNodes)
     */
    Slider.prototype.clean = function(elem){
        var child = elem.childNodes;
        var newChild = [];

        for(var i = 0 ; i < child.length ; i++){
            if(child[i].nodeName != '#text'){
                newChild.push(child[i]);
            }
        }

        return newChild;
    }
    
    /**
     * set slides width (responsive)
     * set container width (responsive)
     */
    Slider.prototype.width = function(){
        var length = this.slides.length;
        var width = 100 / length;
        var childern = this.slides;
        this.container.style.width = 100 * length + '%';

        for(var i = 0 ; i < length ; i++){
            var slide = childern[i];
            slide.style.width = width + '%';
        }

        this.slideWidth = width;

        // set the container position to second slide
        // for infinity 
        this.container_transform('translate3d(-' + this.slideWidth * 1 + '%, 0, 0)');
    }

    /**
     * set slider speed
     * - set transition on the container with options.speed param
     * @param Boolean ('true' to remove container transition)
     */
    Slider.prototype.speed = function(){
       for(var i = 0 ; i < transition.length ; i++){
           this.container.style[transition[i]] = this.options.speed + 'ms';
       }
    }

    /**
     * set container transform
     */
    Slider.prototype.container_transform = function(input){
        for(var i = 0 ; i < transform.length ; i++){
            this.container.style[transform[i]] = input;
        }
    }

    /**
     * set infinity
     */
    Slider.prototype.infinity = function(direction){
        var container = this.container;
        var cleanSlides = this.clean(container);
   
        if(direction == 'right'){
            var child = cleanSlides[0];
            var clone = child.cloneNode(true);
            container.removeChild(child);
            container.appendChild(clone);
        }else if(direction == 'left'){
            var length = cleanSlides.length - 1;
            var child = cleanSlides[length];
            var clone = child.cloneNode(true);
            container.removeChild(child);
            container.insertBefore(clone, cleanSlides[0]);
        }

        this.container_transform('translate3d(-' + this.slideWidth * 1 + '%, 0, 0)');
        
        // add class "active" to the view slide
        var cleanSlidesAfter = this.clean(container);
        for(var i = 0 ; i < cleanSlidesAfter.length ; i++){
            if(i == 1){
                cleanSlidesAfter[i].classList.add('active');
            }else{
                cleanSlidesAfter[i].classList.remove('active');
            }
        }
    }

    /**
     * set slider movement
     * direction left / right
     * @param String (direction of movement)
     */
    Slider.prototype.move = function(direction){
        var options = this.options;
        var slideLength = this.slides.length - 1;
        var self = this;

        if(direction == 'left'){
            this.current++;
        }else if(direction == 'right'){
            this.current--;
        }

        if(this.infinity_timeout){
            this.infinity_timeout = false;

            if(this.current <= 0){
                this.current = slideLength;
            }

            if(this.current >= slideLength){
                this.current = 0;
            }            

            // the movement
            this.speed();

            var m;
            if(direction == 'left'){
                m = 0;
            }else if(direction == 'right'){
                m = 2
            }

            this.container_transform('translate3d(-' + this.slideWidth * m + '%, 0, 0)');

            setTimeout(function(){
                for(var i = 0 ; i < transition.length ; i++){
                    self.container.style[transition[i]] = null;
                }
 
                self.infinity(direction);

                self.infinity_timeout = true;
            }, options.speed);
        }
    }

    Slider.prototype.loop = function(){
        var options = this.options;
        var self = this;
        var direction;

        if(options.direction == 'rtl'){
            direction = 'left';
        }else if(options.direction == 'ltr'){
            direction = 'right';
        }

        if(options.loop){
            this.interval = setInterval(function(){
                self.move(direction);
            }, options.loop_speed)
        }
    }

    /**
     * create arrow
     * add arrow move events
     */
    Slider.prototype.arrow = function(){
        var options = this.options;
        var self = this;

        if(options.arrow){
            var left = document.createElement('div');
                left.classList.add(options.classes.arrow.root);
                left.classList.add(options.classes.arrow.left);

            var right = document.createElement('div');
                right.classList.add(options.classes.arrow.root);
                right.classList.add(options.classes.arrow.right);

            var direction = options.direction;

            if(direction == 'rtl'){
                this.element.insertBefore(right, this.container);
                this.element.insertBefore(left, this.container.nextSibling);
            }else if(direction == 'ltr'){
                this.element.insertBefore(left, this.container);
                this.element.insertBefore(right, this.container.nextSibling);
            }

            this.arrow = {};
            this.arrow.left = left;
            this.arrow.right = right;

            left.addEventListener('click', function(){
                self.move('left');
            });

            right.addEventListener('click', function(){
                self.move('right');
            });
        }
    }

    /**
     * extend between 2 objects
     * @param Object (default object)
     * @parem Object (new object)
     * @return Object (first object with new params of obeject 2)
     */
    var extend = function(def, set){
        for(var p in def){
            if(set.hasOwnProperty(p)){
                return def[p] = set[p];
            }
        }

        return def;
    }

    /**
     * all js transition style
     */
    var transition = ['transition', 'webkitTransition', 'mozTransition'];

    /**
     * all js transform style
     */
    var transform = ['transform', 'webkitTransform', 'mozTransform'];
})();
