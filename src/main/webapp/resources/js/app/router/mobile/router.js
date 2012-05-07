/**
 * A module for the router of the desktop application.
 *
 */
define("router",[
    'jquery',
    'jquerymobile',
    'underscore',
    'backbone',
    'app/models/booking',
    'app/models/event',
    'app/models/venue',
    'app/collections/bookings',
    'app/collections/events',
    'app/collections/venues',
    'app/views/mobile/about',
    'app/views/mobile/events',
    'app/views/mobile/venues',
    'app/views/mobile/create-booking',
    'app/views/mobile/bookings',
    'app/views/mobile/event-detail',
    'app/views/mobile/venue-detail',
    'app/views/mobile/booking-detail',
    'text!../templates/mobile/home-view.html',
    'utilities'
],function ($,
            jqm,
            _,
            Backbone,
            Booking,
            Event,
            Venue,
            Bookings,
            Events,
            Venues,
            AboutView,
            EventsView,
            VenuesView,
            CreateBookingView,
            BookingsView,
            EventDetailView,
            VenueDetailView,
            BookingDetailView,
            HomeViewTemplate,
            utilities) {

    // prior to creating an starting the router, we disable jQuery Mobile's own routing mechanism
    $.mobile.hashListeningEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.pushStateEnabled = false;

    /**
     * The Router class contains all the routes within the application - i.e. URLs and the actions
     * that will be taken as a result.
     *
     * @type {Router}
     */
    var Router = Backbone.Router.extend({
        routes:{
            "":"home",
            "events":"events",
            "events/:id":"eventDetail",
            "venues":"venues",
            "venues/:id":"venueDetail",
            "about":"about",
            "book/:showId/:performanceId":"bookTickets",
            "bookings":"listBookings",
            "bookings/:id":"bookingDetail",
            "ignore":"ignore",
            "*actions":"defaultHandler"
        },
        defaultHandler:function (actions) {
            if ("" != actions) {
                $.mobile.changePage("#" + actions, {transition:'slide', changeHash:false, allowSamePageTransition:true})
            }
        },
        home:function () {
            utilities.applyTemplate($("#container"), HomeViewTemplate);
            try {
                $("#container").trigger('pagecreate')
            } catch (e) {
                // workaround for a spurious error thrown when creating the page initially
            }
        },
        events:function () {
            var events = new Events;
            var eventsView = new EventsView({model:events, el:$("#container")});
            events.bind("reset",
                function () {
                    eventsView.render()
                }).fetch();
        },
        venues:function () {
            var venues = new Venues;
            var venuesView = new VenuesView({model:venues, el:$("#container")})
            venues.bind("reset",
                function () {
                    venuesView.render()
                }).fetch()
        },
        about:function () {
            new AboutView({el:$("#container")}).render();
        },
        bookTickets:function (showId, performanceId) {
            var createBookingView = new CreateBookingView({model:{showId:showId, performanceId:performanceId, bookingRequest:{tickets:[]}}, el:$("#container")});
            createBookingView.render();
        },
        listBookings:function () {
            var bookings = new Bookings();
            var bookingsView = new BookingsView({model:bookings, el:$("#container")})
            bookings.bind("reset",
                function () {
                    bookingsView.render()
                }).bind("destroy",
                function () {
                    this.fetch()
                }).fetch();
        },
        eventDetail:function (id) {
            var model = new Event({id:id});
            var eventDetailView = new EventDetailView({model:model, el:$("#container")});
            model.bind("change",
                function () {
                    eventDetailView.render()
                    $.mobile.changePage($("#container"), {transition:'slide', changeHash:false});
                }).fetch();
        },
        venueDetail:function (id) {
            var model = new Venue({id:id});
            var venueDetailView = new VenueDetailView({model:model, el:$("#container")});
            model.bind("change",
                function () {
                    venueDetailView.render()
                    $.mobile.changePage($("#container"), {transition:'slide', changeHash:false});
                }).fetch();
        },
        bookingDetail:function (id) {
            var bookingModel = new Booking({id:id});
            var bookingDetailView = new BookingDetailView({model:bookingModel, el:$("#content")})
            bookingModel.bind("change",
                function () {
                    bookingDetailView.render();
                }).fetch();
        }
    });

    // Create a router instance
    var router = new Router();

    // Begin routing
    Backbone.history.start();

    return router;
});