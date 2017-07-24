/**
 * Created by joeyn on 5/29/2017.
 */
Polygons = function(){
    var ns = {};
    ns.listId = 'polygonList';
    ns.currentPolygonId = null;

    ns.newPolygon = function(){
        $.ajax({
            type: 'get',
            url: '/underwriting/Polygons/renderPolygon',
            data: {},
            success: function (response) {
                addPolygonHtmlToList(response);
            },
            error: function (response) {
                jQuery('#exception').removeClass('hidden').html(response.responseText);
            }
        });
    }

    ns.savePolygon = function($polygonLi){
        $.ajax({
            type: 'post',
            url: '/underwriting/Polygons/apiSavePolygon',
            data: $polygonLi.find('form').serializeObject(),
            success: function (response) {
                if($polygonLi.find('[name=id]').length == 0){
                    $polygonLi.find('form').append('<input type="hidden" name="id">');
                    $polygonLi.find('[name=id]').val(JSON.parse(response).id);
                }
            },
            error: function (response) {
                jQuery('#exception').removeClass('hidden').html(response.responseText);
            }
        });
    }

    ns.deletePolygon = function(polygonLi){

    }

    ns.loadPolygon = function(polygonLi){
        var shapeOptions = {
            zIndex: 1,
            draggable: false,
            fillOpacity: .2,
            strokeWeight: 0.5,
            fillColor: '#00cc00'
        };
        Poly.clearShapes();
        if(polygonLi.find('[name=include_polygons]').val() == "")
            polygonLi.find('[name=include_polygons]').val("{}");

        var shapes = IO.OUT(JSON.parse(polygonLi.find('[name=include_polygons]').val()), Poly.maps['map']);
        shapes.forEach(function(shape){
            shape.exclude = false;
            shape.setOptions(shapeOptions);
            Poly.shapes.push(shape);
            Poly.goo.event.addListener(shape, 'click', function () {
                Poly.setSelection(this);
            });
            Poly.goo.event.addListener(shape, 'mouseup', function () {
                Poly.mapChangedEvent(this.getMap());
            });

        });

        if(polygonLi.find('[name=exclude_polygons]').val() == "")
            polygonLi.find('[name=exclude_polygons]').val("{}");

        var shapes = IO.OUT(JSON.parse(polygonLi.find('[name=exclude_polygons]').val()), Poly.maps['map']);
        shapes.forEach(function(shape) {
            shape.exclude = true;
            shape.setOptions(shapeOptions);
            shape.setOptions({fillColor: '#cc0000'});
            Poly.shapes.push(shape);

            Poly.goo.event.addListener(shape, 'click', function () {
                Poly.setSelection(this);
            });
            Poly.goo.event.addListener(shape, 'mouseup', function () {
                Poly.mapChangedEvent(this.getMap());
            });

        });

        Poly.fitMapToPolygons('map');

    }

    function removePolygonFromList(polygonLi){

    }

    function addPolygonHtmlToList(html){
        var $newElement = jQuery(html);
        ns.currentPolygonId = $newElement.find('div.polygon').attr('id');
        jQuery('#' + Polygons.listId).prepend($newElement);
    }


    function initialize(){

    }

    jQuery(initialize);

    return ns;
}();

Poly.drawingManagerOptions.drawingControlOptions.drawingModes = [/* 'rectangle', 'circle', */ 'polygon'];
Poly.mapIds = ["map"];
Poly.customFunctions = [{
    label: "Toggle",
    onClick: function(){
        if(Poly.selectedShape) {
            if (!Poly.selectedShape.exclude) {
                Poly.selectedShape.exclude = true;
                Poly.selectedShape.setOptions({fillColor: '#cc0000', zIndex: 5});
            } else {
                Poly.selectedShape.exclude = false;
                Poly.selectedShape.setOptions({fillColor: '#00cc00', zIndex: 1});
            }

            Poly.mapChangedEvent(Poly.selectedShape.getMap());
        }
    }
}];

Poly.mapChangedEvent = function(map){
    var includeShapes = [];
    var excludeShapes = [];

    Poly.shapes.forEach(function(shape){
        if(shape.getMap() == map){
            if(!shape.exclude){
                includeShapes.push(shape);
            } else {
                excludeShapes.push(shape);
            }
        }
    });

    jQuery('#' + Polygons.currentPolygonId + " [name=include_polygons]").val(JSON.stringify(IO.IN(includeShapes, false)));
    jQuery('#' + Polygons.currentPolygonId + " [name=exclude_polygons]").val(JSON.stringify(IO.IN(excludeShapes, false)));

    console.log("Map Changed!");
}

Poly.afterLoad = function(){
    Poly.maps['map'].addListener('mouseup', function(){console.log("Mouse Up!")});
}

Poly.drawingManagerOptions.circleOptions.fillColor = '#00cc00';
Poly.drawingManagerOptions.polygonOptions.fillColor = '#00cc00';
Poly.drawingManagerOptions.rectangleOptions.fillColor = '#00cc00';

jQuery(function(){jQuery('#newPolygon').click(function(e){
    Polygons.newPolygon();
    e.preventDefault();
})});

function Collapse(){

}

jQuery(
    function(){
        jQuery('#polygonList').on('click', 'polygon .delete', function(e){
            Polygons.deletePolygon(jQuery(this));
            e.preventDefault();
        });

        jQuery('#polygonList').on('click', '.polygon', function(e){
            if(jQuery(e.target).is('a.name-link')){
                Polygons.loadPolygon(jQuery(this));
                Polygons.currentPolygonId = jQuery(this).find('.collapse').attr('id');
            }

            if(jQuery(e.target).is('a.save')){
                Polygons.savePolygon(jQuery(this));
                e.preventDefault();
            }

            if(jQuery(e.target).is('a.name-link')){
                /* Hide any open Polygons */
                jQuery('#polygonList .polygon .in').collapse('toggle');
            }

        });

        jQuery('#polygonList').on('keyup', '.polygon input[name=name]', function(e){
            var $this = jQuery(this);
            $this.closest('.polygon').find('a.name-link').text($this.val());
            
        });
    });

