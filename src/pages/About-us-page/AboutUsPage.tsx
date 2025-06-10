import { Container } from '@mui/material';
import teamData from './team-data';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <Container component="div">
      <section className="about-us">
        <div className="about-us__headers">
          <h1 className="about-us__header">About us</h1>
          <p className="about-us__description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, officia ratione
            veritatis neque enim sequi dicta id quisquam earum dolores nemo impedit ut omnis
            sapiente nam distinctio provident, ipsam alias.
          </p>
        </div>

        <section className="content">
          {teamData.map((member) => {
            return (
              <div className="content__card" key={member.name}>
                <h2 className="content__header">{member.name}</h2>
                <img
                  className="content__avatar"
                  src={member.photo}
                  alt={`Here is the photo of the team member ${member.name}`}
                />

                <h3 className="content__position">{member.position}</h3>
                <p className="content__description">{member.description}</p>
                <Link className="content__link" to={member.github}>
                  GitHub
                </Link>
              </div>
            );
          })}
        </section>
      </section>
    </Container>
  );
};

export default AboutUsPage;
