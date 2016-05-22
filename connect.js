import React, {
  Component
} from 'react-native';
import hoistStatics from 'hoist-non-react-statics';
import Promise from 'bluebird';
import _ from 'lodash';

const connect = (func, props) => {

  return WrappedComponent => {

    class Connect extends Component {

      constructor() {
        // debugger;
        super();
        this.state = {
          data: {}
        }
      }

      componentDidMount() {
        const promises = func(props);
        console.log('promises', promises);
        Promise.props(promises)
        .then(results => {
          console.log(results);
          // debugger;
          return results;
          // return _.mapValues(results, res => {
          //   debugger;
          //   return res.value().text()
          // })
        })
        .then(data => {
          console.log('data', data);
          this.setState({
            data: data
          });
        });
      }

      render() {
        return (
          <WrappedComponent {...this.state.data} {...props} />
        )
      }

    }

    // return hoistStatics(Connect, WrappedComponent);
    return (
      <Connect />
    )
  }
}

export default connect;
