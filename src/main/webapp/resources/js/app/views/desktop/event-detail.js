define([
    'backbone',
    'utilities',
    'require',
    'text!../../../../templates/desktop/event-detail.html',
    'text!../../../../templates/desktop/media.html',
    'text!../../../../templates/desktop/event-venue-description.html',
    'bootstrap'
], function (
    Backbone,
    utilities,
    require,
    eventDetailTemplate,
    mediaTemplate,
    eventVenueDescriptionTemplate) {

    var EventDetail = Backbone.View.extend({

        events:{
            "click input[name='bookButton']":"beginBooking",
            "change select[id='venueSelector']":"refreshShows",
            "change select[id='dayPicker']":"refreshTimes"
        },

        render:function () {
            $(this.el).empty()
            utilities.applyTemplate($(this.el), eventDetailTemplate, this.model.attributes);
            $("#bookingOption").hide();
            $("#venueSelector").attr('disabled', true);
            $("#dayPicker").empty();
            $("#dayPicker").attr('disabled', true)
            $("#performanceTimes").empty();
            $("#performanceTimes").attr('disabled', true)
            var self = this
            $.getJSON("rest/shows?event=" + this.model.get('id'), function (shows) {
                self.shows = shows
                $("#venueSelector").empty().append("<option value='0'>Select a venue</option>");
                $.each(shows, function (i, show) {
                    $("#venueSelector").append("<option value='" + show.id + "'>" + show.venue.address.city + " : " + show.venue.name + "</option>")
                });
                $("#venueSelector").removeAttr('disabled')
                if ($("#venueSelector").val()) {
                    $("#venueSelector").change()
                }
            })
        },
        beginBooking:function () {
            require("router").navigate('/book/' + $("#venueSelector option:selected").val() + '/' + $("#performanceTimes").val(), true)
        },
        refreshShows:function (event) {
            $("#dayPicker").empty();

            var selectedShowId = event.currentTarget.value;

            if (selectedShowId != 0) {
                var selectedShow = _.find(this.shows, function (show) {
                    return show.id == selectedShowId
                });
                this.selectedShow = selectedShow;
                utilities.applyTemplate($("#eventVenueDescription"), eventVenueDescriptionTemplate, {venue:selectedShow.venue});
                var times = _.uniq(_.sortBy(_.map(selectedShow.performances, function (performance) {
                    return (new Date(performance.date).withoutTimeOfDay()).getTime()
                }), function (item) {
                    return item
                }));
                utilities.applyTemplate($("#venueMedia"), mediaTemplate, selectedShow.venue)
                $("#dayPicker").removeAttr('disabled')
                $("#performanceTimes").removeAttr('disabled')
                _.each(times, function (time) {
                    var date = new Date(time)
                    $("#dayPicker").append("<option value='" + date.toYMD() + "'>" + date.toPrettyStringWithoutTime() + "</option>")
                })
                this.refreshTimes()
                $("#bookingWhen").show(100)
            } else {
                $("#bookingWhen").hide(100)
                $("#bookingOption").hide()
                $("#dayPicker").empty()
                $("#venueMedia").empty()
                $("#eventVenueDescription").empty()
                $("#dayPicker").attr('disabled', true)
                $("#performanceTimes").empty()
                $("#performanceTimes").attr('disabled', true)
            }

        },
        refreshTimes:function () {
            var selectedDate = $("#dayPicker").val();
            $("#performanceTimes").empty()
            if (selectedDate) {
                $.each(this.selectedShow.performances, function (i, performance) {
                    var performanceDate = new Date(performance.date);
                    if (_.isEqual(performanceDate.toYMD(), selectedDate)) {
                        $("#performanceTimes").append("<option value='" + performance.id + "'>" + performanceDate.getHours().toZeroPaddedString(2) + ":" + performanceDate.getMinutes().toZeroPaddedString(2) + "</option>")
                    }
                })
            }
            $("#bookingOption").show()
        }

    });

    return  EventDetail;
});