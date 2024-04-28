import db from './db'
const user = async () => {
	try {
		await db.command({
			query: `CREATE TABLE IF NOT EXISTS user (
        username String,
        user_number Int256 DEFAULT 0,
        name String,
        bio String DEFAULT '',
        email String,
        password String,
        followers Int256 DEFAULT 0,
        following Int256 DEFAULT 0,
        profile_picture String DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
        banner String DEFAULT '',
        level String DEFAULT 'Silent Soul',
        role String DEFAULT 'user',
        points Int256 DEFAULT 0,
        needs Int256 DEFAULT 100,
        links Array(String),
        verified Bool DEFAULT false,
        skills Array(String) DEFAULT [''],
        language Array(String) DEFAULT [''],
        joined DateTime64 DEFAULT now()
      ) ENGINE MergeTree()
      ORDER BY (username, name)
      PRIMARY KEY username`
		})
	} catch (e) {
		console.error(e)
	}
}

async function blog() {
	try {
		await db.command({
			query: `CREATE TABLE IF NOT EXISTS blog (
                id String,
                title String,
                author String,
                content String,
                cover String,
                likes Int256 DEFAULT 0,
                dislikes Int256 DEFAULT 0,
                views Int256 DEFAULT 0,
                comments String DEFAULT '{}',
                tags Array(String),
                images Array(String) DEFAULT [''],
                visible_to Array(String) DEFAULT ['everyone'],
                categories Array(String),
                published_at DateTime64 DEFAULT now()
            ) ENGINE MergeTree()
            ORDER BY (id, author)
            PRIMARY KEY id`
		})
	} catch (e) {
		console.error(e)
	}
}

async function videos() {
	try {
		await db.command({
			query: `CREATE TABLE IF NOT EXISTS videos (
                id String,
                title String,
                url String,
                creator String,
                description String,
                cover String,
                likes Int256 DEFAULT 0,
                dislikes Int256 DEFAULT 0,
                views Int256 DEFAULT 0,
                comments String DEFAULT '{}',
                tags Array(String),
                visible_to Array(String) DEFAULT ['everyone'],
                categories Array(String),
                published_at DateTime64 DEFAULT now()
            ) ENGINE MergeTree()
            ORDER BY (id, creator)
            PRIMARY KEY id`
		})
	} catch (e) {
		console.error(e)
	}
}

async function posts(){
    try {
        await db.command({
            query: `CREATE TABLE IF NOT EXISTS posts (
                id String,
                title String,
                url String,
                owner String,
                likes Int256 DEFAULT 0,
                dislikes Int256 DEFAULT 0,
                views Int256 DEFAULT 0,
                comments String DEFAULT '{}',
                tags Array(String),
                visible_to Array(String) DEFAULT ['everyone'],
                categories Array(String),
                published_at DateTime64 DEFAULT now()
            ) ENGINE MergeTree()
            ORDER BY (id, owner)
            PRIMARY KEY id`
        })
    } catch (e) {
        console.error(e)
    }
}

async function push() {
	await user()
	await blog()
	await videos()
    await posts()
}

push()
