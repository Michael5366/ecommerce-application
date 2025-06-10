import { Container } from '@mui/material';
import teamData from './team-data';
import { Link } from 'react-router-dom';
import aboutPageStyles from './about-us-styles';

const AboutUsPage = () => {
  const css = aboutPageStyles();

  return (
    <Container className={css.wrapper} component="div">
      <section className={css['about-us']}>
        <div className={css['about-us__headers']}>
          <h1 className={css['about-us__header']}>About us</h1>
          <p className={css['about-us__description']}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, officia ratione
            veritatis neque enim sequi dicta id quisquam earum dolores nemo impedit ut omnis
            sapiente nam distinctio provident, ipsam alias.
          </p>
        </div>

        <section className={css.content}>
          {teamData.map((member) => {
            return (
              <div className={css.content__card} key={member.name}>
                <h2 className="content__header">{member.name}</h2>
                <img
                  className={css.content__avatar}
                  src={member.photo}
                  alt={`Here is the photo of the team member ${member.name}`}
                />

                <h3 className="content__position">{member.position}</h3>
                <p className="content__description">{member.description}</p>
                <Link className={css.content__link} to={member.github}>
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
