// ==UserScript==
// @name         IGDB List Extra Info
// @namespace    https://greasyfork.org/de/users/155913-nkay08
// @description  Adds additional information  (genre, rating, keywords)to igdb.com lists. They can be loaded witha button // click. Needs an IGDB api key.
//
// @author       NKay
// @include        http*://www.igdb.com/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==


//insert your API-KEY here
var apikey = '';

var gametextarray = [];
var gameidarray = [];
var genresnodearray = [];
var keywordsnodearray = [];
var ratingnodearray = [];


function addAdditionalInfo(jnode) {
    'use strict';
    // Your code here...
    console.log('Adding button and placeholders for extra info');
    //api urls
    var apiurl = 'https://api-2445582011268.apicast.io';
    var req = '/games/?search=';
    var reqid = '/games/1942?fields=*';
    var corsproxy = 'https://cors-anywhere.herokuapp.com/';
    var fields = '?fields=genres,keywords,rating,rating_count,aggregated_rating,aggregated_rating_count,total_rating,total_rating_count';

    var sidebar = document.getElementsByClassName("nopad");
    var sidebarchild = sidebar[0].childNodes[0];
    if (sidebar && sidebarchild) {


    }


    //   btn.appendChild(btntext);
    //   sidebar[0].appendChild(btn);


    var pageDivs = document.getElementsByClassName("media-body");

    var promises = [];
    var sequence = Promise.resolve();
    //set header for apikey and json
    var myheaders = new Headers();
    myheaders.append('user-key', apikey);
    //myheaders.append('Accept', 'application/json');

    //for every element "media-body" do
    for (var i = 0; i < pageDivs.length; i++)
    //for (var i = 0; i < 1; i++)
    {

        // get sibling. sibling has game id
        var sib = pageDivs[i].nextSibling;
        var gameid = sib.getAttribute("data-game");
        //set some elements
        // var filler = document.createTextNode('  |  ');
        var genrestext = document.createTextNode('Genres: ');
        var genresspan = document.createElement('span');
        genresspan.style.fontSize = 'medium';
        genresspan.style.textDecoration = 'underline';
        genresspan.appendChild(genrestext);
        pageDivs[i].appendChild(genresspan);
        var genresnode = document.createElement('span');
        genresnode.setAttribute("id", "usgenre" + i.toString());
        pageDivs[i].appendChild(genresnode);
        genresnodearray.push(genresnode);
        pageDivs[i].appendChild(document.createTextNode('   |   '));
        var keywordstext = document.createTextNode('Keywords: ');
        var kwspan = document.createElement('span');
        kwspan.style.fontSize = 'medium';
        kwspan.style.textDecoration = "underline";
        kwspan.appendChild(keywordstext);
        pageDivs[i].appendChild(kwspan);
        var keywordsnode = document.createElement('span');
        keywordsnode.setAttribute("id", "uskw" + i.toString());
        pageDivs[i].appendChild(keywordsnode);
        keywordsnodearray.push(keywordsnode);
        pageDivs[i].appendChild(document.createTextNode('   |   '));
        var ratingtext = document.createTextNode('Rating: ');
        var rtspan = document.createElement('span');
        rtspan.style.fontSize = 'medium';
        rtspan.style.textDecoration = "underline";
        rtspan.appendChild(ratingtext);
        pageDivs[i].appendChild(rtspan);
        var ratingnode = document.createTextNode('');
        pageDivs[i].appendChild(ratingnode);
        ratingnodearray.push(ratingnode);


        //get the game name
        var span1 = pageDivs[i].getElementsByTagName('span');
        gameidarray.push(corsproxy + apiurl + '/games/' + gameid + fields);

        //    var ref = pageDivs[i].getElementsByClassName("link-dark");
        //  text = document.createTextNode(ref[0].href);
    }

    var btn = document.createElement("button");
    var btntext = document.createTextNode('Load additional info');
    btn.appendChild(btntext);
    var firstbtn = document.getElementsByClassName("btn btn-primary btn-block mar-md-bottom");
    firstbtn[0].parentNode.insertBefore(document.createElement('hr'), firstbtn[0]);
    firstbtn[0].parentNode.insertBefore(btn, firstbtn[0]);
    firstbtn[0].parentNode.insertBefore(document.createElement('hr'), firstbtn[0]);
    btn.addEventListener("click", load, false);

    function load() {
        genresnodearray.forEach(element => element.innerHTML = 'loading..');
        keywordsnodearray.forEach(element => element.innerHTML = 'loading..');
        ratingnodearray.forEach(element => element.nodeValue = 'loading..');

        //execute multiple fetch promises
        // first fetch rating for each id
        Promise.all(
            gameidarray.map(
                (url, index) => fetch(url, {
                    headers: myheaders
                })
                .then(res2 => res2.json())
                .then(data2 => {
                    if (data2) {
                        var ratingstr = '';
                        ratingstr = ratingstr.concat('User: ');
                        if (data2[0].rating) {
                            ratingstr = ratingstr.concat(Math.round(data2[0].rating).toString());
                            ratingstr = ratingstr.concat(' (' + data2[0].rating_count.toString() + ')');
                        } else {
                            ratingstr = ratingstr.concat('/');
                        }
                        ratingstr = ratingstr.concat(', ');
                        ratingstr = ratingstr.concat('Critics: ');
                        if (data2[0].aggregated_rating) {
                            ratingstr = ratingstr.concat(Math.round(data2[0].aggregated_rating).toString());
                            ratingstr = ratingstr.concat(' (' + data2[0].aggregated_rating_count.toString() + ')');
                        } else {
                            ratingstr = ratingstr.concat('/');
                        }
                        ratingstr = ratingstr.concat(', ');
                        ratingstr = ratingstr.concat('Total: ');
                        if (data2[0].total_rating) {
                            ratingstr = ratingstr.concat(Math.round(data2[0].total_rating).toString());
                            ratingstr = ratingstr.concat(' (' + data2[0].total_rating_count.toString() + ')');
                        } else {
                            ratingstr = ratingstr.concat('/');
                        }
                        ratingnodearray[index].nodeValue = ratingstr;




                        //concat all genrenames. fetch for all genre-ids at once
                        if (data2[0].genres) {
                            var genresid = data2[0].genres;
                            var genresurl = corsproxy + apiurl + '/genres/' + data2[0].genres.toString();
                            fetch(genresurl, {
                                    headers: myheaders
                                })
                                .then(resgenre => resgenre.json())
                                .then(datagenre => {
                                    var newgenres = '';
                                    genresnodearray[index].innerHTML = '';
                                    datagenre.forEach((tgenre, genreindex) => {
                                        var newgenre = document.createElement('a');
                                        newgenre.setAttribute("href", tgenre.url);
                                        var comma = ', ';
                                        if (genreindex == datagenre.length -1) {
                                            comma = '';
                                        }
                                        newgenre.appendChild(document.createTextNode(tgenre.name + comma));
                                        genresnodearray[index].appendChild(newgenre);

                                    });
                                });
                        }

                        //concat all keywords. fetch for all keyword-ids at once
                        if (data2[0].keywords) {
                            var keywordsid = data2[0].keywords;
                            var keywordsurl = corsproxy + apiurl + '/keywords/' + data2[0].keywords.toString();
                            fetch(keywordsurl, {
                                    headers: myheaders
                                })
                                .then(reskey => reskey.json())
                                .then(datakey => {
                                    keywordsnodearray[index].innerHTML = '';
                                    datakey.forEach((tkey, keyindex) => {
                                        var newkey = document.createElement('a');
                                        newkey.setAttribute('href', tkey.url);
                                        var comma = ', ';
                                        if (keyindex == datakey.length -1) {
                                            comma = '';
                                        }
                                        newkey.appendChild(document.createTextNode(tkey.name + comma));
                                        keywordsnodearray[index].appendChild(newkey);
                                    });


                                });

                        }

                    }
                })
            )
        );

    }
}

//only execute function if this element is loaded via ajax
waitForKeyElements("#content-page > div > div.content-left.col-md-pull-10.col-md-2 > div > a:nth-child(3)", addAdditionalInfo, true);

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
