/**
 * Shortcut alias definitions - will come in handy when declaring dependencies
 * Also, they allow you to keep the code free of any knowledge about library 
 * locations and versions
 */
require.config({
    paths: {
        jquery:'libs/jquery-1.7.1',
        jquerymobile:'libs/jquery.mobile-1.1.0',
        text:'libs/text',
        order: 'libs/order',
        utilities: 'app/utilities',
        router:'app/router/mobile/router'
    }
});

define('underscore',[
    'libs/underscore'
], function(){
    return _;
});

define("backbone", [
    'order!jquery',
    'order!underscore',
    'order!libs/backbone'
], function(){
    return Backbone;
});


// Now we declare all the dependencies
require(['router'],
       function(){
    console.log('all loaded')
});
