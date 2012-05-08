define([
    'backbone',
    'utilities',
    'require',
    'text!../../../../templates/mobile/booking-details.html',
    'text!../../../../templates/mobile/create-booking.html',
    'text!../../../../templates/mobile/confirm-booking.html',
    'text!../../../../templates/mobile/ticket-entries.html',
    'text!../../../../templates/mobile/ticket-summary-view.html'
], function (
    Backbone,
    utilities,
    require,
    bookingDetailsTemplate,
    createBookingTemplate,
    confirmBookingTemplate,
    ticketEntriesTemplate,
    ticketSummaryViewTemplate) {

    var TicketCategoriesView = Backbone.View.extend({
        id:'categoriesView',
        events:{
            "change input":"onChange"
        },
        render:function () {
            var views = {};

            if (this.model != null) {
                var ticketPrices = _.map(this.model, function (item) {
                    return item.ticketPrice;
                });
                utilities.applyTemplate($(this.el), ticketEntriesTemplate, {ticketPrices:ticketPrices});
            } else {
                $(this.el).empty();
            }
            $(this.el).trigger('pagecreate');
            return this;
        },
        onChange:function (event) {
            var value = event.currentTarget.value;
            var ticketPriceId = $(event.currentTarget).data("tm-id");
            var modifiedModelEntry = _.find(this.model, function(item) { return item.ticketPrice.id == ticketPriceId});
            if ($.isNumeric(value) && value > 0) {
                modifiedModelEntry.quantity = parseInt(value);
            }
            else {
                delete modifiedModelEntry.quantity;
            }
        }
    });

     var TicketSummaryView = Backbone.View.extend({
        render:function () {
            utilities.applyTemplate($(this.el), ticketSummaryViewTemplate, this.model.bookingRequest)
        }
    });

    var ConfirmBookingView = Backbone.View.extend({
        events:{
            "click a[id='saveBooking']":"save",
            "click a[id='goBack']":"back"
        },
        render:function () {
            utilities.applyTemplate($(this.el), confirmBookingTemplate, this.model)
            this.ticketSummaryView = new TicketSummaryView({model:this.model, el:$("#ticketSummaryView")});
            this.ticketSummaryView.render();
            $(this.el).trigger('pagecreate')
        },
        back:function () {
            require("router").navigate('book/' + this.model.bookingRequest.show.id + '/' + this.model.bookingRequest.performance.id, true)

        }, save:function (event) {
            var bookingRequest = {ticketRequests:[]};
            var self = this;
            _.each(this.model.bookingRequest.tickets, function (collection) {
                _.each(collection, function (model) {
                    if (model.quantity != undefined) {
                        bookingRequest.ticketRequests.push({ticketPrice:model.ticketPrice.id, quantity:model.quantity})
                    };
                })
            });

            bookingRequest.email = this.model.email;
            bookingRequest.performance = this.model.performanceId;
            $.ajax({url:"rest/bookings",
                data:JSON.stringify(bookingRequest),
                type:"POST",
                dataType:"json",
                contentType:"application/json",
                success:function (booking) {
                    utilities.applyTemplate($(self.el), bookingDetailsTemplate, booking)
                    $(self.el).trigger('pagecreate');
                }}).error(function (error) {
                    alert(error);
                });
            this.model = {};
        }
    });


    var CreateBookingView = Backbone.View.extend({

        events:{
            "click a[id='confirmBooking']":"checkout",
            "change select":"refreshPrices",
            "change input[type='number']":"updateForm",
            "change input[name='email']":"updateForm"
        },
        render:function () {

            var self = this;

            $.getJSON("rest/shows/" + this.model.showId, function (selectedShow) {
                self.model.performance = _.find(selectedShow.performances, function (item) {
                    return item.id == self.model.performanceId;
                });
                var id = function (item) {return item.id;};
                // prepare a list of sections to populate the dropdown
                var sections = _.uniq(_.sortBy(_.pluck(selectedShow.ticketPrices, 'section'), id), true, id);

                utilities.applyTemplate($(self.el), createBookingTemplate, { show:selectedShow,
                    performance:self.model.performance,
                    sections:sections});
                $(self.el).trigger('pagecreate');
                self.ticketCategoriesView = new TicketCategoriesView({model:{}, el:$("#ticketCategoriesViewPlaceholder") });
                self.model.show = selectedShow;
                self.ticketCategoriesView.render();
                $('a[id="confirmBooking"]').addClass('ui-disabled');
                $("#sectionSelector").change();
            });

        },
        refreshPrices:function (event) {
            if (event.currentTarget.value != "Choose a section") {
                var ticketPrices = _.filter(this.model.show.ticketPrices, function (item) {
                    return item.section.id == event.currentTarget.value;
                });
                var ticketPriceInputs = new Array();
                _.each(ticketPrices, function (ticketPrice) {
                    var model = {};
                    model.ticketPrice = ticketPrice;
                    ticketPriceInputs.push(model);
                });
                $("#ticketCategoriesViewPlaceholder").show();
                this.ticketCategoriesView.model = ticketPriceInputs;
                this.ticketCategoriesView.render();
                $(this.el).trigger('pagecreate');
            } else {
                $("#ticketCategoriesViewPlaceholder").hide();
                this.ticketCategoriesView.model = new Array();
                this.updateForm();
            }
        },
        checkout:function () {
            this.model.bookingRequest.tickets.push(this.ticketCategoriesView.model);
            this.model.performance = new ConfirmBookingView({model:this.model, el:$("#container")}).render();
            $("#container").trigger('pagecreate');
        },
        updateForm:function () {

            var totals = _.reduce(this.ticketCategoriesView.model, function (partial, model) {
                if (model.quantity != undefined) {
                    partial.tickets += model.quantity;
                    partial.price += model.quantity * model.ticketPrice.price;
                    return partial;
                }
            }, {tickets:0, price:0.0});
            this.model.email = $("input[type='email']").val();
            this.model.bookingRequest.totals = totals;
            if (totals.tickets > 0 && $("input[type='email']").val()) {
                $('a[id="confirmBooking"]').removeClass('ui-disabled');
            } else {
                $('a[id="confirmBooking"]').addClass('ui-disabled');
            }
        }
    });
    return CreateBookingView;
});