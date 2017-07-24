Poly = function() {
    var ns = {};
    ns.initialize = initialize;
    ns.keyDownHandler = keyDownHandler;
    ns.mapIds = [];
    ns.selectedShape = null;
    ns.maps = [];
    ns.drawmans = [];
    ns.afterLoad = function(){};
    ns.customFunctions = [];
    ns.mapChangedEvent = function(map){};

    ns.drawingManagerOptions = {
        map: null,
        circleOptions: {
            fillColor: '#EFDA7A',
            draggable: false,
            fillOpacity: .2,
            strokeWeight: 0.5
        },
        polygonOptions: {
            fillColor: '#EFDA7A',
            draggable: false,
            fillOpacity: .2,
            strokeWeight: 0.5
        },
        rectangleOptions: {
            fillColor: '#EFDA7A',
            draggable: false,
            fillOpacity: .2,
            strokeWeight: 0.5
        },
        drawingControlOptions: {

        }
    };

    ns.byId = function (s) {
        return document.getElementById(s)
    };

    ns.deleteShape = deleteShape;

    function deleteShape(shape){
        if(shape != null){
            var map = shape.getMap();
            shape.setMap(null);
            for (var i = 0; i < ns.shapes.length; ++i) {
                if(ns.shapes[i] == shape){
                    ns.shapes.splice(i, 1);
                    break;
                }
            }

            if(ns.selectedShape == shape)
                ns.selectedShape = null;

            ns.mapChangedEvent(map);
        }
    }

    function keyDownHandler(e){
        switch(e.which){
            //delete key
            case 46:
                if(ns.selectedShape != null){
                    ns.deleteShape(ns.selectedShape);
                }
            case 17:
            default:
                if(e.ctrlKey && e.which != 17){
                    //alert(e.which + " was pressed.");
                }
        }

    }

    function initialize() {


        var clearSelection = function () {
            if (ns.selectedShape) {
                ns.selectedShape.set((ns.selectedShape.type === google.maps.drawing.OverlayType.MARKER) ? 'draggable' : 'editable', false);
                ns.selectedShape.set('draggable', false);
                ns.selectedShape = null;
            }
        },
        setSelection = function (shape) {
            clearSelection();
            ns.selectedShape = shape;
            ns.selectedShape.set((ns.selectedShape.type === google.maps.drawing.OverlayType.MARKER) ? 'draggable' : 'editable', true);
            ns.selectedShape.set('draggable', true);
        },
        clearShapes = function () {
            for (var i = 0; i < Poly.shapes.length; ++i) {
                Poly.shapes[i].setMap(null);
            }
            Poly.shapes = [];
        };
        //http://stackoverflow.com/questions/19614805/how-to-save-a-google-maps-overlay-shape-in-the-database
        var goo = google.maps;
        ns.mapIds.forEach(function(entry){
            try{
                ns.maps[entry] = new goo.Map(document.getElementById(entry),
                    {
                        zoom: 9,
                        center: new goo.LatLng(33.5, -112)
                    });
                ns.drawmans[entry] = new goo.drawing.DrawingManager($.extend(ns.drawingManagerOptions, {map: ns.maps[entry]}));

                goo.event.addListener(ns.drawmans[entry], 'overlaycomplete', function (e) {
                    var shape = e.overlay;
                    shape.type = e.type;
                    goo.event.addListener(shape, 'click', function () {
                        setSelection(this);
                    });
                    goo.event.addListener(shape, 'mouseup', function () {
                        ns.mapChangedEvent(shape.getMap());
                    });
                    setSelection(shape);
                    Poly.shapes.push(shape);
                    ns.mapChangedEvent(shape.getMap());
                });

                goo.event.addListener(ns.maps[entry], 'click', clearSelection);

                jQuery(document).on('mouseenter', '#' + entry + " > div", function () {
                    jQuery(document).keydown (ns.keyDownHandler);
                });

                jQuery(document).on('mouseleave', '#' + entry + " > div", function () {
                    jQuery(document).unbind ('keydown',ns.keyDownHandler);
                });

                ns.customFunctions.forEach(function(customFunction, index, array){
                    ns.addCustomFunction(customFunction, ns.maps[entry]);
                });
            }   catch (e){
                console.error("Could not load map with id: " + entry + "\n" + e.message);
            }
        });

        ns.fitMapToPolygons = function(mapId){
            if(Poly.shapes.length == 0)
                return;

            var bounds= new google.maps.LatLngBounds();
            for (var i=0; i < Poly.shapes.length; i++){
                var paths = Poly.shapes[i].getPaths();
                paths.forEach(function(path){
                    var ar = path.getArray();
                    for(var i=0, l = ar.length; i <l; i++){
                        bounds.extend(ar[i]);
                    }
                })
            }
            Poly.maps[mapId].fitBounds(bounds);
        }

        var    shapes = [];

        ns.shapes = shapes;
        ns.goo = goo;
        ns.clearShapes = clearShapes;
        ns.setSelection = setSelection;
        ns.afterLoad();
    }//!initialize

    ns.addCustomFunction = function(customFunction, map){
        // Create the DIV to hold the control and call the CustomControl() constructor passing in this DIV.
        var customControlDiv = document.createElement('div');
        var customControl = new CustomControl(customControlDiv, map);

        customControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(customControlDiv);

        function CustomControl(controlDiv, map) {

            // Set CSS for the control border
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#ffff99';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '1px';
            controlUI.style.borderColor = '#ccc';
            controlUI.style.height = '23px';
            controlUI.style.marginTop = '5px';
            controlUI.style.marginLeft = '-6px';
            controlUI.style.paddingTop = '1px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.title = customFunction.label;
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior
            var controlText = document.createElement('div');
            controlText.style.fontFamily = 'Arial,sans-serif';
            controlText.style.fontSize = '10px';
            controlText.style.paddingLeft = '4px';
            controlText.style.paddingRight = '4px';
            controlText.style.marginTop = '-8px';
            controlText.innerHTML = customFunction.label;
            controlUI.appendChild(controlText);

            // Setup the click event listeners
            google.maps.event.addDomListener(controlUI, 'click', customFunction.onClick);
        }
    };

    ns.getShapes = function(mapId){
        var map = ns.maps[mapId];
        var shapes = [];
        ns.shapes.forEach(function(shape){
            if(shape.map == map){
                shapes.push(shape);
            }
        });

        return shapes;
    };

    ns.setShapes = function(shapes, mapId){

    };

    return ns;
}();

