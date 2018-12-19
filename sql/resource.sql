CREATE TABLE IF NOT EXISTS npc.resource (
     id INT NOT NULL AUTO_INCREMENT,
	url VARCHAR(700) NOT NULL UNIQUE,
     post_url VARCHAR(700) NOT NULL UNIQUE,
	source VARCHAR(200) NOT NULL,
     source_host VARCHAR(200) NOT NULL,
     date_found DATETIME NOT NULL,
     PRIMARY KEY (id)
);