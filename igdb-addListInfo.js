// ==UserScript==
// @name         IGDB List Extra Info
// @namespace    https://greasyfork.org/de/users/155913-nkay08
// @version      0.8
// @description  Adds additional information  (genre, rating, keywords)to igdb.com lists. They can be loaded witha button 
// click. Needs an IGDB api key.
// @author       NKay
// @include        http*://www.igdb.com/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require https://git.io/vMmuf
// ==/UserScript==


//insert your API-KEY here
var apikey = '';

var gametextarray = [];
var genresnodearray = [];
var keywordsnodearray = [];
var ratingnodearray = [];


function addAdditionalInfo(jnode) {
    'use strict';
    // Your code here...
    console.log('Adding button and placeholders for extra info');
    //api urls
    var apikey = 'a219bebccdba1921822242709439c6e4';
    var apiurl = 'https://api-2445582011268.apicast.io';
    var req = '/games/?search=';
    var reqid = '/games/1942?fields=*';
    var corsproxy = 'https://cors-anywhere.herokuapp.com/';

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
        //add a textnode
        // modify with .nodeValue=

        //set some elements
        //    var filler = document.createTextNode('  |  ');
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
        var gametext = 'test';
        var span1 = pageDivs[i].getElementsByTagName('span');
        gametext = span1[0].innerHTML;
        gametextarray.push(corsproxy + apiurl + req + gametext);

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
        //first fetch the game-id for a given name
        Promise.all(
            gametextarray.map(
                (url, index) => fetch(url, {
                    headers: myheaders
                })
                .then(res => res.json())
                .then(data => {
                    var gameidnum = data[0].id;
                    var gameid = gameidnum.toString();
                    //generate new url with id to query for the data
                    var newurl = (corsproxy + apiurl + '/games/' + gameid + '?fields=*');
                    return fetch(newurl, {
                        headers: myheaders
                    });
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
                                        if (genreindex == datagenre.length) {
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
                                        if (keyindex == datakey.length) {
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
