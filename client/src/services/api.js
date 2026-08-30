const API_BASE = '/api/books';

const INITIAL_BOOKS = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0743273565",
    genre: "Classic Fiction",
    publish_year: 1925,
    copies_available: 4,
    total_copies: 5,
    spine_color: "#1E3D59",
    cover_style: "leather-navy",
    description: "A portrait of the Jazz Age in all its decadence and excess, Gatsby explores themes of idealism, social upheaval, and the elusive American Dream through the mysterious Jay Gatsby.",
    rating: 4.8,
    is_favorite: true,
    notes: "First edition acquired from the Long Island estate library. Gilded leaf lettering."
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    isbn: "978-0451524935",
    genre: "Dystopian",
    publish_year: 1949,
    copies_available: 3,
    total_copies: 4,
    spine_color: "#8B1E1E",
    cover_style: "leather-crimson",
    description: "A chilling prophecy about the future where Big Brother is always watching. Winston Smith struggles for sanity and liberty under a totalitarian regime that rewrites history.",
    rating: 4.9,
    is_favorite: true,
    notes: "Ministry of Truth archive stamp on interior flyleaf."
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441172719",
    genre: "Science Fiction",
    publish_year: 1965,
    copies_available: 2,
    total_copies: 3,
    spine_color: "#A66D29",
    cover_style: "leather-amber",
    description: "Set on the desert planet Arrakis, Dune tells the story of Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only substance of value is melange spice.",
    rating: 4.9,
    is_favorite: false,
    notes: "Sand-embossed binding with golden imperial crest."
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0141439518",
    genre: "Romance / Classic",
    publish_year: 1813,
    copies_available: 5,
    total_copies: 6,
    spine_color: "#2E5A44",
    cover_style: "leather-emerald",
    description: "Elizabeth Bennet navigates manners, upbringing, morality, and marriage in the society of the landed gentry of early 19th-century England, crossing paths with the haughty Mr. Darcy.",
    rating: 4.7,
    is_favorite: true,
    notes: "Bound in fine emerald morocco with botanical filigree on spine."
  },
  {
    id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "978-0547928227",
    genre: "Fantasy",
    publish_year: 1937,
    copies_available: 3,
    total_copies: 5,
    spine_color: "#4A3525",
    cover_style: "leather-bark",
    description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, until Gandalf the wizard and a company of dwarves whisk him off on an adventure to raid the hoard of Smaug the dragon.",
    rating: 4.9,
    is_favorite: true,
    notes: "Features hand-drawn Thror map in runes inside cover pocket."
  },
  {
    id: 6,
    title: "Frankenstein",
    author: "Mary Shelley",
    isbn: "978-0143131847",
    genre: "Gothic Horror",
    publish_year: 1818,
    copies_available: 2,
    total_copies: 2,
    spine_color: "#2C3539",
    cover_style: "leather-obsidian",
    description: "Victor Frankenstein, an ambitious young scientist, creates a sentient creature in an unorthodox scientific experiment, unleashing consequences that unravel his world.",
    rating: 4.6,
    is_favorite: false,
    notes: "Inscribed: 'Beware; for I am fearless, and therefore powerful.'"
  },
  {
    id: 7,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0060935467",
    genre: "Historical Fiction",
    publish_year: 1960,
    copies_available: 4,
    total_copies: 4,
    spine_color: "#5C3A58",
    cover_style: "leather-plum",
    description: "A gripping tale of racial injustice in the American South seen through the innocent eyes of Scout Finch, whose father Atticus defends a Black man falsely accused of a terrible crime.",
    rating: 4.8,
    is_favorite: false,
    notes: "Maycomb County law library seal embossed on corner."
  },
  {
    id: 8,
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "978-0062315007",
    genre: "Philosophical Fiction",
    publish_year: 1988,
    copies_available: 5,
    total_copies: 5,
    spine_color: "#8C5828",
    cover_style: "leather-bronze",
    description: "An enchanting fable about following one's Personal Legend, following the Andalusian shepherd boy Santiago on his journey across the Egyptian desert.",
    rating: 4.6,
    is_favorite: false,
    notes: "Illuminated stars and desert dunes gilded on spine ribs."
  },
  {
    id: 9,
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    isbn: "978-0143058144",
    genre: "Psychological Fiction",
    publish_year: 1866,
    copies_available: 1,
    total_copies: 3,
    spine_color: "#3F2644",
    cover_style: "leather-violet",
    description: "Raskolnikov, a destitute former student in Saint Petersburg, formulate a theory that extraordinary individuals are above moral law, then struggles with psychological torment after committing murder.",
    rating: 4.7,
    is_favorite: false,
    notes: "Heavy antique tome with deep foil relief."
  },
  {
    id: 10,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    isbn: "978-0141439570",
    genre: "Gothic / Philosophical",
    publish_year: 1890,
    copies_available: 3,
    total_copies: 3,
    spine_color: "#184A45",
    cover_style: "leather-teal",
    description: "Dorian Gray trades his soul so that a portrait will age and bear the marks of his sins while he remains forever young, hedonistic, and handsome.",
    rating: 4.7,
    is_favorite: true,
    notes: "Victorian aesthetic movement gilt ornaments."
  },
  {
    id: 11,
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "978-0060850524",
    genre: "Dystopian Sci-Fi",
    publish_year: 1932,
    copies_available: 2,
    total_copies: 4,
    spine_color: "#1B3B6F",
    cover_style: "leather-sapphire",
    description: "A world state where citizens are genetically bred, pharmaceutically numbed, and conditioning-controlled in a sterile utopia devoid of suffering and soul.",
    rating: 4.5,
    is_favorite: false,
    notes: "London Central Hatchery archival registration."
  },
  {
    id: 12,
    title: "The Odyssey",
    author: "Homer",
    isbn: "978-0140268867",
    genre: "Epic Poetry / Classic",
    publish_year: -700,
    copies_available: 2,
    total_copies: 2,
    spine_color: "#69381A",
    cover_style: "leather-terracotta",
    description: "The ten-year journey of Odysseus, king of Ithaca, as he strives to return home after the fall of Troy, battling mythical monsters and the wrath of gods.",
    rating: 4.8,
    is_favorite: true,
    notes: "Translated in verse; Mediterranean meander pattern stamped on leather borders."
  }
];

