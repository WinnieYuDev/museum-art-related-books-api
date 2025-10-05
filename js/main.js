// psuedocode

// user enters artist name
// use artist name to fetch artwork, artist name, and art piece name
// use artwork title AND artist name from museum api to get related books
// add catch errors

// dom elements
let ul = document.querySelector("ul");
const section = document.querySelector("section"); // show loading in section
const input = document.querySelector("#artistInput");
document.querySelector("button").addEventListener("click", goFetch);

function goFetch() {
    ul.innerHTML = ""; 
    section.innerText = "Loading...";
// user enters artist name
    let artistName = input.value.trim();
    if (artistName === "") {
        alert("Please enter an artist name.");
        section.innerText = "";
        return;
    }

    let urlArtSearch = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(artistName)}`;
// fetch from museum api
    fetch(urlArtSearch)
    .then(res => res.json())
    .then(dataSearch => {
    section.innerText = "";
    if (!dataSearch.objectIDs || dataSearch.objectIDs.length === 0) { // only get first 5 artworks
        alert("No artworks found for this artist.");
        return;
    }
    let first5 = [];   
    for (let i = 0; i < 5 && i < dataSearch.objectIDs.length; i++) {
        first5.push(dataSearch.objectIDs[i]); // push adds elements into array
    }

// use artist name to fetch artwork, artist name, and art piece name
    for (let i = 0; i < first5.length; i++) {
    let urlArt = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${first5[i]}`;

    // fetch artwork details
    fetch(urlArt)
    .then(res => res.json())
    .then(artData => {
    let artist = artData.artistDisplayName;
    if (!artist) artist = "Unknown Artist";
    let title = artData.title || "Untitled";
    let image = artData.primaryImage;

// create artwork section, add artist name, art piece name, img, and related books
    // looked this up. Referenced from Google AI Overview and Learning Mode Claude
    let artSection = document.createElement("section");
    let content = `<strong>Artist:</strong> ${artist}<br><strong>Artwork:</strong> ${title}`;
    if (image) {
        content += `<br><img src="${image}" alt="${title}" style="max-width:200px;">`;
    } else {
        content += "<p>No image available.</p>";
    }

// add nested div for related book
    content += `<div class="related-book">Loading related book...</div>`;
    artSection.innerHTML = content;
    ul.appendChild(artSection);

// use artwork title AND artist name from museum api to get related book
    let query = `${title} ${artist}`;
    let urlBooks = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    fetch(urlBooks)
    .then(res => res.json())
    .then(bookData => {
        // looked this up. Referenced from Google AI Overview and Learning Mode Claude
        if (!bookData.docs || bookData.docs.length === 0) {
            let bookDiv = artSection.querySelector(".related-book");
            bookDiv.innerHTML = "No related books found.";
            return;
        }
        let book = bookData.docs[0];
        let workLink = "#";
        if (book.key) {
            workLink = `https://openlibrary.org${book.key}`;
        }
        let bookDiv = artSection.querySelector(".related-book");
        bookDiv.innerHTML = `Related Book: <a href="${workLink}" target="_blank">${book.title}</a>`; })
    })
    }
// add catch error to end
    })
    .catch(err => {
        alert("Met Museum search failed. Try refreshing in a few seconds.");
        console.log(`Cannot load artworks ${err}`);
    });
}

// Citation:
// Guidance from Google AI Overview, Learning Mode of Claude, StackOverflow
// Referenced from Tutorial - https://www.youtube.com/watch?v=b5rjEW-_6po and https://www.youtube.com/watch?v=G7XJRLaq2Cw
