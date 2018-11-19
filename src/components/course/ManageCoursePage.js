import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import * as courseActions from '../../actions/courseActions';
import {bindActionCreators} from 'redux';
import CourseList from './CourseList';
import CourseForm from './CourseForm';
import toastr from 'toastr';

class ManageCoursePage extends React.Component { 
  constructor(props, context){
    super(props, context);

    this.state = {
      course: Object.assign({}, props.course),
      errors: {},
      saving: false
    }

    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.course.id != nextProps.course.id){
      this.setState({course: Object.assign({}, nextProps.course)});
    }
  }

  updateCourseState(event) {
    const field = event.target.name;
    let course = Object.assign({}, this.state.course);
    course[field] = event.target.value;
    this.setState({course: course});
  }

  saveCourse(event){
    event.preventDefault();
    this.setState({saving: true})
    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({saving: false});
      });
  }

  redirect(){
    this.setState({saving: false})
    toastr.success("Course Saved Man !!!!1!!");
    this.context.router.push('/courses');
  }

  render() {
    return(
      <div>
        <CourseForm 
          course={this.state.course}
          errors={this.state.errors}
          onChange={this.updateCourseState}
          allAuthors={this.props.authors}
          onSave={this.saveCourse}
          saving={this.state.saving}/>
      </div>
    );
  }
}

ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

function getCourseById(courses, id){
  const course = courses.filter(course => course.id == id);
  if(course.length) return course[0];
  return null;
}

function mapStateToProps(state, ownProps){
  const courseId = ownProps.params.id;
  let course = {id: "", title: "", watchHref: "", authorId: "", length: "", category: ""};

  if(courseId && state.courses.length > 0){
    course = getCourseById(state.courses, courseId);
  }

  const authorsFormattedForDropdown = state.authors.map( author => {
    return {
      value: author.id,
      text: author.firstName + ' ' + author.lastName
    };
  });

  return {
    course: course,
    authors: authorsFormattedForDropdown 
  };
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);