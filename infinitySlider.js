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

        this.element = elem;

        //============ TEST
            this.init();
            this.width();
            this.speed();
            this.arrow();
        //============ TEST
    }

    /**
     * slider default options
     */
    Slider.prototype.options = {
        dot: true,
        arrow: true,
        loop: false,
        infinity: false,
        speed: 500,
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
    }

    /**
     * set slider speed
     * - set transition on the container with options.speed param
     */
    Slider.prototype.speed = function(){
       var transition = ['transition', 'webkitTransition', 'mozTransition'];
       for(var i = 0 ; i < transition.length ; i++){
           this.container.style[transition[i]] = this.options.speed + 'ms';
       }
    }

    /**
     * set slider movement
     * direction left / right
     * @param String (direction of movement)
     */
    Slider.prototype.move = function(direction){
        var options = this.options;
        var transform = ['transform', 'webkitTransform', 'mozTransform'];
        var slideLength = this.slides.length - 1;

        if(options.infinity){

        }else{
            if(direction == 'left'){
                this.current++;
            }else if(direction == 'right'){
                this.current--;
            }

            if(this.current < 0){
                 this.current = 0;
                 this.arrow.right.classList.add(options.classes.arrow.hide); // hide right arrow
            }else{
                if(this.arrow.right.classList.contains(options.classes.arrow.hide)){
                    this.arrow.right.classList.remove(options.classes.arrow.hide); // show right arrow
                }
            }

            if(this.current > slideLength){
                this.current = slideLength;
                this.arrow.left.classList.add(options.classes.arrow.hide); // hide left arrow
            }else{
                if(this.arrow.left.classList.contains(options.classes.arrow.hide)){
                    this.arrow.left.classList.remove(options.classes.arrow.hide); // show left arrow
                }
            }

            for(var i = 0 ; i < transform.length ; i++){
                this.container.style[transform[i]] = 'translate3d(-' + this.slideWidth * this.current + '%, 0, 0)';
            }
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

            if(!options.infinity){
                right.classList.add(options.classes.arrow.hide); // hide unnecessary arrow 
            }
            
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
})();
