import React, {PropTypes} from 'react';
import { prototype } from 'events';
import Header from './common/Header';
import {connect} from 'react-redux';
class App extends React.Component { 
  render(){
    return(
      <div className="container-fluid">
        <Header
        loading={this.props.loading}/>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps){
  return {
    loading: state.ajaxCallsInProgress > 0
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(App);
