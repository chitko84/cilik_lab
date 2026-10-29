import React from 'react';
import {ArrowRight, BookOpenCheck, GraduationCap, Lightbulb, Sparkles} from 'lucide-react';
import {useLanguage} from '../../context/LanguageContext';
import {RealPhoto} from '../../components/visual/RealPhoto';
import {INTRO_COPY} from './introCopy';

/** A short, informational homepage introduction. No changes to login or learning flows. */
export function ProjectIntroduction(){
  const {locale}=useLanguage();
  const copy=INTRO_COPY[locale];
  return <section className="v37-about" aria-labelledby="v37-about-heading">
    <div className="v37-about__container">
      <div className="v37-about__story">
        <span className="v37-about__eyebrow"><Sparkles size={15} aria-hidden="true"/>{copy.eyebrow}</span>
        <h2 id="v37-about-heading">{copy.heading}</h2>
        <p className="v37-about__description">{copy.description}</p>
        <div className="v37-about__audience">
          <div className="v37-about__audience-card">
            <span className="v37-about__symbol" aria-hidden="true"><BookOpenCheck size={22}/></span>
            <div><h3>{copy.childHeading}</h3><p>{copy.childBody}</p></div>
          </div>
          <div className="v37-about__audience-card">
            <span className="v37-about__symbol" aria-hidden="true"><GraduationCap size={22}/></span>
            <div><h3>{copy.teacherHeading}</h3><p>{copy.teacherBody}</p></div>
          </div>
        </div>
      </div>
      <figure className="v37-about__visual">
        <div className="v37-about__photo-frame">
          <RealPhoto photo="learningPartners" alt="Two young learners collaborating on an activity" fallback="/visuals/coding-friends.webp"/>
        </div>
        <figcaption><Lightbulb size={17} aria-hidden="true"/><span>{copy.photoCaption}</span></figcaption>
      </figure>
      <div className="v37-about__journey" aria-label={copy.journeyLabel}>
        <span className="v37-about__journey-label">{copy.journeyLabel}</span>
        <ol className="v37-about__steps">{copy.steps.map((step,index)=><li key={index}><span className="v37-about__number">{index+1}</span><span>{step}</span>{index<copy.steps.length-1&&<ArrowRight className="v37-about__arrow" size={17} aria-hidden="true"/>}</li>)}</ol>
      </div>
    </div>
  </section>;
}
