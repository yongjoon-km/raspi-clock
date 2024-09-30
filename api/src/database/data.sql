INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');

INSERT INTO posts (title, content, user_id) 
VALUES ('First Post', 'This is Alice', 1);

INSERT INTO posts (title, content, user_id) 
VALUES ('Second Post', 'This is Bob', 2);