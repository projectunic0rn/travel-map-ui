import React from "react";
import AccordionFAQ from "./subcomponents/AccordionFAQ";

import AddCitiesGif from "../../Gifs/Gif_SaveCities.gif";
import AddCountriesGif from "../../Gifs/Gif_SaveCountries.gif";

const FAQItems = [
  {
    title: "What is the purpose of the site",
    text: (
      <p>
        There are two main purposes of the site:
        <ol>
          <li>
            To allow users to record the cities they have been (and what they
            liked or didn't like there) to save these memories
          </li>
          <li>
            To help plan trips by seeing where your friends have been and what
            they enjoyed
          </li>
        </ol>
        We anticipate a couple of different use cases. For many people, the site
        may be mainly a means of seeing the countries/cities you have traveled
        to and sharing it with friends. For other "superusers", we want it to be
        possible to store detailed trip reports that you can look back on.
      </p>
    )
  },
  {
    title: "How can I add cities to my map",
    text: (
      <p>
        <ol>
          <li>Click "Personal" in the navigation menu</li>
          <li>
            Use the underlined dropdown menu to select the timing of your trip
          </li>
          <li>
            Use the underlined dropdown menu to select the timing of your trip
          </li>
          <li>
            Either type in a city or use the "Tap Cities" prompts to select them
          </li>
          <li>Remember to hit "Save My Map" before you change pages!</li>
          <li>
            The cities you entered should now be marked on your map when you
            reload the page
          </li>
        </ol>
        <img className="add-cities-gif" src={AddCitiesGif}></img>
      </p>
    )
  },
  {
    title: "How can I add countries to my map",
    text: (
      <p>
        If you add cities, the corresponding country will automatically be
        added. However, if all of the cities you want to add are all from one
        country, use the following steps:
        <ol>
          <li>Click "Personal" in the navigation menu</li>
          <li>Click the "Country Map" icon to the left of the search bar</li>
          <li>Click or type in the name of the country you want</li>
          <li>Select the timing (past/future/live)</li>
          <li>Type in cities in that country and then hit the "Save" button</li>
          <li>The country should have been filled in on your map</li>
        </ol>
        <img className="add-cities-gif" src={AddCountriesGif}></img>
      </p>
    )
  },
  {
    title: "How can I add reviews",
    text: (
      <p>
        <ol>
          <li>Click "Profile" in the navigation menu</li>
          <li>
            Click on the city you want to add reviews for (or use the
            filters/search bar to find it)
          </li>
          <li>Enter basic information about your trip(s) to the city</li>
          <li>
            Click on different icons in the vertical nav menu to get to reviews
          </li>
          <li>Click "Edit" and then "Add Review"</li>
          <li>
            Select the review category from the dropdown menu, type in the
            specific place/activity, give a rating, leave a comment, and leave a
            cost/person
          </li>
        </ol>
      </p>
    )
  },
  {
    title: "How can I see my friend's reviews for a city",
    text: (
      <p>
        <ol>
          <li>
            Click "Friends" from the navigation menu to see the friends map
          </li>
          <li>
            Type in or click on the city you are interested in (can also look at
            reviews for a whole country on the country map)
          </li>
          <li>
            To see an individual friend's reviews of that city, click on their
            user card. To see all of the reviews compiled, click the name of the
            city in the popup prompt
          </li>
          <li>
            Go through the different icons on the vertical nav menu to see all
            review types
          </li>
        </ol>
      </p>
    )
  },
  // {
  //   title: "How is the GeorneyScore calculated",
  //   text:
  //     'Your GeorneyScore is meant to be a representation of how much of the world you have seen in your travels, with a higher score meaning that you have seen more of the world. There are a variety of websites which provide a score like this, with the methods of derivation for this score equally various. Like all of these, the GeorneyScore is mostly arbitrary but the approach for calculating it based on the following principles: The world was split into a grid of latitudes and longitudes, with the grid size being 1deg of each. This result in 64,200 different "boxes", of which only 19,000 contain land. If a person has been somewhere within a box, they earn the points (see below for calculation) from this box. In order to have seen the whole world and to earn the highest GeorneyScore, one would need to travel to a latitude and longitude within all of these land-containing boxes. As that is not reasonable for most of us, we will earn points from traveling to cities contained within these boxes. For instance, San Francisco is at Lat/Long of ____ and Tokyo is at Lat/Long of ____. These are therefore part of two different boxes so a person who has been to both will earn points from each box. However, San Francisco and Oakland, CA are both in the same box. So a person who has travelled to both will earn the same amount of points as someone who has only been to one of the two cities. This is not a perfect system by any means but it does try to reward people who have seen a lot of different areas in the world. 1) You should get a higher score if you have experienced more cultures and/or talked with more people -There isn\'t a perfect way to assess this but what we have done is assumed that blocks with a larger population will tend to lead to more interactions while you are there. This isn\'t always true, of course, in fact in some of my own experience the opposite is true, but we feel that you should be more rewarded for seeing a large city like a Tokyo versus a small, rural town with a population of 100 people. In addition, you will get a bonus for traveling to different countries as although cultural boundaries don\'t follow geopolitical ones perfectly, this is a decent way to assess how many different cultures you have experienced. 2) You should get a higher score if you have seen more of the physical world and its array of landscapes -We are making the assumption that boxes with more land-area are "more valuable" to your GeorneyScore than those with some of their area being water. This does deflate the value of tiny islands or boxes with lots of coastline, which you could argue are some of the most beautiful, travel-worthy spots on Earth and probably inflates the value of sparse desert or tundra-covered boxes which do not have a lot of geographic/landscape diversity. That said, we think that boxes with more land should be rewarded as they are still more likely to have a variety of landscapes overall and many of the world\'s coastal cities have a large population and thus score highly on principle #1 above. So, based on the above principles, the GeorneyScore is calculated as follows: 1) You get __ points for each country you have visited and/or live in. 2) Each of the grid boxes has a population and a land area based on 2020 SEDAC data, and this is divided by the total world population and land area, respectively. The end results of each are multiplied by 1000 and added together to give a total score for each box. The average city score an approximately 0.1 while the highest city earns a 4.5 (Tokyo). The sums of #1 and #2 are added together to give your score. Ultimately, this is just meant as a way to compare traveling among users on a broad scale and certainly not proof that a person who has a 200 GeorneyScore is "more traveled" than someone with a 180. We are happy to discuss tweaking the formula if other ideas to take into consideration are presented to us at ____.'
  // },
  {
    title: "How does this site make money",
    text:
      "Currently, it doesn't. But it also doesn't cost us anything at the moment. Eventually, with a userbase we would look into advertisements and affiliate products via a newsletter but this project is intended to be a hobby project and a portfolio item, not a money-making device."
  }
];

function FAQ() {
  return (
    <div className="faq-container">
      <div className="panel-group" id="accordion">
        {FAQItems.map(item => {
          return (
            <AccordionFAQ
              key={item.title}
              title={item.title}
              text={item.text}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FAQ;