// Helper to get local storage books
function getLocalBooks() {
  const data = localStorage.getItem('athenaeum_local_books');
  if (!data) {
    localStorage.setItem('athenaeum_local_books', JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_BOOKS;
  }
}

// Helper to set local storage books
function setLocalBooks(books) {
  localStorage.setItem('athenaeum_local_books', JSON.stringify(books));
}

export async function fetchBooks(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.genre && params.genre !== 'All') query.append('genre', params.genre);
    if (params.available) query.append('available', 'true');
    if (params.favorite) query.append('favorite', 'true');
    if (params.sort) query.append('sort', params.sort);

    const url = `${API_BASE}?${query.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch tomes.');
    }
    return await response.json();
  } catch (err) {
    // Fallback to local storage for static web hosting (GitHub Pages)
    let books = getLocalBooks();
    if (params.genre && params.genre !== 'All') {
      books = books.filter(b => b.genre === params.genre);
    }
    if (params.available) {
      books = books.filter(b => Number(b.copies_available) > 0);
    }
    if (params.favorite) {
      books = books.filter(b => Boolean(b.is_favorite));
    }
    if (params.search && params.search.trim()) {
      const s = params.search.toLowerCase();
      books = books.filter(b => 
        (b.title && b.title.toLowerCase().includes(s)) ||
        (b.author && b.author.toLowerCase().includes(s)) ||
        (b.isbn && b.isbn.toLowerCase().includes(s)) ||
        (b.description && b.description.toLowerCase().includes(s))
      );
    }

    if (params.sort) {
      books = [...books];
      switch (params.sort) {
        case 'year_asc': books.sort((a, b) => a.publish_year - b.publish_year); break;
        case 'year_desc': books.sort((a, b) => b.publish_year - a.publish_year); break;
        case 'rating_desc': books.sort((a, b) => b.rating - a.rating); break;
        case 'title_asc': books.sort((a, b) => a.title.localeCompare(b.title)); break;
        case 'author_asc': books.sort((a, b) => a.author.localeCompare(b.author)); break;
        case 'newest':
        default: books.sort((a, b) => b.id - a.id); break;
      }
    }

    return { success: true, count: books.length, data: books };
  }
}

export async function fetchBookById(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Tome not found.');
    }
    return await response.json();
  } catch (err) {
    const books = getLocalBooks();
    const book = books.find(b => Number(b.id) === Number(id));
    if (!book) throw new Error('Tome not found.');
    return { success: true, data: book };
  }
}

export async function createBook(bookData) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    const data = await response.json();
    if (!response.ok) {
      const msg = data.errors ? data.errors.join(' ') : (data.error || 'Failed to inscribe tome.');
      throw new Error(msg);
    }
    return data;
  } catch (err) {
    if (err.message && err.message !== 'Failed to fetch') throw err;
    const books = getLocalBooks();
    const newBook = {
      ...bookData,
      id: Date.now(),
      copies_available: Number(bookData.copies_available || 1),
      total_copies: Number(bookData.total_copies || 1),
      publish_year: Number(bookData.publish_year || new Date().getFullYear()),
      rating: Number(bookData.rating || 5.0),
      is_favorite: Boolean(bookData.is_favorite)
    };
    books.unshift(newBook);
    setLocalBooks(books);
    return { success: true, data: newBook };
  }
}

export async function updateBook(id, bookData) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    const data = await response.json();
    if (!response.ok) {
      const msg = data.errors ? data.errors.join(' ') : (data.error || 'Failed to annotate tome.');
      throw new Error(msg);
    }
    return data;
  } catch (err) {
    if (err.message && err.message !== 'Failed to fetch') throw err;
    const books = getLocalBooks();
    const index = books.findIndex(b => Number(b.id) === Number(id));
    if (index === -1) throw new Error('Tome not found.');
    books[index] = { ...books[index], ...bookData };
    setLocalBooks(books);
    return { success: true, data: books[index] };
  }
}

export async function deleteBook(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to excise tome from shelf.');
    }
    return data;
  } catch (err) {
    if (err.message && err.message !== 'Failed to fetch') throw err;
    const books = getLocalBooks();
    const book = books.find(b => Number(b.id) === Number(id));
    const filtered = books.filter(b => Number(b.id) !== Number(id));
    setLocalBooks(filtered);
    return { success: true, data: book || { title: 'Tome' } };
  }
}

export async function borrowBook(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}/borrow`, {
      method: 'POST'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to check out tome.');
    }
    return data;
  } catch (err) {
    if (err.message && err.message !== 'Failed to fetch') throw err;
    const books = getLocalBooks();
    const index = books.findIndex(b => Number(b.id) === Number(id));
    if (index === -1) throw new Error('Tome not found.');
    if (books[index].copies_available <= 0) {
      throw new Error('All copies of this tome are currently checked out.');
    }
    books[index].copies_available -= 1;
    setLocalBooks(books);
    return { 
      success: true, 
      message: `Checked out "${books[index].title}". Return within 14 days.`, 
      data: books[index] 
    };
  }
}

