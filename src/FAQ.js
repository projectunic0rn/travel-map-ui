import React from "react";

// the match prop is passed from react-router-dom and provides url parameters
function FAQ() {
  return (
    <div className="beta-container">
      <h1>Beta Information</h1>
      <p>
        This website is currently in the beta phase as it has most of the
        core-features developed but there are some additional ones left to be
        written and a number of "web-readiness" tasks that are not finished. So,
        in a way the "beta" icon is an admission that we know there are still
        some bugs and imperfections but we still wanted to get some users on the
        site to try it out as-is.
      </p>
      <p>
        The main purpose of the beta is to get some feedback, good and bad,
        about the site itself.
      </p>
      <p>Our contact email is listed here: <strong>geornal.contact@gmail.com</strong></p>
      <p>
        If you use the email, please list your username, browser, and screen
        size if you are reporting a bug.
      </p>
      <h3>We are looking for feedback on the following:</h3>
      <ol>
        <li>
          <strong>Site purpose</strong> -- Is it clear what you can do on the
          site from the landing page and the individual map/profile pages? Is
          there a need for an "FAQ" page which describes how to use the site's
          features in more detail?
        </li>
        <li>
          <strong>Site usability</strong> -- General impressions of how it is to
          add cities to your map, add reviews, etc. Is it obvious what elements
          of the site are meant to be interactive? Are there features you wish
          existed that you don't think are possible in the site's current state?
        </li>
        <li>
          <strong>Site aesthetics</strong> -- General impressions and/or
          feedback on changes. One of the easier ones to change is the look and
          colors of the main city maps. Would a lighter theme be preferred?
        </li>
        <li>
          <strong>Site speed</strong> -- Site speed is hindered at the moment by
          the tier of Heroku service we are using. In addition, during and after
          the beta phase a lot of effort on our side will need to be put into
          optimizing the front/backend code to minimize requests, re-renders,
          etc. But what we are looking for is if there are particular pages that
          are much slower or your general impression overall. One idea to "mask"
          the load times, particularly for the friend map if 10000+ cities are
          on there, would be some sort of "country fact" loading screen that
          would act as a loader. This may be a cardinal sin as it would require
          us to purposely delay the load times for some users in order to leave
          the country fact up long enough to be read but if they were
          interesting enough it may be worth a shot. Perhaps only on the initial
          login load.
        </li>
        <li>
          <strong>Site responsiveness</strong> -- Currently we are taking the
          shortcut of a popup saying "This site isn't optimized for your device
          size" below 1000px widths. Throughout the beta phase though I will be
          working to add responsiveness to tablet/mobile sizes and will remove
          this prompt. As of today, only the map pages and the landing page have
          any responsiveness so the Profile page needs work.
        </li>
        <li>
          <strong>Bugs/Error messages</strong> -- If the site shows a blank
          screen after an action or gives you a browser error, please take a
          screenshot and give a brief description of what you were trying to do
          to our contact email above. This will help us track down and fix bugs.
        </li>
        <li>
          <strong>General web-readiness feedback</strong> -- Things like
          security, accessibility, SEO, etc. are all topics I didn't know
          anything about prior to starting this project and I am certain still
          need a lot of work. If there are clear things you notice that should
          be implemented, feel free to send it as feedback.
        </li>
      </ol>
      <h3>Thank you for your help trying out our website!</h3>
    </div>
  );
}

export default FAQ;