var IO={
  //returns array with storable google.maps.Overlay-definitions
  //array with google.maps.Overlays
  //boolean indicating whether pathes should be stored encoded
    IN:function(arr,encoded){
      
        var shapes = [],
        goo = google.maps,shape,tmp;
      
        for(var i = 0; i < arr.length; i++){   
            
            shape=arr[i];
            tmp={type:this.t_(shape.type)||shape.type,id:shape.id||null};

            switch(tmp.type){
                case 'CIRCLE':
                    tmp.radius=shape.getRadius();
                    tmp.geometry=this.p_(shape.getCenter());
                    break;
                case 'MARKER': 
                    tmp.geometry=this.p_(shape.getPosition());   
                    break;  
                case 'RECTANGLE': 
                    tmp.geometry=this.b_(shape.getBounds()); 
                    break;   
                case 'POLYLINE': 
                    tmp.geometry=this.l_(shape.getPath(),encoded);
                    break;   
                case 'POLYGON': 
                    tmp.geometry=this.m_(shape.getPaths(),encoded);
                    break;   
            }
            shapes.push(tmp);
        }

        return shapes;
    },
    //returns array with google.maps.Overlays
    //array containg the stored shape-definitions
    //map where to draw the shapes
    OUT:function(arr,map){
        
        var shapes = [],
        goo = google.maps,
        map = map || null,
        shape,
        tmp;
      
        for(var i = 0; i < arr.length; i++){
            
            shape=arr[i];       
        
            switch(shape.type){
                case 'CIRCLE':
                    tmp=new goo.Circle({radius:Number(shape.radius),center:this.pp_.apply(this,shape.geometry)});
                    break;
                case 'MARKER': 
                    tmp=new goo.Marker({position:this.pp_.apply(this,shape.geometry)});
                    break;  
                case 'RECTANGLE': 
                    tmp=new goo.Rectangle({bounds:this.bb_.apply(this,shape.geometry)});
                    break;   
                case 'POLYLINE': 
                    tmp=new goo.Polyline({path:this.ll_(shape.geometry)});
                    break;   
                case 'POLYGON': 
                    tmp=new goo.Polygon({paths:this.mm_(shape.geometry)});
                    break;   
           }
           tmp.type = shape.type;
           tmp.setValues({map:map,id:shape.id})
           shapes.push(tmp);
        }
        return shapes;
    },
    l_:function(path,e){
    
        path=(path.getArray) ? path.getArray() : path;
        if(e){
            return google.maps.geometry.encoding.encodePath(path);
        }else{
            var r=[];
            for(var i=0;i<path.length;++i){
                r.push(this.p_(path[i]));
            }
            return r;
        }
    },
    ll_:function(path){
      
        if(typeof path==='string'){
            return google.maps.geometry.encoding.decodePath(path);
        }else{
            var r=[];
            for(var i=0;i<path.length;++i){
                r.push(this.pp_.apply(this,path[i]));
            }
            return r;
        }
    },

    m_:function(paths,e){
        var r=[];
        paths=(paths.getArray)?paths.getArray():paths;
        for(var i=0;i<paths.length;++i){
            r.push(this.l_(paths[i],e));
        }
        return r;
    },
    mm_:function(paths){
        var r=[];
        for(var i=0;i<paths.length;++i){
            r.push(this.ll_.call(this,paths[i]));
        }
        return r;
    },
    p_:function(latLng){
        return([latLng.lat(),latLng.lng()]);
    },
    pp_:function(lat,lng){
        return new google.maps.LatLng(lat,lng);
    },
    b_:function(bounds){
        return([this.p_(bounds.getSouthWest()),
            this.p_(bounds.getNorthEast())]);
    },
    bb_:function(sw,ne){
        return new google.maps.LatLngBounds(
                this.pp_.apply(this,sw),
                this.pp_.apply(this,ne)
            );
    },
    t_:function(s){
        var t=['CIRCLE','MARKER','RECTANGLE','POLYLINE','POLYGON'];
        for(var i=0;i<t.length;++i){
            if(s===google.maps.drawing.OverlayType[t[i]]){
                return t[i];
            }
        }
    }
  
};



google.maps.event.addDomListener(window, 'load', Poly.initialize);