import React, {Component} from 'react';
import { connect } from 'react-redux';

// import deepEqual from 'deep-equal'
import SidebarContainer from './sidebar'
import SidebarHeader from './SidebarHeader'
import LayerSelector from './LayerSelector'
import ActiveLayers from './ActiveLayers'

class Sidebar extends Component {
  
  render() {
    

    let sidebarContentStyle = {
      flexGrow: 1,
      padding: 0,
      overflowY: 'auto',
      overflowX: 'hidden'
    }
    
    
    // console.log('render sidebar', this.props)

    return (
      <SidebarContainer>
        <SidebarHeader />
        <div className='sidebar-content' style={sidebarContentStyle}>
          <LayerSelector />
          <ActiveLayers />
        </div>
      </SidebarContainer>
    );
  }
}

Sidebar.defaultProps = {
  isOpen: true
}

const mapDispatchToProps = {

}

const mapStateToProps = state => {
  return {
    layers: state.map.layers,
    update: state.map.update
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)