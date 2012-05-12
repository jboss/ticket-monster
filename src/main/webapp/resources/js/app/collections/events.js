/**
 * Module for the Events collection
 */
define([
    // Backbone and the collection element type are dependencies
    'backbone',
    'app/models/event'
], function (Backbone, Event) {
    /**
     *  Here we define the Bookings collection
     *  We will use it for CRUD operations on Bookings
     */
    var Events = Backbone.Collection.extend({
        url:"rest/events",
        model: Event,
        id:"id",
        comparator:function (model) {
            return model.get('category').id;
        }
    });
    return Events;
});