/**
 * Module for the Event model
 */
define([ 
    'backbone' // depends and imports Backbone
], function (Backbone) {
    /**
     * The Event model class definition
     * Used for CRUD operations against individual events
     */
    var Event = Backbone.Model.extend({
        urlRoot:'rest/events' // the URL for performing CRUD operations
    });
    // export the Event class
    return Event;
});