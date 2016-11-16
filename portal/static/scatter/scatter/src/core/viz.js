/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 MIT LICENSE:

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.
 */

// @version 1.0.35

vizuly.viz = {};

// The viz.create function is the base function that creates a psuedo class for all vizuly components.  It gets called
// by all vizuly components at instantiation and handles all of the boilerplate construction methods needed to create an
// encapsulated function chained vizuly object.  This is the work horse of vizuly.
//
// Here is what id does:
//
// 1. It appends a DIV tag to the parent DOM element being passed in.
// 2. It takes a 'scope' variable that it will use to attach psuedo protected properties to - to be accessed by the component
// 3. It takes an array of 'props' objects (an array of  name:value objects)  that is uses to create protected variables on the 'scope' object.
// 4. It implements a d3.disptach event handler that emits events on any property changes declared in the 'props' array.
// 5. It creates a set of interaction events that can be used by the components scope.disptach object.
// 6. It takes in any custom component 'events' as an array and adds those to the scope.disptach as well.
//

vizuly.viz.create = function(parent,scope,props,events) {

    //We set the primary scope properties
    scope.parent = parent;
    scope.selection = d3.select(parent).append("div").style("width","100%").style("height","100%");
    scope.properties = props;
    scope.id = vizuly.util.guid();

    // Adding our dispatch event that the viz will use for any attached callbacks.
    var args=[];

    // Interaction events
    args.push("mouseover");
    args.push("mouseout");
    args.push("mousedown");
    args.push("click");
    args.push("touch");
    args.push("zoom");
    args.push("zoomstart");
    args.push("zoomend");

    //Core events
    args.push("initialize");
    args.push("validate");
    args.push("measure");
    args.push("update");

    // Property (from the 'props' array) "_change" events
    // This way anyone can listen for any specific (like data) viz property changes
    Object.getOwnPropertyNames(props).forEach(function (val, idx, array) {
        args.push(val + "_change");
    });

    // Add any custom events that the component may need.
    if (events && events.length > 0) {
        events.forEach(function (d) {
            args.push(d);
        })
    }

    // Sets up all of our dispatch calls by attaching a d3.dispatch to the scope variable
    // For more info on dispatch, see here: https://github.com/mbostock/d3/wiki/Internals#d3_dispatch
    scope.dispatch = d3.dispatch.apply(this,args);

    //This is our primary constructor that sets all properties
    var viz = function () {
        setProps(viz,scope,scope.properties);
        return viz;
    };


    //For each property in our 'props' array create a callback if the property value has changed.
    setProps = function(viz,scope,props) {
        Object.getOwnPropertyNames(props).forEach(function (val, idx, array) {
            if (typeof (scope[val]) == "undefined") {
                scope[val] = props[val];
                viz[val] = function (_) {
                    if (!arguments.length) {
                        return scope[val];
                    }
                    else {
                        var oldVal = scope[val];
                        scope[val] = _;
                        if (scope[val] !== oldVal) {
                            scope.dispatch[val + "_change"].apply(this,[scope[val],oldVal]);  //Broadcast for public events
                        }
                    }
                    return viz;
                }
            }
        });
    };

    // This is the unique id for the viz - most components use this in createing a unique DOM element id.
    viz.id = function () {
        return scope.id;
    }

    // This returns the DIV element unique to the viz and created at instantiation
    viz.selection = function () {
        return scope.selection;
    };

    // This function is used to bind all callbacks to any events emitted by the dispatch object
    viz.on = function (event,listener) {
        scope.dispatch.on(event,listener);
        return viz;
    };

    // This function validates that all object properties have been set
    // Typically it is called each time the viz calls its "measure" function.
    viz.validate = function () {
        if (invalid) return;

        var invalid = []
        Object.getOwnPropertyNames(props).forEach(function (val) {
            if (!scope[val] && Number(scope[val] != 0)) {
                invalid.push(val);
            }
        })
        if (invalid.length > 0) {
            throw new Error("vizuly.util.viz.validate(): " + invalid.concat() + " need to be declared");
        }

        //We disptach a 'validate' event so we can hook in callbacks before other work is done.
        scope.dispatch.validate();

    }

    //Returns our completed object
    return viz();
};