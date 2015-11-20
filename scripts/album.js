

 var createSongRow = function(songNumber, songName, songLength, songPlays) {
      var template =
         '<tr class="album-view-song-item">'
       + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
       + '  <td class="song-item-title">' + songName + '</td>'
       + '  <td class="song-item-duration">' + songLength + '</td>'
       + '</tr>'
       ;

       var $row = $(template);

       var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

           if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
           }
           if (currentlyPlayingSongNumber !== songNumber) {
            //console.log("Test");
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
                
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
              

           } else if (currentlyPlayingSongNumber === songNumber) {
                //we need to start playing the song again and revert the icon in the song row and the player bar to the pause button.
                if (currentSoundFile.isPaused()) {
                  $(this).html(pauseButtonTemplate);
                  $('.main-controls .play-pause').html(playerBarPauseButton);
                  currentSoundFile.play();
              } else {
                //we need to pause it and set the content of the song number cell and player bar's pause button back to the play button.
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
              }
           }
           updateSeekBarWhileSongPlays();
       };
       
           var onHover = function(event) {
               var songNumberCell = $(this).find('.song-item-number');
               var songNumber = parseInt(songNumberCell.attr('data-song-number'));
               console.log(songNumber);
               console.log(currentlyPlayingSong);

               if (songNumber !== currentlyPlayingSong) { //if songNumber is not null (there is a song playing)
                   songNumberCell.html(playButtonTemplate);
               }
               //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

           };

           var offHover = function(event) {
               var songNumberCell = $(this).find('.song-item-number');
               var songNumber = parseInt(songNumberCell.attr('data-song-number'));

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
      currentAlbum = album;
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

  var updateSeekBarWhileSongPlays = function() {
       if (currentSoundFile) {
           // #10
           currentSoundFile.bind('timeupdate', function(event) {
               // #11
               var seekBarFillRatio = this.getTime() / this.getDuration();
               var $seekBar = $('.seek-control .seek-bar');
   
               updateSeekPercentage($seekBar, seekBarFillRatio);
           });
       }
   };

  var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
     var offsetXPercent = seekBarFillRatio * 100;
     // #1
     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(100, offsetXPercent);
  
     // #2
     var percentageString = offsetXPercent + '%';
     $seekBar.find('.fill').width(percentageString);
     $seekBar.find('.thumb').css({left: percentageString});
  };

  var setupSeekBars = function() {
      var $seekBars = $('.player-bar .seek-bar');
  
      $seekBars.click(function(event) {
          // #3
          var offsetX = event.pageX - $(this).offset().left;
          var barWidth = $(this).width();
          // #4
          var seekBarFillRatio = offsetX / barWidth;

          //
          if ($(this).parent().attr('class') == 'seek-control') {
              seek(seekBarFillRatio * currentSoundFile.getDuration());
          } else {
              setVolume(seekBarFillRatio * 100);   
          }
  
          // #5
          updateSeekPercentage($(this), seekBarFillRatio);
      });

      // #6
      $seekBars.find('.thumb').mousedown(function(event) {
          // #7
          var $seekBar = $(this).parent();
      
          // #8
          $(document).bind('mousemove.thumb', function(event){
              var offsetX = event.pageX - $seekBar.offset().left;
              var barWidth = $seekBar.width();
              var seekBarFillRatio = offsetX / barWidth;

              //
              if ($seekBar.parent().attr('class') == 'seek-control') {
                  seek(seekBarFillRatio * currentSoundFile.getDuration());   
              } else {
                  setVolume(seekBarFillRatio);
              }
      
              updateSeekPercentage($seekBar, seekBarFillRatio);
          });
      
          // #9
          $(document).bind('mouseup.thumb', function() {
              $(document).unbind('mousemove.thumb');
              $(document).unbind('mouseup.thumb');
          });
      });
  };


  var trackIndex = function(album, song) {
      return album.songs.indexOf(song);
  };

  var nextSong = function() {
      
      var getLastSongNumber = function(index) {
          //if (index == 0) {
          //  return currentAlbum.songs.lenth;
          //} else {
          //  return index;
          //}
          return index == 0 ? currentAlbum.songs.length : index; //evaluate if index = 0, if yes index = currentAlbum.songs.length?
      };
    
      var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
      //console.log("current song index: " + currentSongIndex);

      // Note that we're _incrementing_ the song here
      currentSongIndex++;
      
      if (currentSongIndex >= currentAlbum.songs.length) {
          currentSongIndex = 0;
      }
      //console.log("current song index: " + currentSongIndex);
      // Set a new current song
      setSong(currentSongIndex + 1);
      //currentlyPlayingSongNumber = currentSongIndex + 1;
      //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

      //
      currentSoundFile.play();

      // Update the Player Bar information
      updatePlayerBarSong();
      
      var lastSongNumber = getLastSongNumber(currentSongIndex);
      //
      var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
      
      $nextSongNumberCell.html(pauseButtonTemplate);
      $lastSongNumberCell.html(lastSongNumber);

      updateSeekBarWhileSongPlays();
      
  };

  var previousSong = function() {
      
      // Note the difference between this implementation and the one in
      // nextSong()
      var getLastSongNumber = function(index) {
          return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
      };
      
      var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
      // Note that we're _decrementing_ the index here
      currentSongIndex--;
      
      if (currentSongIndex < 0) {
          currentSongIndex = currentAlbum.songs.length - 1;
      }
  
      // Set a new current song
      setSong(currentSongIndex + 1);
      //currentlyPlayingSongNumber = currentSongIndex + 1;
      //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

      //
      currentSoundFile.play();
      
      // Update the Player Bar information
      updatePlayerBarSong();
      
      var lastSongNumber = getLastSongNumber(currentSongIndex);
      var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
      var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
      
      $previousSongNumberCell.html(pauseButtonTemplate);
      $lastSongNumberCell.html(lastSongNumber);

      updateSeekBarWhileSongPlays();
      
  };

  var setSong = function (songNumber){
      if (currentSoundFile) {
          currentSoundFile.stop();
      }
      //console.log(songNumber);
      
      //assign currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number.
      currentlyPlayingSongNumber = parseInt(songNumber) ;
      currentSongFromAlbum = currentAlbum.songs[songNumber-1]; // -1 value because first song's index is 0
      // #1
      currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
          // #2
          formats: [ 'mp3' ],
          preload: true
      });

      setVolume(currentVolume);
  };
  
  var seek = function(time) {
      if (currentSoundFile) {
          currentSoundFile.setTime(time);
      }
  }

  var setVolume = function(volume) {
      if (currentSoundFile) {
          currentSoundFile.setVolume(volume);
      }
    };


  var getSongNumberCell = function (number) {
      return $('.song-item-number[data-song-number="' + number + '"]');

  };

  var updatePlayerBarSong = function () {
    $(".song-name").text(currentSongFromAlbum.name);
    $('.artist-name').text(currentAlbum.artist);
    $('.artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);

  };

  var togglePlayFromPlayerBar = function () {
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
    if (currentSoundFile.isPaused ()) {
      //Change the song number cell from a play button to a pause button
      $currentlyPlayingCell.html(pauseButtonTemplate)
      //Change the HTML of the player bar's play button to a pause button
      $('.main-controls .play-pause').html(playerBarPauseButton)
      //Play the song
      currentSoundFile.play();
    } else if (currentSoundFile) {
      //Change the song number cell from a pause button to a play button
      $currentlyPlayingCell.html(playButtonTemplate)
      //Change the HTML of the player bar's pause button to a play button
      $('.main-controls .play-pause').html(playerBarPlayButton)
      //pause the song
      currentSoundFile.pause();
    }
  };

  // Album button templates
   var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
   var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
   var playerBarPlayButton = '<span class="ion-play"></span>';
   var playerBarPauseButton = '<span class="ion-pause"></span>';

   var currentlyPlayingSong = null;   
   var currentAlbum = null;
   var currentlyPlayingSongNumber = null;
   var currentSongFromAlbum = null;
   var currentSoundFile = null;
   var currentVolume = 5;



   var $previousButton = $('.main-controls .previous');
   var $nextButton = $('.main-controls .next');
   var $playButton = $(".main-controls .play-pause");


  $(document).ready(function() {
      setCurrentAlbum(albumPicasso);
      $previousButton.click(previousSong);
      $nextButton.click(nextSong);
      $playButton.click(togglePlayFromPlayerBar);
      setupSeekBars();


  }); 

      // get the album cover and save it to a variable
      // Add the click event listener to the album
      // Somehow tell the function which album to show
      var albums = [albumPicasso,albumMarconi,albumBloc];
      var index = 1;
      var albumImage = document.getElementById("album-art");
      albumImage.addEventListener("click",function(event) {

          console.log('click');
          setCurrentAlbum(albums[index]);
          console.log(index);
          index++;
          if (index == albums.length) {
            index = 0;
          } 

      }); 

