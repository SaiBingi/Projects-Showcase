import './index.css'

const ProjectCard = props => {
  const {projectDetails} = props
  const {imageUrl, name} = projectDetails

  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectCard
