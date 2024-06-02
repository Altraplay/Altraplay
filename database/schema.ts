import { executeQuery } from './db'

async function push() {
	await executeQuery(`CREATE TYPE IF NOT EXISTS reply (
        who text,
        msg text,
        date timestamp
    )`)

	await executeQuery(`CREATE TYPE IF NOT EXISTS comment (
        who text,
        msg text,
        replies list<frozen<reply>>,
        date timestamp
    )`)

	await executeQuery(`CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY,
        username text,
        name text,
        bio text,
        email text,
        password text,
        followers bigint,
        following set<text>,
        profile_picture text,
        banner text,
        level text,
        role text,
        points bigint,
        needs bigint,
        links set<text>,
        verified boolean,
        skills set<text>,
        languages set<text>,
        team set<text>,
        notifications map<text, text>,
        is_history_on boolean,
        liked set<text>,
        disliked set<text>,
        only_visible_to text,
        is_email_verified boolean,
        verification_token text,
        earning map<text, text>,
        achievements map<text, text>,
        joined timestamp
    );`)

	await executeQuery(`CREATE TABLE IF NOT EXISTS blogs (
        id text PRIMARY KEY,
        title text,
        author text,
        content text,
        cover text,
        likes bigint,
        dislikes bigint,
        views bigint,
        comments list<frozen<comment>>,
        tags set<text>,
        images list<text>,
        visible_to set<text>,
        categories set<text>,
        published_at timestamp
    );`)

	await executeQuery(`CREATE TABLE IF NOT EXISTS videos (
        id text PRIMARY KEY,
        title text,
        url text,
        creator text,
        description text,
        cover text,
        likes bigint,
        dislikes bigint,
        views bigint,
        comments list<frozen<comment>>,
        tags set<text>,
        visible_to set<text>,
        categories set<text>,
        published_at timestamp
    );`)

	await executeQuery(`CREATE TABLE IF NOT EXISTS posts (
        id text PRIMARY KEY,
        title text,
        url text,
        owner text,
        likes bigint,
        dislikes bigint,
        views bigint,
        comments list<frozen<comment>>,
        tags set<text>,
        visible_to set<text>,
        categories set<text>,
        published_at timestamp
    );`)

	await executeQuery(`CREATE TABLE IF NOT EXISTS messages (
        id text PRIMARY KEY,
        sender text,
        receiver text,
        message text,
        read boolean,
        reply_of text,
        edited boolean,
        sent_at timestamp
    );`)

	await executeQuery(`CREATE TABLE IF NOT EXISTS history (
        id text PRIMARY KEY,
        user text,
        visit_url text,
        type text,
        time timestamp
    );`)

	await executeQuery(`CREATE TABLE IF NOT EXISTS search_history (
        id text PRIMARY KEY,
        user text,
        query text,
        time timestamp
    );`)
	process.exit(0)
}

push()
