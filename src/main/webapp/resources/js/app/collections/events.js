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
        url:"rest/events", // the URL for performing CRUD operations
        model: Event,
        id:"id", // the 'id' property of the model is the identifier
        comparator:function (model) {
            return model.get('category').id;
        }
    });
    return Events;
});