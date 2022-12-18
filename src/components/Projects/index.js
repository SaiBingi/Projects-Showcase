import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectCard from '../ProjectCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  constructor(props) {
    super(props)
    const {categoriesList} = props
    this.state = {
      activeCategory: categoriesList[0].id,
      activeProjects: [],
      apiStatus: apiStatusConstants.initial,
    }
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeCategory} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const options = {method: 'GET'}
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      console.log(response)
      console.log(data)

      const formattedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))

      console.log(formattedData)
      this.setState({
        apiStatus: apiStatusConstants.success,
        activeProjects: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => this.getProjects()

  renderSuccessView = () => {
    const {activeProjects} = this.state

    return (
      <ul className="projects">
        {activeProjects.map(eachProject => (
          <ProjectCard key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div testid="loader" className="loading-view">
      <Loader type="ThreeDots" color="#4656a1" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="error-msg-1">Oops! Something Went Wrong</h1>
      <p className="error-msg-2">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeCategory = event =>
    this.setState({activeCategory: event.target.value}, this.getProjects)

  render() {
    const {categoriesList} = this.props
    const {activeCategory} = this.state

    return (
      <div className="container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="projects-view">
          <select
            className="dropdown-container"
            value={activeCategory}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(eachCategory => (
              <option
                key={eachCategory.id}
                className="category"
                value={eachCategory.id}
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>

          {this.renderViews()}
        </div>
      </div>
    )
  }
}

export default Projects
