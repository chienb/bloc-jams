 // Example Album
 var albumPicasso = {
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', length: '4:26', plays: '1' },
         { name: 'Green', length: '3:14', plays: '2' },
         { name: 'Red', length: '5:01', plays: '42' },
         { name: 'Pink', length: '3:21', plays: '22' },
         { name: 'Magenta', length: '2:15', plays: '12' }
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21' },
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15' }
     ]
 };

 // Another Example Album
 var albumBloc = {
     name: 'Frontend',
     artist: 'Brett',
     label: 'B',
     year: '2015',
     albumArtUrl: 'https://cdn1.bloc.io/assets/landing/logo-white-507998c9a61c5ecc5fcdc8806b0bc66d.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21' },
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15' }
     ]
 };

 var createSongRow = function(songNumber, songName, songLength, songPlays) {
      var template =
         '<tr class="album-view-song-item">'
       + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
       + '  <td class="song-item-title">' + songName + '</td>'
       + '  <td class="song-item-duration">' + songLength + '</td>'
       + '  <td class="song-item-plays">' + songPlays + '</td>'
       + '</tr>'
       ;
  
      return template;
  };

  var setCurrentAlbum = function(album) {
      // #1
      var albumTitle = document.getElementsByClassName('album-view-title')[0];
      var albumArtist = document.getElementsByClassName('album-view-artist')[0];
      var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
      var albumImage = document.getElementsByClassName('album-cover-art')[0];
      var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
  
      // #2
      albumTitle.firstChild.nodeValue = album.name;
      albumArtist.firstChild.nodeValue = album.artist;
      albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
      albumImage.setAttribute('src', album.albumArtUrl);
  
      // #3
      albumSongList.innerHTML = '';

      // #4
      for (i = 0; i < album.songs.length; i++) {
          albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length, album.songs[i].plays);
      }
  };

  // Elements we'll be adding listeners to
  var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
  var songRows = document.getElementsByClassName('album-view-song-item');



  window.onload = function() {
      setCurrentAlbum(albumPicasso);

      var findParentByClassName = function(element, targetClass) {
          var currentParent = element.parentElement; // set an element's (ie?) parent element to be called currentParent 
          if (currentParent) {
            while (currentParent.className != targetClass) { // while the currentParent class name does not match the target's (what target?) class name
                currentParent = currentParent.parentElement; // currentParent's parent element becomes the currentParent
            }
            if (currentParent.className == targetClass) {
              return currentParent;
            } else {
              alert("no parent with that class name.");
            }
          } else {
            alert("no parent found.");
          }        
      };


      var getSongItem = function(element) {
          switch (element.className) {
              //1 if the class names are the following, run the function findParentbyClassName which sets the element to display the song's number
              case 'album-song-button':
              case 'ion-play':
              case 'ion-pause':
                  return findParentByClassName(element, 'song-item-number');
              //2
              case 'album-view-song-item':
                  return element.querySelector('.song-item-number');
              //3
              case 'song-item-title':
              case 'song-item-duration':
                  return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
              //4
              case 'song-item-number':
                  return element;
              default:
                  return;
          }  
      };


      var clickHandler = function(targetElement) {
      
          var songItem = getSongItem(targetElement); 
          
          if (currentlyPlayingSong === null) {
              songItem.innerHTML = pauseButtonTemplate;
              currentlyPlayingSong = songItem.getAttribute('data-song-number');
          } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
                songItem.innerHTML = playButtonTemplate;
                currentlyPlayingSong = null;
          } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
               var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
               currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
               songItem.innerHTML = pauseButtonTemplate;
               currentlyPlayingSong = songItem.getAttribute('data-song-number');
           }     
      };


      // Elements to which we'll be adding listeners

      songListContainer.addEventListener('mouseover', function(event) {
          // Only target individual song rows during event delegation
          if (event.target.parentElement.className === 'album-view-song-item') {
              // Change the content from the number to the play button's HTML

              var songItem = getSongItem(event.target);
              
              if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
              songItem.innerHTML = playButtonTemplate;
              }
          }
      });

      for (i = 0; i < songRows.length; i++) {
          songRows[i].addEventListener('mouseleave', function(event) {
          // Selects first child element, which is the song-item-number element 
             // #1
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');
             
             // #2
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
          });


          songRows[i].addEventListener('click', function(event) {
              clickHandler(event.target);

          });
      }

      // Album button templates
       var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
       var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
       
       // Store state of playing songs
       var currentlyPlayingSong = null;


      // get the album cover and save it to a variable
      // Add the click event listener to the album
      // Somehow tell the function which album to show
      var albums = [albumPicasso,albumMarconi,albumBloc];
      var index = 1;
      albumImage.addEventListener("click",function(event) {
          setCurrentAlbum(album[index]);
          index++;
          if (index = album.length) {
            index = 0;
          } 

      }); 
  };

