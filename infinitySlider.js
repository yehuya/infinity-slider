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
        classes: {
            slides: 'slide',
            dot: 'dot',
            container: 'container'
        }
    }

    /**
     * slider init 
     * - add slider class
     * - creaete container div
     */
    Slider.prototype.init = function(){
        var options = this.options;

        // create container elem   
        var container = document.createElement('div');
            container.classList.add(options.classes.container);

        // clone and append parent child into container
        while(this.element.childNodes.length > 0){
            var child = this.element.firstChild;
            var clone = child.cloneNode(true);
            this.element.removeChild(child);

            if(child.nodeName != "#text"){
                clone.classList.add(this.options.classes.slides);
            }

            container.appendChild(clone);
        }

        this.element.appendChild(container);        
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
