import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

export class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetchClicked: false,
      firstFetch: true,
      savedPhotos: [],
      bottomReached: false,
      pageHeight: '',
    }
    this.element = React.createRef()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll = e => {
    this.setState(
      prevState => {
        if (
          prevState.pageHeight !==
          document.getElementsByTagName('body')[0].offsetHeight
        ) {
          return {
            pageHeight: document.getElementsByTagName('body')[0].offsetHeight,
          }
        }
      },
      () => {
        let pageTop = window.visualViewport.pageTop
        let offsetHeight = document.getElementsByTagName('body')[0].offsetHeight
        let closeToBottom = offsetHeight - pageTop <= 1000

        console.log(closeToBottom)
        if (closeToBottom && this.state.bottomReached === false) {
          return this.setState(
            {
              bottomReached: true,
            },
            () =>
              axios.get('http://localhost:5000/fetch').then(response => {
                return this.setState(
                  {
                    savedPhotos: [...this.state.savedPhotos, ...response.data],
                    bottomReached: false,
                  },
                  () => {
                    console.warn(this.state.savedPhotos)
                  },
                )
              }),
          )
        }
      },
    )
  }

  handleClick = () => {
    const pingInterval = 1000
    const continuousPing = setInterval(this.handleFetch, 1000)

    this.state.fetchClicked
      ? this.setState({ fetchClicked: false }, () =>
          clearInterval(continuousPing),
        )
      : this.setState({ fetchClicked: true }, () => {
          this.handleFetch()
          // return continuousPing
        })
  }

  handleFetch = () => {
    axios.get('http://localhost:5000/fetch').then(response => {
      // First fetch
      if (this.state.firstFetch === true) {
        return this.setState(
          { savedPhotos: response.data, firstFetch: false },
          () => {
            console.log(response.data)
          },
        )
      }
      // First + n fetch, push new photos if any
      // Check for pause click
      else if (this.state.fetchClicked) {
        console.log('First + n fetch')
        this.setState(prevState => {
          let prevResult = response.data.filter(
            s =>
              !prevState.savedPhotos.find(
                f =>
                  f.title === s.title && f.id === s.id && f.secret === s.secret,
              ),
          )
          if (prevResult.length) {
            return {
              savedPhotos: [...prevResult, ...this.state.savedPhotos],
            }
          }
        })
      }
    })
  }

  render() {
    const { fetchClicked } = this.state
    return (
      <div
        className="App p-1 bg-secondary"
        ref={this.element}
        onScroll={this.handleScroll.bind(this)}
      >
        <h1>Flickr Streamer </h1>
        {fetchClicked ? (
          <button
            className="btn btn-warning"
            onClick={() => this.handleClick()}
          >
            Streaming, click to pause...
          </button>
        ) : (
          <button className="btn btn-info " onClick={() => this.handleClick()}>
            Start the stream
          </button>
        )}

        <table className="table table-dark mt-5">
          <thead>
            <tr>
              <th scope="col">Photo</th>
              <th scope="col">Title</th>
            </tr>
          </thead>

          <tbody>
            {this.state.savedPhotos.map(item => {
              return (
                <tr key={item.id + Math.random()}>
                  <td>
                    <img
                      src={`https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`}
                    />
                  </td>
                  <td className="w-50">
                    {item.title || 'No name'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App
