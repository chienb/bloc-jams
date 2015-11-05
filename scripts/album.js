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
       + '  <td class="song-item-number">' + songNumber + '</td>'
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
  
      // #4 - Why ALBUM.songs.length
      for (i = 0; i < album.songs.length; i++) {
          albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length, album.songs[i].plays);
      }
  };
  
  window.onload = function() {
      setCurrentAlbum(albumPicasso);
  };

  var nextAlbum = document.addEventListener("click", setCurrentAlbum);