export async function returnBook(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}/return`, {
      method: 'POST'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to return tome to shelf.');
    }
    return data;
  } catch (err) {
    if (err.message && err.message !== 'Failed to fetch') throw err;
    const books = getLocalBooks();
    const index = books.findIndex(b => Number(b.id) === Number(id));
    if (index === -1) throw new Error('Tome not found.');
    if (books[index].copies_available >= books[index].total_copies) {
      throw new Error('All copies are already returned to the archives.');
    }
    books[index].copies_available += 1;
    setLocalBooks(books);
    return { 
      success: true, 
      message: `Returned "${books[index].title}" to the library shelf!`, 
      data: books[index] 
    };
  }
}

export async function toggleFavorite(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}/favorite`, {
      method: 'POST'
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to toggle bookmark.');
    }
    return data;
  } catch (err) {
    if (err.message && err.message !== 'Failed to fetch') throw err;
    const books = getLocalBooks();
    const index = books.findIndex(b => Number(b.id) === Number(id));
    if (index === -1) throw new Error('Tome not found.');
    books[index].is_favorite = !books[index].is_favorite;
    setLocalBooks(books);
    return { success: true, data: books[index] };
  }
}

export async function fetchGenres() {
  try {
    const response = await fetch(`${API_BASE}/genres`);
    if (!response.ok) {
      throw new Error('Failed to retrieve genres.');
    }
    return await response.json();
  } catch (err) {
    const books = getLocalBooks();
    const genres = Array.from(new Set(books.map(b => b.genre))).filter(Boolean).sort();
    return { success: true, data: genres };
  }
}

export async function fetchStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch library ledger statistics.');
    }
    return await response.json();
  } catch (err) {
    const books = getLocalBooks();
    const totalBooks = books.length;
    const totalCopies = books.reduce((acc, b) => acc + Number(b.total_copies || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + Number(b.copies_available || 0), 0);
    const borrowedCopies = totalCopies - availableCopies;
    const favoritesCount = books.filter(b => b.is_favorite).length;

    const genreMap = {};
    books.forEach(b => {
      genreMap[b.genre] = (genreMap[b.genre] || 0) + 1;
    });

    const genreStats = Object.keys(genreMap).map(g => ({
      genre: g,
      count: genreMap[g]
    }));

    return {
      success: true,
      data: {
        totalBooks,
        totalCopies,
        availableCopies,
        borrowedCopies,
        favoritesCount,
        genreStats
      }
    };
  }
}

export async function seedLibrary() {
  try {
    const response = await fetch(`${API_BASE}/seed`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Failed to reset library archives.');
    }
    return await response.json();
  } catch (err) {
    setLocalBooks(INITIAL_BOOKS);
    return { success: true, message: 'Library archives reset to original seed state.' };
  }
}
