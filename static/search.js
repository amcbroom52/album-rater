"use strict";

const $resultContainer = $("#search-results")

async function getSearchResults(evt) {
  evt.preventDefault();

  const searchInput = $("#search-form input").val();
  const searchType = $("#search-form input[name='search-type']:checked").val();

  const params = new URLSearchParams({
    'query': searchInput,
    'type': searchType
  });

  const resp = await fetch(`/search/results?${params}`);
  const searchResults = await resp.json();

  console.log(searchInput);
  console.log(searchType);

  addResultsToPage(searchResults, searchType);

}


function addResultsToPage(results, searchType) {
  $resultContainer.empty();

  if (searchType === "album") {
    for (let album of results) {
      const $albumResult = generateAlbumSearchHTML(album);
      $resultContainer.append($albumResult);
    }
  } else if (searchType === "artist") {
    for (let artist of results) {
      const $artistResult = generateArtistSearchHTML(artist);
      $resultContainer.append($artistResult);
    }
  } else {
    for (let user of results) {
      const $userResult = generateUserSearchHTML(user);
      $resultContainer.append($userResult);
    }
  }

}


function generateUserSearchHTML(user) {
  const $html = $(
    `<div class="card border-primary mb-5 col-9" style="background-color: rgba(38, 39, 48, 0.141); margin: auto;">
      <div class="card-body border-primary" onclick="location.href='/users/${user.username}';" style="cursor: pointer;">
        <img src='${user.image_url}' style='height: 100px; width: 100px; border-radius: 50%; display: inline-block;'>
        <div style='display: inline-block;' class='ms-2'>
          <h3 class="text-light">
            ${user.first_name} ${user.last_name || ""}
          </h3>
          <p class="text-body">${user.username}</p>
        </div>
      </div>
    </div>`
  );

  return $html;
}


function generateArtistSearchHTML(artist) {
  const $html = $(
    `<div class="card border-primary mb-5 col-10" style="background-color: rgba(38, 39, 48, 0.141); margin: auto;">
      <div class="card-body border-primary" onclick="location.href='/artists/${artist.id}';" style="cursor: pointer;">
        <img src='${artist.image_url}' style='height: 100px; width: 100px; border-radius: 50%;'>
        <div style="display: inline-block" class="ms-2">
          <h3 class='text-light'>
            ${artist.name}
          </h3>
        </div>
      </div>
    </div>`
  );

  return $html;
}


function generateAlbumSearchHTML(album) {
  const $html = $(
    `<div class="card border-primary mb-5 col-10" style="background-color: rgba(38, 39, 48, 0.141); margin: auto;">
      <div class="card-body border-primary" onclick="location.href='/albums/${album.id}';" style="cursor: pointer;">
        <img src='${album.image_url}' style='height: 100px; width: 100px; display: inline-block'>
        <div style="display: inline-block" class="ms-2">
          <h3 class='text-light'>
            ${album.name}
          </h3>
          <p class='text-secondary'>
            By: <a href='/artists/${album.artist_id}'><i class='text-secondary'>${album.artist}</i></a>
          </p>
        </div>
      </div>
    </div>`
  );

  return $html;
}

$("#search-form").on("submit", getSearchResults);