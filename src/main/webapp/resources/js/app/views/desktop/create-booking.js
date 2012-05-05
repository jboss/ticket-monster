define([
    'backbone',
    'utilities',
    'require',
    'text!../../../../templates/desktop/booking-confirmation.html',
    'text!../../../../templates/desktop/create-booking.html',
    'text!../../../../templates/desktop/ticket-categories.html',
    'text!../../../../templates/desktop/ticket-summary-view.html',
    'bootstrap'
],function (
    Backbone,
    utilities,
    require,
    bookingConfirmationTemplate,
    createBookingTemplate,
    ticketEntriesTemplate,
    ticketSummaryViewTemplate){


    var TicketCategoriesView = Backbone.View.extend({
        id:'categoriesView',
        events:{
            "change input":"onChange"
        },
        render:function () {
            if (this.model != null) {
                var priceCategories = _.map(this.model, function (item) {
                    return item.priceCategory;
                });
                utilities.applyTemplate($(this.el), ticketEntriesTemplate, {priceCategories:priceCategories});
            } else {
                $(this.el).empty();
            }
            return this;
        },
        onChange:function (event) {
            var value = event.currentTarget.value;
            var priceCategoryId = $(event.currentTarget).data("tm-id");
            var modifiedModelEntry = _.find(this.model, function(item) { return item.priceCategory.id == priceCategoryId});
            if ($.isNumeric(value) && value > 0) {
                modifiedModelEntry.quantity = parseInt(value);
            }
            else {
                delete modifiedModelEntry.quantity;
            }
        }
    });

    var TicketSummaryView = Backbone.View.extend({
        tagName:'tr',
        events:{
            "click i":"removeEntry"
        },
        render:function () {
            var self = this;
            utilities.applyTemplate($(this.el), ticketSummaryViewTemplate, this.model.bookingRequest);
        },
        removeEntry:function () {
            this.model.tickets.splice(this.model.index, 1);
        }
    });

    var CreateBookingView = Backbone.View.extend({

        events:{
            "click input[name='submit']":"save",
            "change select":"refreshPrices",
            "keyup #email":"updateEmail",
            "click input[name='add']":"addQuantities",
            "click i":"updateQuantities"
        },
        render:function () {

            var self = this;
            $.getJSON("rest/shows/" + this.model.showId, function (selectedShow) {

                self.currentPerformance = _.find(selectedShow.performances, function (item) {
                    return item.id == self.model.performanceId;
                });

                var id = function (item) {return item.id;};
                // prepare a list of sections to populate the dropdown
                var sections = _.uniq(_.sortBy(_.pluck(selectedShow.priceCategories, 'section'), id), true, id);
                utilities.applyTemplate($(self.el), createBookingTemplate, {
                    sections:sections,
                    show:selectedShow,
                    performance:self.currentPerformance});
                self.ticketCategoriesView = new TicketCategoriesView({model:{}, el:$("#ticketCategoriesViewPlaceholder") });
                self.ticketSummaryView = new TicketSummaryView({model:self.model, el:$("#ticketSummaryView")});
                self.show = selectedShow;
                self.ticketCategoriesView.render();
                self.ticketSummaryView.render();
                $("#sectionSelector").change();
            });
        },
        refreshPrices:function (event) {
            var priceCategories = _.filter(this.show.priceCategories, function (item) {
                return item.section.id == event.currentTarget.value;
            });
            var priceCategoryInputs = new Array();
            _.each(priceCategories, function (priceCategory) {
                priceCategoryInputs.push({priceCategory:priceCategory});
            });
            this.ticketCategoriesView.model = priceCategoryInputs;
            this.ticketCategoriesView.render();
        },
        save:function (event) {
            var bookingRequest = {ticketRequests:[]};
            var self = this;
            bookingRequest.ticketRequests = _.map(this.model.bookingRequest.tickets, function (ticket) {
                return {priceCategory:ticket.priceCategory.id, quantity:ticket.quantity}
            });
            bookingRequest.email = this.model.bookingRequest.email;
            bookingRequest.performance = this.model.performanceId
            $.ajax({url:"rest/bookings",
                data:JSON.stringify(bookingRequest),
                type:"POST",
                dataType:"json",
                contentType:"application/json",
                success:function (booking) {
                    this.model = {}
                    $.getJSON('rest/shows/performance/' + booking.performance.id, function (retrievedPerformance) {
                        utilities.applyTemplate($(self.el), bookingConfirmationTemplate, {booking:booking, performance:retrievedPerformance })
                    });
                }}).error(function (error) {
                    if (error.status == 400 || error.status == 409) {
                        var errors = $.parseJSON(error.responseText).errors;
                        _.each(errors, function (errorMessage) {
                            $("#request-summary").append('<div class="alert alert-error"><a class="close" data-dismiss="alert">×</a><strong>Error!</strong> ' + errorMessage + '</div>')
                        });
                    } else {
                        $("#request-summary").append('<div class="alert alert-error"><a class="close" data-dismiss="alert">×</a><strong>Error! </strong>An error has occured</div>')
                    }

                })

        },
        addQuantities:function () {
            var self = this;

            _.each(this.ticketCategoriesView.model, function (model) {
                if (model.quantity != undefined) {
                    var found = false;
                    _.each(self.model.bookingRequest.tickets, function (ticket) {
                        if (ticket.priceCategory.id == model.priceCategory.id) {
                            ticket.quantity += model.quantity;
                            found = true;
                        }
                    });
                    if (!found) {
                        self.model.bookingRequest.tickets.push({priceCategory:model.priceCategory, quantity:model.quantity});
                    }
                }
            });
            this.ticketCategoriesView.model = null;
            $('option:selected', 'select').removeAttr('selected');
            this.ticketCategoriesView.render();
            this.updateQuantities();
        },
        updateQuantities:function () {
            // make sure that tickets are sorted by section and ticket category
            this.model.bookingRequest.tickets.sort(function (t1, t2) {
                if (t1.priceCategory.section.id != t2.priceCategory.section.id) {
                    return t1.priceCategory.section.id - t2.priceCategory.section.id;
                }
                else {
                    return t1.priceCategory.ticketCategory.id - t2.priceCategory.ticketCategory.id;
                }
            });

            this.model.bookingRequest.totals = _.reduce(this.model.bookingRequest.tickets, function (totals, ticketRequest) {
                return {
                    tickets:totals.tickets + ticketRequest.quantity,
                    price:totals.price + ticketRequest.quantity * ticketRequest.priceCategory.price
                };
            }, {tickets:0, price:0.0});

            this.ticketSummaryView.render();
            this.setCheckoutStatus();
        },
        updateEmail:function (event) {
            if ($(event.currentTarget).is(':valid')) {
                this.model.bookingRequest.email = event.currentTarget.value;

            } else {
                delete this.model.bookingRequest.email;
            }
            this.setCheckoutStatus();
        },
        setCheckoutStatus:function () {
            if (this.model.bookingRequest.totals != undefined && this.model.bookingRequest.totals.tickets > 0 && this.model.bookingRequest.email != undefined && this.model.bookingRequest.email != '') {
                $('input[name="submit"]').removeAttr('disabled');
            }
            else {
                $('input[name="submit"]').attr('disabled', true);
            }
        }
    });

    return CreateBookingView;
});