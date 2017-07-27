var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Port Saint Lucie";

var numberOfResults = 3;

var APIKey = "b39cf3becaf442229248617e42eaec5d";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Port Saint Lucie is a city located in southeaster Florida. It's 120 miles south of Orlando, and 60 miles north of West Palm Beach. Port Saint Lucie has an estimated 185,132 residents as of 2016, and is one of the state of Florida's fastest growing cities.";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "What attraction was that? " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example, open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "First Data Field", content: "Is the New York Mets spring training home. The stadium was built in 1988, and seats up to 7,000 sports fans.", location: "525 NW Peacock Blvd. Port St. Lucie, FL 34986", contact: "772 871 2100" },
{ name: "Savannas Preserve State Park", content: "This preserve is one of the largest and most intact freshwater marshes on Floridas east coast. Vistors can visist the Environmental Education Center where they can learn about the importance of this unique and endangered natural system.  This is a great place to picnic, canoe, kayak, and fish, and take wildlife photography. The preserve has over 8 miles of multi-use trails for hiking, biking, and horseback riding. They also provide guided walks and canoe trips by reservation", location: "2541 Walton Road, Port St. Lucie, FL 34952", contact: "772 3982779" },
{ name: "River Lilly Cruises", content: "The River Lily is a 34-passenger pontoon boat, licensed by the U.S. Coast Guard. The captain is Eddie Hamrick, who is also U.S. Coast Guard licensed Captain.  The cruise takes place on the St. Lucie Aquatic Preserve, and some parts of the river are so wild, they were used in the James Bond film Moonraker.  Each trip is different, but you're sure to see alligators, turtples, and lots of native birds, and maybe some otters and manatees.", location: "500 E Prima Vista Blvd, Port St Lucie, FL 34983", contact: "772 489 8344" },
{ name: "Port St Lucie Botanical Gardens", content: "The Port St. Lucie Botanical Gardens is a welcome oasis of greenery in the heart of the city. The Gardens is located on 20 acres of property on the west side of Westmoreland Boulevard, just south of Port St. Lucie Blvd. on the banks of the North Fork of the St. Lucie River. The site boasts a lake with a fountain, paved public paths, beautiful gardens, a pavilion, a gift shop and a special place for weddings, as well as ample public parking. This beautiful sanctuary includes a butterfly garden, orchid room and rose garden. The Gardens also hosts a variety of children's programs, plant sales and the popular Fort Pierce Jazz and Blues Society concerts", location: "2410 SE Westmoreland Blvd, Port St Lucie, FL 34952", contact: "772 337 1959" },
{ name: "Spruce Bluff Preserve", content: "Two self-guiding interpretive trails cover this 97-acre site. One loop trail describes the site of the 1891 pioneer settlement and cemetery along the banks of the St. Lucie River. Another trail describes the significance of an early Native American mound and historic uses of native plants found along the trail. ", location: "611 Dar Ln, Port St Lucie, FL 34984", contact: "772 462 2526" },];

var topFive = [
{ number: "1", caption: "Visit First Data field.", more: "First Data Field is famous for being the training ground of the New York Mets and if you happen to be in town from February to March then you can see them in action as they train. During the summer months you can also catch minor league baseball games.", location: "525 NW Peacock Blvd. Port St. Lucie, FL 34986", contact: "772 871 2100" },
{ number: "2", caption: "Get shopping at The Landing at Tradition.", more: "An outside shopping center that links together some big box stores, as well as small mom and pop shops. The shopping area also has a wide variety of places to eat.", location: "10824 SW Village Parkway, Port St. Lucie, FL 34987", contact: "724 772 1877" },
{ number: "3", caption: "Get your game on at Superplay USA.", more: "Superplay USA is a great place to come in Port St. Lucie if you are looking for some family fun, as this entertainment center has everything you need for an exciting day out. There are 48 bowling lanes here where you can enjoy a game or a tournament and there is also a miniature golf course available. There are batting cages for those who want to practice their swing as well as an arcade that has a wide range of old fashioned games.", location: "1600 NW Courtyard Cir, Port St Lucie, FL 34986", contact: "772 408 5800" },
{ number: "4", caption: "Get some fresh air at the Oxbow Eco-Center.", more: "The Oxbow Eco-Center is an environmental learning facility that aims to teach visitors all about the importance of preserving nature in this part of the United States. The center sits on 225 acres of preserve and you can learn all about the river and the forest lands in Florida here as well as visit a living laboratory and a wild sanctuary where you can get up close to the flora and fauna in this region.", location: "5400 NE St James Dr, Port St Lucie, FL 34983", contact: "772 785 5833" },
{ number: "5", caption: "Check out some art at the Civic Center Art Gallery.", more: "The Port St. Lucie Civic Center is home to a 2,000 square foot Art Gallery, a beautifully-appointed exhibition space framed with stately columns and classic woodwork. It offers local and regional artists a professional venue to advance and display their work.", location: "9221 S.E. Civic Center Place, Port St. Lucie, FL 34952",  contact: "772 807 4488" }];


var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getNewsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':tellWithCard', output, location, locationOverview);
    },
    'getAttractionIntent': function () {
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        output = topFiveIntro;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = 0;
        if(this.event.request.intent.slots.attraction ) {
            if (this.event.request.intent.slots.attraction.value) {
                slotValue = this.event.request.intent.slots.attraction.value;

            }
        }

        if (slotValue > 0 && slotValue <= topFive.length) {

            var index = parseInt(slotValue) - 1;
            var selectedAttraction = topFive[index];

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
    console.log("/n QUERY: "+query);

    var options = {
        //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=seattle&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

            var body = '';

    res.on('data', (d) => {
        body += d;
});

    res.on('end', function () {
        callback(body);
    });

});
    req.end();

    req.on('error', (e) => {
        console.error(e);
});
}

String.prototype.trunc =
    function (n) {
        return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
    };
