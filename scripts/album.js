// Variables
 var currentlyPlayingSong = null;   
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 5;
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playButton = $(".main-controls .play-pause");

// Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';


 var createSongRow = function(songNumber, songName, songLength) {
      var template =
         '<tr class="album-view-song-item">'
       + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
       + '  <td class="song-item-title">' + songName + '</td>'
       + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
                //need to start playing the song again and revert the icon in the song row and the player bar to the pause button.
                if (currentSoundFile.isPaused()) {
                  $(this).html(pauseButtonTemplate);
                  $('.main-controls .play-pause').html(playerBarPauseButton);
                  currentSoundFile.play();
              } else {
                //need to pause it and set the content of the song number cell and player bar's pause button back to the play button.
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

               if (songNumber != currentlyPlayingSongNumber) { 
                   songNumberCell.html(playButtonTemplate);
               }
           };

           var offHover = function(event) {
               var songNumberCell = $(this).find('.song-item-number');
               var songNumber = parseInt(songNumberCell.attr('data-song-number'));

               if (songNumber != currentlyPlayingSongNumber) {
                   songNumberCell.html(songNumber);
               }
           };
       
        $row.find('.song-item-number').click(clickHandler);
        $row.hover(onHover, offHover);
        return $row;
  };

  var setCurrentAlbum = function(album) {
      currentAlbum = album;
      var $albumTitle = $('.album-view-title');
      var $albumArtist = $('.album-view-artist');
      var $albumReleaseInfo = $('.album-view-release-info');
      var $albumImage = $('.album-cover-art');
      var $albumSongList = $('.album-view-song-list');
  
      $albumTitle.text(album.name);
      $albumArtist.text(album.artist);
      $albumReleaseInfo.text(album.year + ' ' + album.label);
      $albumImage.attr('src', album.albumArtUrl);
  
      $albumSongList.empty();

      for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
      }
  };

//Player Bar

var setCurrentTimeInPlayerBar = function () {
  var $currentTimeElement = $(".seek-control .current-time");
  $currentTimeElement.text(filterTimeCode(currentSoundFile.getTime()));
};

var setTotalTimeInPlayerBar = function () {
  var $totalTimeElement = $(".seek-control .total-time");
  $totalTimeElement.text(filterTimeCode(currentSoundFile.getDuration())) ;
};


var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
             var currentTime = this.getTime();
             var totalTime = this.getDuration();
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
             setTotalTimeInPlayerBar(filterTimeCode(totalTime));
         });
     }
 };

var filterTimeCode = function (timeInSeconds) {
  var seconds = Number.parseFloat(timeInSeconds);
  var wholeSeconds = Math.floor(seconds);
  var mins = Math.floor(wholeSeconds / 60);
  var remainingSeconds= wholeSeconds % 60;
  var output = mins + ":";
    if (remainingSeconds <10) {
      output +="0";
    }
    output += remainingSeconds;
  return output;
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
   var offsetXPercent = seekBarFillRatio * 100;
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);

   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }

        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
    
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
    
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
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

var updatePlayerBarSong = function () {
  $(".song-name").text(currentSongFromAlbum.name);
  $('.artist-name').text(currentAlbum.artist);
  $('.artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.length));

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


// Songs

  var trackIndex = function(album, song) {
      return album.songs.indexOf(song);
  };
  var nextSong = function() {
      var getLastSongNumber = function(index) {
          return index == 0 ? currentAlbum.songs.length : index; 
      };
      var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

      currentSongIndex++;
      if (currentSongIndex >= currentAlbum.songs.length) {
          currentSongIndex = 0;
      }
      setSong(currentSongIndex + 1);
      currentSoundFile.play();
      updatePlayerBarSong();
      var lastSongNumber = getLastSongNumber(currentSongIndex);
      var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
      
      $nextSongNumberCell.html(pauseButtonTemplate);
      $lastSongNumberCell.html(lastSongNumber);

      updateSeekBarWhileSongPlays(); 
  };

  var previousSong = function() {
      var getLastSongNumber = function(index) {
          return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
      };
      var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
      // Note that we're _decrementing_ the index here
      currentSongIndex--;
      
      if (currentSongIndex < 0) {
          currentSongIndex = currentAlbum.songs.length - 1;
      }

      setSong(currentSongIndex + 1);
      currentSoundFile.play();
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

      currentlyPlayingSongNumber = parseInt(songNumber) ;
      currentSongFromAlbum = currentAlbum.songs[songNumber-1]; // -1 value because first song's index is 0
      currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
          formats: [ 'mp3' ],
          preload: true
      });

      setVolume(currentVolume);
  };

  var getSongNumberCell = function (number) {
      return $('.song-item-number[data-song-number="' + number + '"]');
  };

  $(document).ready(function() {
      setCurrentAlbum(albumPicasso);
      $previousButton.click(previousSong);
      $nextButton.click(nextSong);
      $playButton.click(togglePlayFromPlayerBar);
      setupSeekBars();
  }); 

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

