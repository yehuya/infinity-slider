"use strict";

/**
 * infinity slider plugin 
 * Author: yehuda yadid
 */

(function(){
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
        
        this.element = elem;
        this.interval; // for loop function (setInterval)
        this.init();
        this.width();
        this.speed();
        this.loop();
        this.arrow();
        this.dot();
        this.touch();
    }

    /**
     * slider default options
     */
    Slider.prototype.options = {
        dot: true, // slider boolean
        arrow: true, // slider arrow
        loop: true, // slider loop
        touch: true, // slide with touch - mobile
        width: 1, // the slide size depend of slider width - 1/1 | 0.5/1 etc..
        loop_speed: 2000, // the time of setInterval
        speed: 500, // the time of container transition
        direction: 'rtl', // direction of the page
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
     * start point
     */
    Slider.prototype.current = 1;

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
                this.dotContainer = dot;
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
                    span.style.transition = 'all ' + options.speed + 'ms linear';
                    span.style.webkitTransition = 'all ' + options.speed + 'ms linear';
                    dot.appendChild(span);
                }
            }

            container.appendChild(clone);
        }

        this.element.appendChild(container);
        if(options.dot){
            this.element.appendChild(dot);
            this.dotContainer.childNodes[this.current].classList.add('active');
        }
        this.slides = this.clean(container); // return clean childern (without '#text')
        this.slides[this.current].classList.add('active');
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
        var slideWidth = this.options.width;
        var childern = this.slides;
        this.container.style.width = 100 * length + '%';

        for(var i = 0 ; i < length ; i++){
            var slide = childern[i];
            slide.style.width = width * slideWidth + '%';
        }

        this.slideWidth = width;

        // set the container position to second slide
        // for infinity 
        var sign = this.options.direction == 'rtl' ? 1 : -1;
        this.container_transform('translate3d(' + sign * this.slideWidth * 1 + '%, 0, 0)');
    }

    /**
     * set slider speed
     * - set transition on the container with options.speed param
     */
    Slider.prototype.speed = function(speed){
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

        var sign = this.options.direction == 'rtl' ? 1 : -1;
        this.container_transform('translate3d(' + sign * this.slideWidth * 1 + '%, 0, 0)');
        
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
     * @param Number (for new speed (no from this.options speed) - for dot fn)
     */
    Slider.prototype.move = function(direction, newSpeed){
        var options = this.options;
        var slideLength = this.slides.length - 1;
        var self = this;

        if(this.infinity_timeout){
            this.infinity_timeout = false;

            if(direction == 'left'){
                this.current++;
            }else if(direction == 'right'){
                this.current--;
            }

            if(this.current < 0){
                this.current = slideLength;
            }

            if(this.current > slideLength){
                this.current = 0;
            }            

            // the movement 
            var timeOut = options.speed;
            if(newSpeed != undefined){
                timeOut = newSpeed;
            }else{
                this.speed();
            }

            var m;
            if(direction == 'left'){
                m = 0;
            }else if(direction == 'right'){
                m = 2;
            }

            var sign = options.direction == 'rtl' ? 1 : -1;
            this.container_transform('translate3d(' + sign * this.slideWidth * m + '%, 0, 0)');

            // add class to the dot of the slide
            if(options.dot){
                var dots = this.dotContainer.childNodes;
                for(var i = 0 ; i < dots.length ; i++){
                    if(i == this.current){
                        dots[i].classList.add('active');
                    }else{
                        dots[i].classList.remove('active');
                    }
                }
            }

            setTimeout(function(){
                for(var i = 0 ; i < transition.length ; i++){
                    self.container.style[transition[i]] = null;
                }
 
                self.infinity(direction);
                
                // if slider loop was cancled restart it
                if(self.interval === true && options.loop === true){
                    self.loop();
                }

                self.infinity_timeout = true;
            }, timeOut);
        }
    }

    Slider.prototype.loop = function(){
        var options = this.options;
        if(options.loop){       
            var self = this;
            var direction;

            direction = 'right';
       
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
                left.classList.add(options.classes.arrow.left, options.direction);

            var right = document.createElement('div');
                right.classList.add(options.classes.arrow.root);
                right.classList.add(options.classes.arrow.right, options.direction);

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

            // clear slider loop if exists
            var clearLoop = function(){
                if(options.loop){
                    clearInterval(self.interval);
                    self.interval = true;
                }
            }

            left.addEventListener('click', function(){
                clearLoop();
                self.move('left');
            });

            right.addEventListener('click', function(){
                clearLoop();
                self.move('right');
            });
        }
    }

    /**
     * set dot as link to slides
     */
    Slider.prototype.dot = function(){
        var self = this;
        if(self.options.dot){
            var dots = self.dotContainer.childNodes;
            for(var i = 0 ; i < dots.length ; i++){
                (function(index){
                    dots[index].addEventListener('click', function(event){
                        event.preventDefault();
                        var now = self.current;
                        var to = now - index;
                        var dir;   

                        if(to < 0){
                            dir = 'left';
                            to = to * -1;
                        }else{
                            dir = 'right';
                        }

                        var speed = self.options.speed / to;
                        for(var t = 0 ; t < to ; t++){
                            (function(t){
                                setTimeout(function(){
                                    if(self.options.loop){
                                        clearInterval(self.interval);
                                        self.interval = true;
                                    }

                                    for(var i = 0 ; i < transition.length ; i++){
                                        self.container.style[transition[i]] = speed + 'ms';
                                    }

                                    self.move(dir, speed);
                                }, speed * t * 1.1);
                            })(t)
                        }
                    });
                })(i);
            }
        }
    }

    /**
     * touch event - for switch slide 
     */
    Slider.prototype.touch = function(){
        var self = this;
        if(self.options.touch){
            var width = parseInt(this.element.style.width);
            var containerWidth = parseInt(self.container.style.width);
            var pos = {x: null, y: null}
            var dir = {x: null, y: null}

            var start = function(event){
                event.preventDefault();

                var x = event.pageX || event.targetTouches[0].pageX;
                var y = event.pageY || event.targetTouches[0].pageY;

                if(self.options.loop){
                    clearInterval(self.interval);
                    self.interval = true;
                }

                return pos;
            }

            var touchmove = function(event){
                event.preventDefault();

                var x = event.pageX || event.targetTouches[0].pageX;
                var y = event.pageY || event.targetTouches[0].pageY;

                dir.x = x > pos.x ? 'right' : 'left';
                dir.y = y > pos.y ? 'up' : 'down';

                var m = (x - pos.x) * 100 / containerWidth;

                var sign = self.options.direction == 'rtl' ? 1 : -1;
                var t = sign * (m + self.slideWidth);
                // self.container_transform('translate3d(' + (m + (sign * self.slideWidth)) + '%, 0, 0)');
                self.container_transform('translate3d(' + t + '%, 0, 0)');
            }
            
            var touchend = function(event){
                event.preventDefault();

                if(dir.x != null){
                    if(dir.x == 'right'){
                        self.move('left');
                    }else if(dir.x == 'left'){
                        self.move('right');
                    }
                }

                pos.x = null;
                pos.y = null;
                dir.x = null;
                dir.y = null;
            }

            // for mobile
            this.container.addEventListener('touchstart', start);
            this.container.addEventListener('touchmove', touchmove);
            this.container.addEventListener('touchend', touchend);
            
            // for desktop
            this.container.addEventListener('onmousedown', start);
            this.container.addEventListener('onmousedown', touchmove);
            this.container.addEventListener('onmouseup', touchend);
        }
    }

    /**
     * extend between 2 objects
     * @param Object (default object)
     * @parem Object (new object)
     * @return Object (first object with new params of obeject 2)
     */
    var extend = function(def, set){
        for(var p in set){
            if(def.hasOwnProperty(p)){
                def[p] = set[p];
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
