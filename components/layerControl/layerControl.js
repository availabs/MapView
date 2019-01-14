import React, {Component} from 'react';
import { connect } from 'react-redux';
import LayerHeader from './layerHeader'
import LayerFilterPanel from './layerFilterPanel'

import { removeLayer, toggleLayerVisibility } from '../../store/MapStore'

// import deepEqual from 'deep-equal'

 class LayerControl extends Component {
  state = {
    showConfig: true
  }
  
  render() {
    const { layer, layerName, theme } = this.props
    let LayerControlStyle = {
      width: '100%',
      display: 'flex',
      marginBottom: 5,
      backgroundColor: theme.sidePanelHeaderBg
    }


    const removeLayer = () => {
      this.props.removeLayer(layerName)
    }

    const toggleConfig = () => {
      this.setState({showConfig: !this.state.showConfig})
    }

    const toggleVisibility = () => {
      this.props.toggleLayerVisibility(layerName)
    }

    return (
      <div>
        <div className='active-layer-container' style={LayerControlStyle}>
          <LayerHeader 
            layerName={layerName}
            onRemoveLayer={removeLayer}
            onToggleVisibility={toggleVisibility}
            isVisible={layer.visible}
            onToggleEnableConfig={toggleConfig}
          />
        </div>
        {this.state.showConfig 
          ? <LayerFilterPanel layerName={layerName} />
          : ''
        }
      </div>
    );
  }
}

LayerControl.defaultProps = {
  isOpen: true
}

const mapDispatchToProps = {
  removeLayer,
  toggleLayerVisibility
}

const mapStateToProps = (state,ownProps) => {
  return {
    theme: state.map.theme,
    layer: state.map.layers[ownProps.layerName],
    update: state.map.update
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(LayerControl)