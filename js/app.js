// 1. Mảng dữ liệu Phim
const movies = [
    {
        id: 1,
        title: "Inception",
        year: 2010,
        genres: ["Hành động", "Khoa học viễn tưởng"],
        poster: "https://via.placeholder.com/300x450/111/fff?text=Inception",
        director: "Christopher Nolan",
        actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
        description: "Một kẻ trộm thâm nhập vào giấc mơ của người khác để đánh cắp bí mật."
    },
    {
        id: 2,
        title: "The Dark Knight",
        year: 2008,
        genres: ["Hành động", "Tội phạm"],
        poster: "https://via.placeholder.com/300x450/222/fff?text=Dark+Knight",
        director: "Christopher Nolan",
        actors: "Christian Bale, Heath Ledger",
        description: "Batman đối đầu với tên tội phạm tâm thần Joker tại thành phố Gotham."
    },
    {
        id: 3,
        title: "Interstellar",
        year: 2014,
        genres: ["Khoa học viễn tưởng", "Phiêu lưu"],
        poster: "https://via.placeholder.com/300x450/333/fff?text=Interstellar",
        director: "Christopher Nolan",
        actors: "Matthew McConaughey, Anne Hathaway",
        description: "Chuyến du hành không gian tìm kiếm hành tinh mới cho loài người."
    },
    {
        id: 4,
        title: "Titanic",
        year: 1997,
        genres: ["Tình cảm", "Chính kịch"],
        poster: "https://via.placeholder.com/300x450/444/fff?text=Titanic",
        director: "James Cameron",
        actors: "Leonardo DiCaprio, Kate Winslet",
        description: "Câu chuyện tình yêu lãng mạn trên con tàu định mệnh Titanic."
    },
    {
        id: 5,
        title: "Avatar",
        year: 2009,
        genres: ["Hành động", "Khoa học viễn tưởng", "Phiêu lưu"],
        poster: "https://via.placeholder.com/300x450/555/fff?text=Avatar",
        director: "James Cameron",
        actors: "Sam Worthington, Zoe Saldana",
        description: "Chuyến phiêu lưu của cựu binh lính tại hành tinh Pandora."
    }
];

// Các phần tử DOM
const movieGrid = document.getElementById('movie-grid');
const genreCheckboxesContainer = document.getElementById('genre-checkboxes');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const modal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body-content');
const closeModalBtn = document.getElementById('close-modal');

// --- BÀI 1 & BÀI 3: DARK/LIGHT MODE VỚI LOCALSTORAGE ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
}

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

// --- BÀI 2.1: HIỂN THỊ DANH SÁCH PHIM ---
function renderMovies(movieList) {
    movieGrid.innerHTML = '';
    if (movieList.length === 0) {
        movieGrid.innerHTML = '<p>Không tìm thấy phim phù hợp.</p>';
        return;
    }

    movieList.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-card-info">
                <h4>${movie.title}</h4>
                <p>${movie.year} | ${movie.genres.join(', ')}</p>
            </div>
        `;
        // BÀI 3.1: Sự kiện click mở Modal
        card.addEventListener('click', () => openModal(movie));
        movieGrid.appendChild(card);
    });
}

// --- BÀI 2.2: TỰ ĐỘNG TẠO CHECKBOX THỂ LOẠI ---
function renderGenreCheckboxes() {
    const genresSet = new Set();
    movies.forEach(movie => movie.genres.forEach(g => genresSet.add(g)));

    genresSet.forEach(genre => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" value="${genre}" class="genre-checkbox"> ${genre}
        `;
        genreCheckboxesContainer.appendChild(label);
    });

    document.querySelectorAll('.genre-checkbox').forEach(cb => {
        cb.addEventListener('change', filterMovies);
    });
}

// --- BÀI 2.4: TƯ DUY TÍCH HỢP (LỌC TÌM KIẾM + THỂ LOẠI ĐỒNG THỜI) ---
function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked'))
                                 .map(cb => cb.value);

    const filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenres.length === 0 || 
                             selectedGenres.every(g => movie.genres.includes(g));
        return matchesSearch && matchesGenre;
    });

    renderMovies(filtered);
}

// --- BÀI 2.5: KĨ THUẬT DEBOUNCE CHO TÌM KIẾM ---
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

searchInput.addEventListener('input', debounce(filterMovies, 400));

// --- BÀI 3.1: MODAL CHI TIẾT PHIM ---
function openModal(movie) {
    modalBody.innerHTML = `
        <div class="modal-detail">
            <img src="${movie.poster}" alt="${movie.title}">
            <div>
                <h2>${movie.title} (${movie.year})</h2>
                <p><strong>Thể loại:</strong> ${movie.genres.join(', ')}</p>
                <p><strong>Đạo diễn:</strong> ${movie.director}</p>
                <p><strong>Diễn viên:</strong> ${movie.actors}</p>
                <p style="margin-top:10px;"><strong>Mô tả:</strong> ${movie.description}</p>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Khởi chạy khi load trang
initTheme();
renderGenreCheckboxes();
renderMovies(movies);