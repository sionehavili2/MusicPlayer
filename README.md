# MusicPlayer
This is the final project for CS4760 for the group At Least 4. The goal of this project is to create a social media and room app based around music. Users will be able to join music rooms with others where they will be able to add songs to the queue, vote on songs, and ultimately connect with one another over music. 

## Features
### Highest Priority (1)
* Music Feed
  * The app will feature a social media feed that will feature things such as rooms created, songs currently playing, and most liked songs. 
* API Calls for Music
  * Rather than storing audio files in the backend, the app will make API calls to Spotify to stream music.
* Music Rooms
  * Users will be able to create rooms where music will be playing so that all users can listen to the same song. Users can add songs to the queue, which will be then be randomly selected to play next (i.e. shuffled).
* User Accounts
  * Users will be able to create accounts, whose information will be stored in MongoDB after being salted and hashed.
### Moderate Priority (2)
* Chat
  * While in the room, users will be able to chat with one another.
* Voting System
  * The rooms will feature a voting system for the songs, and songs that have a low score will not be played in that room as often.
### Lowest Priority (3)
* Friends List / Online Status
  * Users will be able to see which other users are online without needing to join a room. This will extend to a friends list where users will be able to view their friends and quickly join rooms together.

## Technologies Used
* MERN Stack
* Visual Studio Code
* Trello
* Spotify API
* GitHub
* Atlas

## Sprints
### Sprint 1 (Sept 7 - Sept 19)
<ul>
  <li>Gregor.io is going to start the repo readme/documentation. The readme will have this week’s goals in it to start, but will be updated each week to reflect features and future implementations. This will also serve as the bulleted list of features that we will show to the client.</li>
  <li>Hayden is going to research APIs to see how we pull music from a source like SoundCloud. He is also going to compare it to just hosting the music files on the server and see which is better. This is budgeted to take 10 hours.</li>
  <li>Juan is going to set up the Authentication into a Mongo Database. This includes setting up secure data storage with encryption. He is also going to research News APIs. </li>
  <li>Tyler is going to research APIs and work on getting a functioning news feed to show up on the front page. This is budgeted to take 6 hours.</li>
  <li>Sione is going to research websocket communications and MERN interfaces to build a communication interface. He will also be looking into establishing room communication between users, and between the frontend and the backend.</li>
</ul>
### Sprint 2 (Sept 26 - ..)
* Gregor.io is going to continue documentation while also working with Tyler to flesh out the news feed with useful information from the back-end as well as data structures to hold statstics such as post likes and song likes and plays.
* Hayden and Juan are going to work on the Spotify API and getting that set up so that only one user needs to authenticate for a room to function. This will include passing information from the front-end to the back-end, which will then call the API and return that back to the front-end.
* Sione is going to work on setting up an interface so that we can add plugins down the line for functionality of the app.
