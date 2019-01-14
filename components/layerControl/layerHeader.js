import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PanelHeaderAction from './panelHeaderAction';
import {
  EyeSeen,
  EyeUnseen,
  VertDots,
  ArrowDown,
  Trash
} from 'components/common/icons';

import {InlineInput, StyledPanelHeader} from 'components/common/styled-components';



const propTypes = {
  // required
  id: PropTypes.string.isRequired,
  isDragNDropEnabled: PropTypes.bool,
  isVisible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,

  // optional
  className: PropTypes.string,
  idx: PropTypes.number,
  isConfigActive: PropTypes.bool,
  labelRCGColorValues: PropTypes.array,
  onUpdateLayerLabel: PropTypes.func,
  onRemoveLayer: PropTypes.func
};

const defaultProps = {
  isDragNDropEnabled: true,
  showRemoveLayer: true,
  className: '',
  idx: 1,
  isConfigActive: false ,
  isVisible: true,
  layerId: 1,
  layerType: '',
  labelRCGColorValues: [255, 0, 0],
  isConfigActive: true,
  onToggleVisibility: () => {},
  onUpdateLayerLabel: () => {},
  onToggleEnableConfig: () => {},
  onRemoveLayer: () => {},
  showRemoveLayer: () => {}
};

const StyledLayerPanelHeader = StyledPanelHeader.extend`
  .layer__remove-layer {
    opacity: 0;
  }
  width: 100%;
  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.panelBackgroundHover};
    
    .layer__drag-handle {
      opacity: 1;
    }
    
    .layer__remove-layer {
      opacity: 1;  
    }
    
    .layer__enable-config {
      color: white
    }
  }
`;

const HeaderLabelSection = styled.div`
  display: flex;
  color: ${props => props.theme.textColor};
`;

const HeaderActionSection = styled.div`
  display: flex;
`;

const LayerTitleSection = styled.div`
  margin-left: 12px;
  .layer__title__type {
    color: ${props => props.theme.subtextColor};
    font-size: 10px;
    line-height: 12px;
    letter-spacing: 0.37px;
    text-transform: capitalize;
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  opacity: 0;
  
  :hover {
    cursor: move;
    color: ${props => props.theme.textColorHl};
  }
`;

const LayerPanelHeader = ({
  className,
  idx,
  isConfigActive,
  isDragNDropEnabled,
  isVisible,
  label,
  layerId,
  layerType,
  labelRCGColorValues,
  onToggleVisibility,
  onUpdateLayerLabel,
  onToggleEnableConfig,
  onRemoveLayer,
  showRemoveLayer,
  theme
}) => (
  <StyledLayerPanelHeader
    className={classnames('layer-panel__header', {
      'sort--handle': !isConfigActive
    })}
    active={isConfigActive}
    labelRCGColorValues={labelRCGColorValues}
    onClick={onToggleEnableConfig}
    theme={theme}
  >
    <HeaderLabelSection className="layer-panel__header__content">
      {isDragNDropEnabled && (
        <DragHandle theme={theme} className="layer__drag-handle">
          <VertDots height="20px" />
        </DragHandle>
      )}
      <PanelHeaderAction
        className="layer__visibility-toggle"
        id={layerId}
        tooltip={isVisible ? 'hide layer' : 'show layer'}
        onClick={onToggleVisibility}
        IconComponent={isVisible ? EyeSeen : EyeUnseen}
        active={isVisible}
        flush
      />
      <LayerTitleSection className="layer__title" theme={theme}>
        <div>
          <LayerLabelEditor label={label} onEdit={onUpdateLayerLabel} theme={theme}/>
        </div>
      </LayerTitleSection>
    </HeaderLabelSection>
    <HeaderActionSection className="layer-panel__header__actions">
      {showRemoveLayer ? (
        <PanelHeaderAction
          className="layer__remove-layer"
          id={layerId}
          tooltip={'Remove layer'}
          onClick={onRemoveLayer}
          tooltipType="error"
          IconComponent={Trash}
          
        />
      ) : null}
      <PanelHeaderAction
        className="layer__enable-config"
        id={layerId}
        tooltip={'Layer settings'}
        onClick={onToggleEnableConfig}
        IconComponent={ArrowDown}
        
      />
    </HeaderActionSection>
  </StyledLayerPanelHeader>
);

const LayerLabelEditor = ({label, onEdit, theme}) => (
  <InlineInput
    type="text"
    className="layer__title__editor"
    value={label}
    onClick={e => {
      e.stopPropagation();
    }}
    onChange={onEdit}
    id="input-layer-label"
  />
);

LayerPanelHeader.propTypes = propTypes;
LayerPanelHeader.defaultProps = defaultProps;


const mapDispatchToProps = {
}

const mapStateToProps = (state,ownProps) => {
  return {
    theme: state.map.theme,
    layer: state.map.layers[ownProps.layerName],
    label: state.map.layers[ownProps.layerName].name.toUpperCase(),
    layerType: state.map.layers[ownProps.layerName].type.toUpperCase(),
    update: state.map.update
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(LayerPanelHeader)