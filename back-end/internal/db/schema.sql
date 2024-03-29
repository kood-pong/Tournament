CREATE TABLE 
    IF NOT EXISTS tournaments (
        id text PRIMARY KEY UNIQUE NOT NULL,
        name text NOT NULL,
        start_date DATETIME,
        end_date DATETIME,
        type text,
        status text DEFAULT 'open'
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
        status text DEFAULT 'pending',
        role integer DEFAULT 0
    );

CREATE TABLE
    IF NOT EXISTS matches (
        id text PRIMARY KEY UNIQUE NOT NULL,
        tournament_id text NOT NULL,
        player_1 text NOT NULL,
        player_2 text NOT NULL,
        sets_to_win integer NOT NULL,
        status text DEFAULT 'ongoing',
        current_round integer,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
        FOREIGN KEY (player_1) REFERENCES user (id),
        FOREIGN KEY (player_2) REFERENCES user (id)
    );

CREATE TABLE
    IF NOT EXISTS sets (
        id text PRIMARY KEY UNIQUE NOT NULL,
        set_number integer NOT NULL,
        match_id text NOT NULL,
        player_1_score integer,
        player_2_score integer,
        FOREIGN KEY (match_id) REFERENCES matches (id)
    );

CREATE TABLE 
    IF NOT EXISTS results (
        id text PRIMARY KEY UNIQUE NOT NULL,
        match_id text NOT NULL,
        winner_id text NOT NULL,
        loser_id text NOT NULL,
        points integer,
        FOREIGN KEY (match_id) REFERENCES matches (id),
        FOREIGN KEY (winner_id) REFERENCES user (id),
        FOREIGN KEY (loser_id) REFERENCES user (id)
    );

CREATE TABLE 
    IF NOT EXISTS images (
        id text PRIMARY KEY UNIQUE NOT NULL,
        image_url text NOT NULL,
        tournament_id text NOT NULL,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
    );

CREATE TABLE
    IF NOT EXISTS registration (
        id text PRIMARY KEY UNIQUE NOT NULL,
        tournament_id text NOT NULL,
        user_id text NOT NULL,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
        FOREIGN KEY (user_id) REFERENCES user (id)
    );

CREATE TABLE 
    IF NOT EXISTS notification (
        id text PRIMARY KEY UNIQUE NOT NULL,
        user_id text NOT NULL,
        message text NOT NULL,
        status text NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user (id)
    );


-- --populate database
-- INSERT INTO tournaments (id, name, start_date, end_date, type, status) VALUES
--     ('d216b845-2c9d-44ad-83dd-28e1a7f5f6e7', 'Tournament A', '2024-02-14', '2024-02-20', 'Type A', 'finished'),
--     ('d216b845-2c9d-44ad-83dd-28e1a7f5fabc', 'Tournament B', '2024-03-01', '2024-03-07', 'Type B', 'open');

-- -- -- -- Inserting sample users

-- INSERT INTO users (id, email, username, password, first_name, last_name, points, wins, losses, ranking, status, role) VALUES
--     ('3be5843d-a7ca-468a-af8f-7aaa5d5c7e5c', 'test@gmail.com', 'testUsername', '$2a$04$VKgWVOAFGqKSJhdnxS/u.eCeel1qJ5AUKbzZ99kqCjmR5BoyH7Bh6', 'John', 'Doe', 100, 10, 5, 1, 'approved', 1),
--     ('671d27dd-df43-4824-8e1c-33cadea83b2b', 'test1@gmail.com', 'testUsername1', '$2a$04$eHcwEGFqj4YtQYvbmcxpneXEhYNONBRL/VcBDQasjXkbLqmUvbsWK', 'Jane', 'Smith', 80, 8, 7, 2, 'approved', 1),
--     ('bc1c3523-bf22-4da0-b3b5-7df8cf5de03b', 'test2@gmail.com', 'testUsername2', '$2a$04$RYMfWN85.lQ/mNd1RntuE.0U7JCDUEpgbD2IznJrMTLQ6A4AYRh8W', 'Admin', 'User', 0, 0, 0, 0, 'approved', 1),
--     ('9a7a817a-ad6a-467b-a8fd-cd4061a1cc14', 'test3@gmail.com', 'testUsername3', '$2a$04$WXdStEy32RWwEX4y1GoqMeyIEdwmF2qoL8YbvrQJYr2mFtIBXCNUy', 'first_name', 'last_name', 0, 0, 0, 0, 'pending', 0),
--     ('65019b82-64a2-42e6-a635-db11bd4e7040', 'test4@gmail.com', 'testUsername4', '$2a$04$XLlXmeSjSChfVkXXva66EO1O6osBOxiJFKRe8Qnz0wkOEQfDO.gdm', 'first_name', 'last_name', 0, 0, 0, 0, 'rejected', 0),
--     ('6054980f-4db0-4b7f-8579-af31db422a64', 'test5@gmail.com', 'testUsername5', '$2a$04$.Sc4x8HvdBXipPwzuVggfuLEgglAcgRrAdWZIoAPWFeHAxFcdlMfO', 'test', 'User5', 0, 0, 0, 0, 'approved', 0);



-- INSERT INTO registration (id, tournament_id, user_id) VALUES
--     ('d216b845-2c9d-44ad-83dd-28e1a7f5f6e1', 'd216b845-2c9d-44ad-83dd-28e1a7f5fabc', '3be5843d-a7ca-468a-af8f-7aaa5d5c7e5c'),
--     ('d216b845-2c9d-44ad-83dd-28e1a7f5f6e2', 'd216b845-2c9d-44ad-83dd-28e1a7f5fabc', '671d27dd-df43-4824-8e1c-33cadea83b2b'),
--     ('d216b845-2c9d-44ad-83dd-28e1a7f5f6e3', 'd216b845-2c9d-44ad-83dd-28e1a7f5fabc', 'bc1c3523-bf22-4da0-b3b5-7df8cf5de03b'),
--     ('d216b845-2c9d-44ad-83dd-28e1a7f5f6e4', 'd216b845-2c9d-44ad-83dd-28e1a7f5fabc', '6054980f-4db0-4b7f-8579-af31db422a64');

