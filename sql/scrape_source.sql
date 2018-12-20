CREATE TABLE IF NOT EXISTS npc.scrape_source (
	host VARCHAR(300) NOT NULL,
	source VARCHAR(300) NOT NULL,
	PRIMARY KEY (host,source)
);