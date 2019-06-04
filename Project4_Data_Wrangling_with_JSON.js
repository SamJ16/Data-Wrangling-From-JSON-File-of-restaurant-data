class FluentRestaurants {
  
  constructor(jsonData) {
    this.data=jsonData;
  }
  
  //takes a string, stateStr, and returns a new
  //FluentRestaurants object in which all restaurants are located
  //in the given state, stateStr.
  fromState(stateStr) {
    return new FluentRestaurants(this.data.filter(function (place) {
      if (lib220.getProperty(place, "state").found) {
        return lib220.getProperty(place, "state").value === stateStr;
      }
    }));
  }
  
  //takes a number, rating, and returns a new FluentRestaurants
  //object that holds restaurants with ratings
  //less than or equal to rating.
  ratingLeq(rating) {
    return new FluentRestaurants(this.data.filter(function (place) {
      if (lib220.getProperty(place, "stars").found) {
        return lib220.getProperty(place, "stars").value <= rating;
      }
    }));
  }

  //returns a new FluentRestaurants object that holds restaurants
  //with ratings which are greater than or equal to rating.
  ratingGeq(rating) {
    return new FluentRestaurants(this.data.filter(function (place) {
      if (lib220.getProperty(place, "stars").found) {
        return lib220.getProperty(place, "stars").value >= rating;
      }
    }));
  }
  
  //takes a string, categoryStr, and produces only those
  //restaurants that have the provided category, categoryStr.
  category(categoryStr) {
    return new FluentRestaurants(this.data.filter(function (place) {
      if (lib220.getProperty(place, "category").found) {
        return lib220.getProperty(place, "category").value === categoryStr;
      }
    }));
  }
  
  //produces those restaurants that have the given ambience.
  //Each restaurant record contains an ‘attributes’ key
  //that may or may not contain an Ambience key
  //which itself is an object.
  hasAmbience(ambienceStr) {
    return new FluentRestaurants(this.data.filter(function (place) {
      if (lib220.getProperty(place, "attributes").found) {
        let attributes=lib220.getProperty(place, "attributes").value;
        if (lib220.getProperty(attributes, "Ambience").found) {
          let ambience=lib220.getProperty(attributes, "Ambience").value;
          if (lib220.getProperty(ambience, ambienceStr).found) {
            return lib220.getProperty(ambience, ambienceStr).value;
          }
        }
      }
    }));
  }

  //returns the “best” restaurant. The “best” restaurant is the highest rated restaurant.
  //If there is a tie, pick the one with the most reviews.
  bestPlace() {
    let highestRating=0;
    for (let i = 0; i < this.data.length; ++i) {
      if (lib220.getProperty(this.data[i], "stars").value>highestRating) {
        highestRating=lib220.getProperty(this.data[i], "stars").value;
      }
    }
    let toptier=this.ratingGeq(highestRating);
    let mostReviews=0;
    for (let i = 0; i < toptier.data.length; ++i) {
      if (lib220.getProperty(toptier.data[i], "review_count").value>mostReviews) {
        mostReviews=lib220.getProperty(toptier.data[i], "review_count").value;
      }
    }
    toptier.data=toptier.data.filter(function (place) {
      return lib220.getProperty(place, "review_count").value>=mostReviews;
    });
    return toptier.data[0];
  }

}

let testData = [
{
  name: "Applebee's",
  state: "NC",
  stars: 4,
  review_count: 6,
},
{
  name: "China Garden",
  state: "NC",
  stars: 4,
  review_count: 10,
},
{
  name: "Beach Ventures Roofing",
  state: "AZ",
  stars: 3,
  review_count: 30,
},
{
  name: "Alpaul Automobile Wash",
  state: "NC",
  stars: 3,
  review_count: 30,
}
]
test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
});
test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'China Garden');
});