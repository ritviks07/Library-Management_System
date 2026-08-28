const API_BASE = '/api/books';

export async function fetchBooks(params = {}) {
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
  return response.json();
}

export async function fetchBookById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Tome not found.');
  }
  return response.json();
}

export async function createBook(bookData) {
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
}

export async function updateBook(id, bookData) {
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
}

export async function deleteBook(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to excise tome from shelf.');
  }
  return data;
}

export async function borrowBook(id) {
  const response = await fetch(`${API_BASE}/${id}/borrow`, {
    method: 'POST'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to check out tome.');
  }
  return data;
}

export async function returnBook(id) {
  const response = await fetch(`${API_BASE}/${id}/return`, {
    method: 'POST'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to return tome to shelf.');
  }
  return data;
}

export async function toggleFavorite(id) {
  const response = await fetch(`${API_BASE}/${id}/favorite`, {
    method: 'POST'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to toggle bookmark.');
  }
  return data;
}

export async function fetchGenres() {
  const response = await fetch(`${API_BASE}/genres`);
  if (!response.ok) {
    throw new Error('Failed to retrieve genres.');
  }
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch library ledger statistics.');
  }
  return response.json();
}

export async function seedLibrary() {
  const response = await fetch(`${API_BASE}/seed`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to reset library archives.');
  }
  return response.json();
}
