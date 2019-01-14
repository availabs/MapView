import React, {Component} from 'react';
import { connect } from 'react-redux';

import { addLayer } from '../../store/MapStore'
// import deepEqual from 'deep-equal'

 class LayerSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.addLayer = this.addLayer.bind(this)
  }

  toggleDropdown () { this.setState({ open: !this.state.open }) }

  closeDropdown () { this.setState({ open: false }) }

  addLayer (e) {
    // console.log('add layer', e.target.getAttribute('value'))
    this.props.addLayer(e.target.getAttribute('value'))
    this.closeDropdown()
  }

  render() {
    const { theme, layers } = this.props
    let LayerSelectorStyle = {
      width: '100%',
      display: 'flex',
      padding: 5,
    }
    console.log('render LayerSelector', Object.keys(layers).filter(d => layers[d].active).map(d => layers[d].name))

    return (
      <div className='sidebar-header' style={LayerSelectorStyle}>
        <div className='dropdown' style={{ width: '100%'}}>
        <button 
          onClick={this.toggleDropdown}
          onFocusOut={this.closeDropdown}
          style={{borderRadius: 0,  backgroundColor: theme.sidePanelBg, color: theme.textColorHl}}
          className="btn btn-block dropdown-toggle" 
          type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true">
          Add Layer
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton"
          style={this.state.open ? {display:'block'} : {display:'none'}}
          >
          { 
            Object.keys(layers).filter(d => !layers[d].active)
            .map(d => {
              return (
                <a key={d} className="dropdown-item" value={d} onClick={this.addLayer}>
                  {layers[d].name}
                </a>
              )
            }) 
          }
          
        </div>
      </div>
        
      </div>
    );
  }
}

// LayerSelector.defaultProps = {
//   isOpen: true
// }

const mapDispatchToProps = {
  addLayer
}

const mapStateToProps = state => {
  return {
    theme: state.map.theme,
    layers: state.map.layers
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(LayerSelector)