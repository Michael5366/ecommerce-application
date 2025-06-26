import { Container } from '@mui/material';
import teamData from './team-data';
import aboutPageStyles from './about-us-styles';
import AboutModal from './AboutModal';

const AboutUsPage = () => {
  const css = aboutPageStyles();

  return (
    <Container className={css.wrapper} component="div" maxWidth={false}>
      <section className={css['about-us']}>
        <div className={css['about-us__headers']}>
          <h1 className={css['about-us__header']}>About us</h1>
          <p className={css['about-us__description']}>
            <strong>Built with code, driven by teamwork</strong>
            <br />
            We’re not designers — we’re developers who turn ideas into working solutions. This
            project is the result of learning, collaboration, and late nights spent debugging and
            building features that matter. Meet the team that made it happen.
          </p>
        </div>

        <section className={css.content}>
          {teamData.map((member) => {
            return (
              <div className={css.content__card} key={member.name}>
                <h2 className={css.content__header}>{member.name}</h2>
                <img
                  className={css.content__avatar}
                  src={member.photo}
                  alt={`Here is the photo of the team member ${member.name}`}
                />

                <h3 className={css.content__quote}>{member.quote}</h3>
                <p className={css.content__position}>{member.position}</p>
                <p className={css.content__description}>{member.description}</p>

                <AboutModal text={member.biography} />

                <a
                  className={css.content__link}
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            );
          })}
        </section>
      </section>
    </Container>
  );
};

export default AboutUsPage;
