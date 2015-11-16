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
  
       var $row = $(template);

       var clickHandler = function() {
           var songNumber = $(this).attr('data-song-number');

           if (currentlyPlayingSong !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingCell.html(currentlyPlayingSong);
           }
           if (currentlyPlayingSong !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
           } else if (currentlyPlayingSong === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
           }
       };
       
           var onHover = function(event) {
               var songNumberCell = $(this).find('.song-item-number');
               var songNumber = songNumberCell.attr('data-song-number');

               if (songNumber !== currentlyPlayingSong) {
                   songNumberCell.html(playButtonTemplate);
               }
           };

           var offHover = function(event) {
               var songNumberCell = $(this).find('.song-item-number');
               var songNumber = songNumberCell.attr('data-song-number');

               if (songNumber !== currentlyPlayingSong) {
                   songNumberCell.html(songNumber);
               }
           };
       
       // #1
        $row.find('.song-item-number').click(clickHandler);
        // #2
        $row.hover(onHover, offHover);
        // #3
        return $row;
  };

  var setCurrentAlbum = function(album) {
      // #1
      var $albumTitle = $('.album-view-title');
      var $albumArtist = $('.album-view-artist');
      var $albumReleaseInfo = $('.album-view-release-info');
      var $albumImage = $('.album-cover-art');
      var $albumSongList = $('.album-view-song-list');
  
      // #2
      $albumTitle.text(album.name);
      $albumArtist.text(album.artist);
      $albumReleaseInfo.text(album.year + ' ' + album.label);
      $albumImage.attr('src', album.albumArtUrl);
  
      // #3
      $albumSongList.empty();

      // #4
      for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
      }
  };





  $(document).ready(function() {
      setCurrentAlbum(albumPicasso);

  }); 

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
      var albumImage = $(".album-art");
      albumImage.click(function(event) {
          console.log('click');
          setCurrentAlbum(albums[index]);
          console.log(index);
          index++;
          if (index == albums.length) {
            index = 0;
          } 

      }); 

