import React, {Component} from 'react';
import { connect } from 'react-redux';
import LayerControl from '../layerControl/layerControl'

// import deepEqual from 'deep-equal'

 class ActiveLayers extends Component {
 
  render() {
    const { layers } = this.props
    let ActiveLayersStyle = {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 5,
    }
    
    // console.log('active layer',
    //   Object.keys(layers).filter(d => layers[d].active)
    // )

    return (
      <div className='active-layer-container' style={ActiveLayersStyle}>
        {
            Object.keys(layers)
            .filter(d => layers[d].active)
            .map(d => {
              return  <LayerControl key={d} layerName={d} />
            })
            
         }
      </div>
    );
  }
}

// ActiveLayers.defaultProps = {
//   isOpen: true
// }

const mapDispatchToProps = {
}

const mapStateToProps = state => {
  return {
    theme: state.map.layers,
    layers: state.map.layers,
    update: state.map.update
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(ActiveLayers)