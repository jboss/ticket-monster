define([
    'backbone',
    'utilities',
    'text!../../../../templates/mobile/events.html'
], function (
    Backbone,
    utilities,
    eventsView) {

    var EventsView = Backbone.View.extend({
        render:function () {
            var categories = _.uniq(
                _.map(this.model.models, function(model){
                    return model.get('category')
                }), false, function(item){
                    return item.id
                });

            utilities.applyTemplate($(this.el), eventsView,  {categories:categories, model:this.model})
            $(this.el).trigger('pagecreate')
        }
    });

    return EventsView;
});