import React, { useState, useEffect } from "react";
import axios from "axios";

const MusicApp = () => {
  const [musicList, setMusicList] = useState([]);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [musicUpload, setMusicUpload] = useState({
    title: "",
    artist: "",
    link: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch music list on load (admin only)
  useEffect(() => {
    axios
      .post("/music-list", {}, { withCredentials: true })
      .then((response) => {
        setMusicList(response.data);
        setIsAdmin(true);
      })
      .catch((error) => {
        console.error("Error fetching music list: ", error);
        setIsAdmin(false);
      });
  }, []);

  // Play next song
  const playNext = () => {
    axios
      .post("/play-music/next", {}, { withCredentials: true })
      .then((response) => {
        setCurrentMusic(response.data);
      })
      .catch((error) => console.error("Error playing next music: ", error));
  };

  // Play previous song
  const playPrevious = () => {
    axios
      .post("/play-music/previous", {}, { withCredentials: true })
      .then((response) => {
        setCurrentMusic(response.data);
      })
      .catch((error) => console.error("Error playing previous music: ", error));
  };

  // Upload music
  const uploadMusic = (e) => {
    e.preventDefault();

    // Extract video ID from the link
    const youtubeId = extractYoutubeId(musicUpload.link);
    if (!youtubeId) {
      alert("Invalid YouTube link");
      return;
    }

    const musicData = { ...musicUpload, link: youtubeId };

    axios
      .post("/upload", musicData, { withCredentials: true })
      .then((response) => {
        alert("Music uploaded successfully!");
        setMusicList([...musicList, response.data]);
      })
      .catch((error) => console.error("Error uploading music: ", error));
  };

  // Extract YouTube ID from the link
  const extractYoutubeId = (url) => {
    const regExp = /(?:youtu\.be\/|watch\?v=)([\w-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Music Application</h1>

      {/* Current Playing */}
      {currentMusic ? (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Now Playing:</h2>
          <p>{currentMusic.title} by {currentMusic.artist}</p>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${currentMusic.link}`}
            title={currentMusic.title}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>No music playing</p>
      )}

      {/* Navigation */}
      <div className="mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={playPrevious}>
          Previous
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded ml-2" onClick={playNext}>
          Next
        </button>
      </div>

      {/* Music List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Music List</h2>
        <ul>
          {musicList.map((music) => (
            <li key={music.id}>
              {music.title} by {music.artist}
            </li>
          ))}
        </ul>
      </div>

      {/* Upload Music */}
      <div>
        <h2 className="text-xl font-semibold">Upload Music</h2>
        <form onSubmit={uploadMusic} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Title"
            value={musicUpload.title}
            onChange={(e) => setMusicUpload({ ...musicUpload, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Artist"
            value={musicUpload.artist}
            onChange={(e) => setMusicUpload({ ...musicUpload, artist: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="YouTube Link"
            value={musicUpload.link}
            onChange={(e) => setMusicUpload({ ...musicUpload, link: e.target.value })}
            required
          />
          <button className="px-4 py-2 bg-purple-500 text-white rounded" type="submit">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default MusicApp;
