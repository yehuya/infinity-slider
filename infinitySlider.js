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
        //============ TEST
    }

    /**
     * slider default options
     */
    Slider.prototype.options = {
        dot: true,
        loop: false,
        infinity: true,
        speed: 500,
        direction: 'rtl',
        classes: {
            root: 'infinity-slider',
            slides: 'infinity-slider-slide',
            dot: 'infinity-slider-dot',
            container: 'infinity-slider-container'
        }
    }

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
        var dot = document.createElement('div');
            dot.classList.add(options.classes.dot);

        // clone and append parent child into container
        while(this.element.childNodes.length > 0){
            var child = this.element.firstChild;
            var clone = child.cloneNode(true);
            this.element.removeChild(child);

            if(child.nodeName != "#text"){
                clone.classList.add(this.options.classes.slides);

                // create dot for this slide
                var span = document.createElement('span');
                dot.appendChild(span);
            }

            container.appendChild(clone);
        }

        this.element.appendChild(container);
        this.element.appendChild(dot);
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
