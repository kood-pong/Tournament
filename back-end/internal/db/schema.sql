CREATE TABLE 
    IF NOT EXISTS tournaments (
        id text PRIMARY KEY UNIQUE NOT NULL,
        name text NOT NULL,
        start_date DATETIME,
        end_date DATETIME,
        type text
    );

CREATE TABLE
    IF NOT EXISTS users (
        id text PRIMARY KEY UNIQUE NOT NULL,
        email text UNIQUE NOT NULL,
        username text UNIQUE NOT NULL,
        password text NOT NULL,
        first_name text,
        last_name text,
        points integer DEFAULT 0,
        wins integer DEFAULT 0,
        losses integer DEFAULT 0,
        ranking integer DEFAULT 0,
        status text DEFAULT 'Pending',
        role integer DEFAULT 0
    );

CREATE TABLE
    IF NOT EXISTS matches (
        id text PRIMARY KEY UNIQUE NOT NULL,
        tournament_id text UNIQUE NOT NULL,
        player_1 text UNIQUE NOT NULL,
        player_2 text UNIQUE NOT NULL,
        sets_to_win text NOT NULL,
        completed integer,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
        FOREIGN KEY (player_1) REFERENCES user (id),
        FOREIGN KEY (player_2) REFERENCES user (id)
    );

CREATE TABLE
    IF NOT EXISTS sets (
        id text PRIMARY KEY UNIQUE NOT NULL,
        set_number integer NOT NULL,
        match_id text UNIQUE NOT NULL,
        player_1_score integer,
        player_2_score integer,
        FOREIGN KEY (match_id) REFERENCES matches (id)
    );

CREATE TABLE 
    IF NOT EXISTS results (
        id text PRIMARY KEY UNIQUE NOT NULL,
        match_id text UNIQUE NOT NULL,
        winner_id text UNIQUE NOT NULL,
        loser_id text UNIQUE NOT NULL,
        FOREIGN KEY (match_id) REFERENCES matches (id),
        FOREIGN KEY (winner_id) REFERENCES user (id),
        FOREIGN KEY (loser_id) REFERENCES user (id)
    );

CREATE TABLE 
    IF NOT EXISTS images (
        id text PRIMARY KEY UNIQUE NOT NULL,
        image_url text NOT NULL,
        tournament_id text UNIQUE NOT NULL,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
    );

CREATE TABLE
    IF NOT EXISTS registration (
        id text PRIMARY KEY UNIQUE NOT NULL,
        tournament_id text UNIQUE NOT NULL,
        user_id text UNIQUE NOT NULL,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
        FOREIGN KEY (user_id) REFERENCES user (id)
    );

CREATE TABLE 
    IF NOT EXISTS notification (
        id text PRIMARY KEY UNIQUE NOT NULL,
        user_id text UNIQUE NOT NULL,
        message text NOT NULL,
        status text NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user (id)
    );
