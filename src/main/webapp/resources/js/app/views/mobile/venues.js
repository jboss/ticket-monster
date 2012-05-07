define([
    'backbone',
    'utilities',
    'text!../../../../templates/mobile/venues.html'
], function (
    Backbone,
    utilities,
    venuesView) {

    var EventsView = Backbone.View.extend({
        render:function () {
            var cities = _.uniq(
                _.map(this.model.models, function(model){
                    return model.get('address').city
                }));
            utilities.applyTemplate($(this.el), venuesView,  {cities:cities, model:this.model})
            $(this.el).trigger('pagecreate')
        }
    });

    return EventsView;
});