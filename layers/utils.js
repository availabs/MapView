import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import Tooltip from  '../components/tooltip/Tooltip'
import { renderToString } from 'react-dom/server'
import { onLayerSelect, updateTooltip } from '../store/MapStore' 
import React from 'react';
import store from 'store';

export const addLayers = (mapLayer, map, layerName, beneath)  =>  {
  beneath = beneath || 'waterway-label'
  
  Object.keys(mapLayer.mapBoxSources).forEach(source => {
  	map.addSource(source, mapLayer.mapBoxSources[source])
  })

  mapLayer.mapBoxLayers.forEach(layer => {
  		map.addLayer(layer, beneath);
  })

  if(mapLayer.selectLayers) {
    boxSelect(mapLayer,map)
  }

  if (mapLayer.popup) {
    const {
      layers,
      dataFunc
    } = mapLayer.popup;
    layers.forEach(layerName => {
      addPopUp(map, layerName, dataFunc)
    })
  }

}

export const boxSelect = (mapLayer, map) => {
  map.boxZoom.disable();
  let canvas = map.getCanvasContainer();
  let selectLayers = mapLayer.selectLayers;
  let selectFilter = mapLayer.selectFilter;
  let selectProperty = mapLayer.selectProperty;
  let renderLayers = mapLayer.selectRenderLayers;
  let selection = [];

  // Variable to hold the starting xy coordinates
  // when `mousedown` occured.
  var start;

  // Variable to hold the current xy coordinates
  // when `mousemove` or `mouseup` occurs.
  var current;

  // Variable for the draw box element.
  var box;
  // Set `true` to dispatch the event before other functions
  // call it. This is necessary for disabling the default map
  // dragging behaviour.
  canvas.addEventListener('mousedown', mouseDown, true);

  
  // Return the xy coordinates of the mouse position
  function mousePos(e) {
      var rect = canvas.getBoundingClientRect();
      return new mapboxgl.Point(
          e.clientX - rect.left - canvas.clientLeft,
          e.clientY - rect.top - canvas.clientTop
      );
  }

  function mouseDown(e) {
      // Continue the rest of the function if the shiftkey is pressed.
      if (!(e.shiftKey && e.button === 0)) return;

      // Disable default drag zooming when the shift key is held down.
      map.dragPan.disable();

      // Call functions for the following events
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('keydown', onKeyDown);

      // Capture the first xy coordinates
      start = mousePos(e);
  }

  function onMouseMove(e) {
      // Capture the ongoing xy coordinates
      current = mousePos(e);

      // Append the box element if it doesnt exist
      if (!box) {
          box = document.createElement('div');
          box.classList.add('boxdraw');
          canvas.appendChild(box);
      }

      var minX = Math.min(start.x, current.x),
          maxX = Math.max(start.x, current.x),
          minY = Math.min(start.y, current.y),
          maxY = Math.max(start.y, current.y);

      // Adjust width and xy position of the box element ongoing
      var pos = 'translate(' + minX + 'px,' + minY + 'px)';
      box.style.transform = pos;
      box.style.WebkitTransform = pos;
      box.style.width = maxX - minX + 'px';
      box.style.height = maxY - minY + 'px';
  }

  function onMouseUp(e) {
      // Capture xy coordinates
      finish([start, mousePos(e)]);
  }

  function onKeyDown(e) {
      // If the ESC key is pressed
      if (e.keyCode === 27) finish();
  }

  function finish(bbox) {
      // Remove these events now that finish has been called.
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mouseup', onMouseUp);

      if (box) {
          box.parentNode.removeChild(box);
          box = null;
      }

      // If bbox exists. use this value as the argument for `queryRenderedFeatures`
      if (bbox) {
          //console.log('queryRenderedFeatures',  bbox, renderLayers)
          var features = map.queryRenderedFeatures(bbox, { layers: renderLayers });
          
          if (features.length >= 5000) {
              return window.alert('Select a smaller number of features');
          }

          // Run through the selected features and set a filter
          // to match features with unique FIPS codes to activate
          // the `counties-highlighted` layer.
          var filter = features.reduce(function(memo, feature) {
              memo.push(feature.properties[selectProperty]);
              return memo;
          }, selectFilter.slice(0));

          selection = features.map(d => d.properties[selectProperty])
          

          //map.setFilter("npmrds_primary_selected", filter);
          selectLayers.forEach( layer => {
            //console.log(["all",...layer.defaultFilters,filter])
            map.setFilter(
              layer.name, 
              ["all",...layer.defaultFilters,filter]
            );  
          })
          
      }

      map.dragPan.enable();
      store.dispatch(onLayerSelect(selection, mapLayer.id))
  }
}

export const toggleVisibility = (mapLayer, map) => {
  mapLayer.mapBoxLayers.forEach(layer => {
    map.getLayoutProperty(layer.id, 'visibility') === 'visible' 
      ? map.setLayoutProperty(layer.id, 'visibility', 'none')
      : map.setLayoutProperty(layer.id, 'visibility', 'visible')
  })
}


export const removeLayers = (mapLayer, map) => {
	mapLayer.mapBoxLayers.forEach(layer => {
  		map.removeLayer(layer.id)
  	})
  Object.keys(mapLayer.mapBoxSources).forEach(source => {
    map.removeSource(source)
  })
}


// export const addPopUp =  (map, layer, options) => {
//     var popup = new mapboxgl.Popup({
//         closeButton: false,
//         closeOnClick: false
//     });



//     map.on('mouseenter', layer, function(e) {
//         // Change the cursor style as a UI indicator.
//         map.getCanvas().style.cursor = 'pointer';

//         var coordinates = e.features[0].geometry.coordinates.slice();
//         var description = e.features[0].properties.Vehicles;

//         // Ensure that if the map is zoomed out such that multiple
//         // copies of the feature are visible, the popup appears
//         // over the copy being pointed to.
//         while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//             coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//         }
//         let tooltiphtml = renderToString(<Tooltip rows={options.rows} feature={e.features[0]} />)

//         // Populate the popup and set its coordinates
//         // based on the feature found.
//         popup.setLngLat(coordinates)
//             .setHTML(tooltiphtml)
//             .addTo(map);
//     });

//     map.on('mouseleave', layer, function() {
//         map.getCanvas().style.cursor = '';
//         popup.remove();
//     });
// }

const addPopUp = (map, layerName, dataFunc) => {

    map.on("mousemove", layerName, e => {
        map.getCanvas().style.cursor = 'pointer';

        const { pinned } = store.getState().map.tooltip;
        if (pinned) return;

        if ((typeof dataFunc === "function") && e.features.length) {
            store.dispatch(updateTooltip({
                pos: [e.point.x, e.point.y],
                data: dataFunc(e.features[0])
            }))
        }
    })

    map.on('mouseleave', layerName, function() {
        map.getCanvas().style.cursor = '';

        const { pinned } = store.getState().map.tooltip;
        if (pinned) return;

        store.dispatch(updateTooltip({
            data: []
        }))
    });

    map.on('click', layerName, e => {
        const { pinned } = store.getState().map.tooltip;
        if ((typeof dataFunc === "function") && e.features.length) {
            const data = dataFunc(e.features[0]);
            if (data.length) {
                if (pinned) {
                    store.dispatch(updateTooltip({
                        pos: [e.point.x, e.point.y],
                        data
                    }))
                }
                else {
                    store.dispatch(updateTooltip({
                        pinned: true
                    }))
                }
            }
            else {
                store.dispatch(updateTooltip({
                    pinned: false
                }))
            }
        }
    })
}