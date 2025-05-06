DROP DATABASE IF EXISTS movies;
CREATE DATABASE movies;

USE movies;

CREATE TABLE movie (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    director VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    poster TEXT,
    rate DECIMAL(2, 1) UNSIGNED NOT NULL
);

CREATE TABLE genre (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movie_genres (
	movie_id BINARY(16) REFERENCES movie(id),
    genre_id INT REFERENCES genre(id),
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO genre (name) VALUES 
('Drama'),
('Action'),
('Crime'),
('Adventure'),
('Sci-Fi'),
('Romance');

INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN(UUID()), "Title 1", 2001, "Director 1", 181, "https://picsum.photos/200", 8.8),
(UUID_TO_BIN(UUID()), "Title 2", 2002, "Director 2", 182, "https://picsum.photos/200", 8.3),
(UUID_TO_BIN(UUID()), "Title 3", 2003, "Director 3", 183, "https://picsum.photos/200", 8.1),
(UUID_TO_BIN(UUID()), "Title 4", 2004, "Director 4", 184, "https://picsum.photos/200", 9.4),
(UUID_TO_BIN(UUID()), "Title 5", 2005, "Director 5", 185, "https://picsum.photos/200", 8.2),
(UUID_TO_BIN(UUID()), "Title 6", 2006, "Director 6", 186, "https://picsum.photos/200", 9.9),
(UUID_TO_BIN(UUID()), "Title 7", 2007, "Director 7", 187, "https://picsum.photos/200", 9.7);

INSERT INTO movie_genres (movie_id, genre_id) VALUES
((SELECT id FROM movie WHERE title = 'Title 1'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'Title 2'), (SELECT id FROM genre WHERE name = 'Action')),
((SELECT id FROM movie WHERE title = 'Title 1'), (SELECT id FROM genre WHERE name = 'Sci-Fi')),
((SELECT id FROM movie WHERE title = 'Title 2'), (SELECT id FROM genre WHERE name = 'Crime')),
((SELECT id FROM movie WHERE title = 'Title 3'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'Title 3'), (SELECT id FROM genre WHERE name = 'Action')),
((SELECT id FROM movie WHERE title = 'Title 4'), (SELECT id FROM genre WHERE name = 'Crime')),
((SELECT id FROM movie WHERE title = 'Title 5'), (SELECT id FROM genre WHERE name = 'Romance')),
((SELECT id FROM movie WHERE title = 'Title 4'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'Title 5'), (SELECT id FROM genre WHERE name = 'Action')),
((SELECT id FROM movie WHERE title = 'Title 6'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'Title 7'), (SELECT id FROM genre WHERE name = 'Adventure')),
((SELECT id FROM movie WHERE title = 'Title 7'), (SELECT id FROM genre WHERE name = 'Crime')),
((SELECT id FROM movie WHERE title = 'Title 6'), (SELECT id FROM genre WHERE name = 'Adventure'));

SELECT *, BIN_TO_UUID(id) FROM movie;