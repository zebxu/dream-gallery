import { connect } from 'react-redux';
import MovieList from '../components/MovieList';

const mapStateToProps = (state, ownProps) => {
  return {
    oreder: state.query.order,
    time: state.query.order,
    limit: state.query.limit,
    page: state.query.page,
    videos: state.response.videos,
    total_videos: state.response.total_videos
  };
};

const dispatchToProps = dispatch => {
  return {
    onSaveClick: vid => {
      // dispatch(postVidToDB(vid))
      dispatch();
    },
    onPageClick: page => {
      // dispatch(changePageTo(page))
      dispatch();
    }
  };
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(MovieList);
