
const filteredLibrary = [...hierarchy.keys()] // Get artist names.
  .sort() // Sort artist names.
  .map(artistName => ({ // Map each artist name to their albums.
    name: artistName,
    albums: [...hierarchy.get(artistName)!.values()] // Get album props for all albums.
      .sort(compareNullableProperties("name")), // Sort by name ascending, nulls last.
  }));
